import styles from "./scroll-cue.module.css";

export function ScrollCue() {
  return <div className={styles.scrollCue} data-scroll-cue aria-hidden="true">Scroll</div>;
}
