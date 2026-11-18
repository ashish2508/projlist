import {
  MobilePetalNavigation,
  PetalNavigation,
} from "@/components/petal-navigation";
import { SelectedWork } from "@/components/selected-work";
import { ScrollCue } from "@/components/scroll-cue";
import Link from "next/link";
import { projectItems } from "@/lib/project-data";
import styles from "./home.module.css";

export default function Home() {
  return (
    <main className={styles.home} data-scene-home>
      {/* ─── Hero: exactly 100svh ────────────────────────────────────────── */}
      <section
        className={styles.hero}
        aria-label="Hero section"
        data-scene-hero
        data-scene-paused
      >
        <header className={styles.header}>
          <Link href="/" prefetch={false} className={styles.brand}>
            <span aria-hidden="true">✿</span> Ashish Jha
          </Link>
        </header>

        <PetalNavigation />

        <div className={styles.intro} aria-labelledby="name">
          <p className={styles.eyebrow}>Full-stack engineer</p>
          <h1 id="name">
            Ashish <em>Jha.</em>
          </h1>
          <p className={styles.summary}>
            Building realtime, full-stack products, from browser-based code
            execution to cloud storage.
          </p>
          <MobilePetalNavigation />
        </div>

        <ScrollCue />
      </section>

      {/* ─── Below Fold: Selected Work ───────────────────────────────────── */}
      <SelectedWork projects={projectItems.slice(0, 3)} />

      {/* ─── Footer: at bottom of page after the card ─────────────────────── */}
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Ashish Jha</span>
        <a href="/rss.xml">Project feed ↗</a>
      </footer>
    </main>
  );
}
