"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SceneBehavior({ artworkWidth }: { artworkWidth: number }) {
  const router = useRouter();

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-scene-hero]");
    if (!hero) return;

    const artwork = hero.querySelector<HTMLElement>("[data-scene-artwork]");
    const cue = hero.querySelector<HTMLElement>("[data-scroll-cue]");
    const image = hero.querySelector<HTMLImageElement>("[data-critical-image]");
    const work = document.getElementById("work");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let onScreen = true;
    let ready = false;
    let frame = 0;
    let timer: ReturnType<typeof setTimeout>;
    let dropping: Element | undefined;

    function updateMotion() {
      hero?.toggleAttribute("data-scene-paused", !ready || !onScreen || document.hidden);
    }

    function startMotion() {
      frame = requestAnimationFrame(() => {
        ready = true;
        updateMotion();
      });
    }

    const resize = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width;
      if (width) artwork?.style.setProperty("--pendant-scale", String(artworkWidth / width));
    });
    if (artwork) resize.observe(artwork);

    const visibility = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === hero) {
          onScreen = entry.isIntersecting;
          updateMotion();
        } else if (entry.isIntersecting) {
          entry.target.setAttribute("data-revealed", "true");
          visibility.unobserve(entry.target);
        }
      }
    }, { threshold: [0, .2] });
    visibility.observe(hero);
    if (work) {
      if (motion.matches) work.setAttribute("data-revealed", "true");
      else {
        work.setAttribute("data-js", "true");
        visibility.observe(work);
      }
    }

    function fadeCue() {
      if (window.scrollY <= 24) return;
      cue?.setAttribute("data-faded", "true");
      window.removeEventListener("scroll", fadeCue);
    }

    function navigate(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
          event.shiftKey || event.altKey || motion.matches || !(event.target instanceof Element)) return;

      const link = event.target.closest("[data-pendant-link]");
      const href = link?.getAttribute("href");
      const pendant = link?.querySelector("[data-falling]");
      if (!href || !pendant) return;

      event.preventDefault();
      clearTimeout(timer);
      dropping?.setAttribute("data-falling", "false");
      pendant.setAttribute("data-falling", "true");
      dropping = pendant;
      timer = setTimeout(() => {
        router.push(href);
        timer = setTimeout(() => pendant.setAttribute("data-falling", "false"), 350);
      }, 220);
    }

    if (!image || image.complete) startMotion();
    else {
      image.addEventListener("load", startMotion, { once: true });
      image.addEventListener("error", startMotion, { once: true });
    }
    hero.addEventListener("click", navigate, true);
    document.addEventListener("visibilitychange", updateMotion);
    window.addEventListener("scroll", fadeCue, { passive: true });
    fadeCue();

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      dropping?.setAttribute("data-falling", "false");
      resize.disconnect();
      visibility.disconnect();
      image?.removeEventListener("load", startMotion);
      image?.removeEventListener("error", startMotion);
      hero.removeEventListener("click", navigate, true);
      document.removeEventListener("visibilitychange", updateMotion);
      window.removeEventListener("scroll", fadeCue);
    };
  }, [artworkWidth, router]);

  return null;
}
