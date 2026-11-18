"use client";

import { useEffect, useRef, useState } from "react";
import { FiSkipBack, FiSkipForward, FiPlay, FiPause, FiVolume2, FiVolumeX, FiMusic } from "react-icons/fi";
import styles from "./soundtrack.module.css";

import type { Song } from "@/lib/soundtrack";

function shuffle(length: number, last?: number) {
  const order = Array.from({ length }, (_, index) => index);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  if (order.length > 1 && order[0] === last) {
    const j = 1 + Math.floor(Math.random() * (order.length - 1));
    [order[0], order[j]] = [order[j], order[0]];
  }
  return order;
}

type Queue = {
  history: number[];
  cursor: number;
  upcoming: number[];
};

export function Atmosphere({ songs }: { songs: Song[] }) {
  const [queue, setQueue] = useState<Queue>();
  const song = queue && songs[queue.history[queue.cursor]];
  const track = song?.src;
  const levelRef = useRef(40);
  const mutedRef = useRef(false);
  const audio = useRef<HTMLAudioElement>(null);
  const startPlayback = useRef<() => void>(() => {});
  const resumeAutomatically = useRef<() => void>(() => {});
  const autoplayReady = useRef(false);
  const ownsPlayer = useRef(false);
  const acquirePlayer = useRef<() => void>(() => {});
  const releasePlayer = useRef<() => void>(() => {});
  const playTrack = useRef<() => void>(() => {});
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(40);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const [first, ...upcoming] = shuffle(songs.length);
      setQueue(first === undefined ? undefined : { history: [first], cursor: 0, upcoming });
    });
    return () => cancelAnimationFrame(frame);
  }, [songs.length]);

  useEffect(() => {
    const listeners = new AbortController();
    const hero = document.querySelector<HTMLImageElement>("img[data-critical-image]");
    let frame = 0;

    function afterPaint() {
      if (listeners.signal.aborted) return;
      // Yield a paint to the hero before asking the browser to download audio.
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          autoplayReady.current = true;
          resumeAutomatically.current();
        });
      });
    }

    if (hero) {
      void hero.decode().then(afterPaint, afterPaint);
    } else if (document.readyState === "complete") {
      afterPaint();
    } else {
      window.addEventListener("load", afterPaint, { once: true, signal: listeners.signal });
    }

    return () => {
      listeners.abort();
      cancelAnimationFrame(frame);
    };
  }, []);

  // Keep one playback owner for the whole session, including when a track ends in a hidden tab.
  useEffect(() => {
    let ownership: AbortController | undefined;

    function release() {
      if (ownsPlayer.current) audio.current?.pause();
      ownsPlayer.current = false;
      ownership?.abort();
      ownership = undefined;
    }

    function acquire() {
      if (ownsPlayer.current) {
        playTrack.current();
        return;
      }
      if (ownership || document.hidden) return;
      if (!navigator.locks) {
        if (!document.hasFocus()) return;
        ownsPlayer.current = true;
        playTrack.current();
        return;
      }
      ownership = new AbortController();
      const { signal } = ownership;
      void navigator.locks.request("portfolio-soundtrack", { signal }, async () => {
        if (signal.aborted) return;
        if (document.hidden) {
          ownership = undefined;
          return;
        }
        ownsPlayer.current = true;
        playTrack.current();
        await new Promise<void>(resolve => signal.addEventListener("abort", () => resolve(), { once: true }));
      }).catch(() => { /* Navigation or a closed page can cancel a pending request. */ });
    }

    acquirePlayer.current = acquire;
    releasePlayer.current = release;
    window.addEventListener("pagehide", release);
    return () => {
      window.removeEventListener("pagehide", release);
      release();
      acquirePlayer.current = () => {};
      releasePlayer.current = () => {};
    };
  }, []);

  useEffect(() => {
    const player = audio.current;
    if (!track || !player) return;
    player.volume = levelRef.current / 100;
    player.muted = mutedRef.current;

    const listeners = new AbortController();
    const checkpoint = "portfolio-position:" + track;
    let pending = false;
    let attempted = false;
    let playbackRequested = false;

    function play() {
      if (manuallyPaused.current || !ownsPlayer.current || pending || !player!.paused) return;
      if (!attempted) {
        attempted = true;
        try {
          const time = Number(localStorage.getItem(checkpoint));
          if (Number.isFinite(time) && time > 0) player!.currentTime = time;
        } catch {}
      }
      pending = true;
      void player!.play().catch((error: unknown) => {
        if (!ownsPlayer.current || listeners.signal.aborted) return;
        if (error instanceof DOMException && error.name === "NotAllowedError") {
          setNotice("Select Play to start the soundtrack.");
          releasePlayer.current();
        } else if (!(error instanceof DOMException && error.name === "AbortError")) {
          setNotice("This track could not be played.");
          releasePlayer.current();
        }
      }).finally(() => { pending = false; });
    }

    function savePosition() {
      if (attempted && player!.currentTime > 0 && !player!.ended) {
        try { localStorage.setItem(checkpoint, String(player!.currentTime)); } catch {}
      }
    }

    function synchronize() {
      if (!manuallyPaused.current && (autoplayReady.current || playbackRequested)) {
        acquirePlayer.current();
      }
    }

    playTrack.current = play;
    resumeAutomatically.current = synchronize;
    startPlayback.current = () => {
      playbackRequested = true;
      synchronize();
    };
    function unlock(event: Event) {
      if (event.target instanceof Element && event.target.closest("[data-soundtrack]")) return;
      startPlayback.current();
    }
    for (const event of ["click", "keydown"]) {
      window.addEventListener(event, unlock, { capture: true, signal: listeners.signal });
    }
    for (const event of ["focus", "pageshow"]) {
      window.addEventListener(event, synchronize, { capture: true, signal: listeners.signal });
    }
    window.addEventListener("pagehide", savePosition, { signal: listeners.signal });
    document.addEventListener("visibilitychange", synchronize, { signal: listeners.signal });
    synchronize();
    return () => {
      startPlayback.current = () => {};
      resumeAutomatically.current = () => {};
      playTrack.current = () => {};
      listeners.abort();
      player.pause();
      savePosition();
    };
  }, [track]);

  function skip(direction: -1 | 1) {
    if (!queue || songs.length < 2) return;
    const cursor = queue.cursor + direction;
    if (cursor < 0) return;

    let next: Queue;
    if (cursor < queue.history.length) {
      next = { ...queue, cursor };
    } else {
      const [songIndex, ...upcoming] = queue.upcoming.length
        ? queue.upcoming
        : shuffle(songs.length, queue.history[queue.cursor]);
      const history = [...queue.history.slice(-99), songIndex];
      next = { history, cursor: history.length - 1, upcoming };
    }

    try { localStorage.removeItem("portfolio-position:" + songs[next.history[next.cursor]].src); } catch {}
    setNotice("");
    setPlaying(false);
    setQueue(next);
  }

  return <>
    {song && <section className={styles.player} aria-label="Soundtrack player" data-soundtrack data-playing={playing}>
      <audio key={track} ref={audio} src={track} loop={songs.length === 1} onEnded={() => skip(1)} preload="none"
        onPlaying={() => { setPlaying(true); setNotice(""); }}
        onPause={() => setPlaying(false)} />
      <div className={styles.inner}>
        <FiMusic className={styles.note} aria-hidden="true" />
        <div className={styles.credit}>
          <strong>{song.title}</strong><span>{song.artist}</span>
          {notice && <small role="status">{notice}</small>}
        </div>
        <button type="button" aria-label="Previous track" disabled={!queue?.cursor} onClick={() => skip(-1)}><FiSkipBack /></button>
        <button type="button" aria-label={playing ? "Pause soundtrack" : "Play soundtrack"} onClick={() => {
          if (playing) {
            manuallyPaused.current = true;
            audio.current?.pause();
          } else {
            manuallyPaused.current = false;
            startPlayback.current();
          }
        }}>{playing ? <FiPause /> : <FiPlay />}</button>
        <button type="button" aria-label="Next track" disabled={songs.length < 2} onClick={() => skip(1)}><FiSkipForward /></button>
        <div className={styles.speaker}>
        <button type="button" aria-label={muted ? "Unmute soundtrack" : "Mute soundtrack"} onClick={() => {
          const player = audio.current;
          if (!player) return;
          player.muted = !player.muted;
          mutedRef.current = player.muted;
          setMuted(player.muted);
          if (!player.muted) startPlayback.current();
        }}>{muted ? <FiVolumeX /> : <FiVolume2 />}</button>
        <label className={styles.volume}>
          <input aria-label="Soundtrack volume" aria-orientation="horizontal" aria-valuetext={volume + "%"}
            type="range" min="0" max="100" value={volume} onChange={event => {
              const level = event.currentTarget.valueAsNumber;
              const player = audio.current;
              if (!player) return;
              player.volume = level / 100;
              player.muted = false;
              levelRef.current = level;
              mutedRef.current = false;
              setMuted(false);
              setVolume(level);
              startPlayback.current();
            }} />
          <span>{volume}%</span>
        </label>
        </div>
      </div>
    </section>}
  </>;
}
