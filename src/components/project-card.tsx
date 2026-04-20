import type { ProjectItem } from "@/lib/project-data";
import styles from "./project-card.module.css";

type ProjectCardProps = {
  project: ProjectItem;
  variant?: "compact" | "detailed";
};

export function ProjectCard({
  project,
  variant = "detailed",
}: ProjectCardProps) {
  const urlLabel = project.url.replace(/^https?:\/\//, "");
  const isCompact = variant === "compact";

  return (
    <a
      className={`${styles.card} ${isCompact ? styles.compact : styles.detailed}`}
      data-project-node={isCompact ? true : undefined}
      data-project-tile={!isCompact ? true : undefined}
      href={project.url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className={styles.titleRow}>
        <h3>{project.name}</h3>
        <span aria-hidden="true" className={styles.arrow}>
          ↗
        </span>
      </div>
      <p className={styles.summary}>{project.summary}</p>
      <div className={styles.footer}>
        <span className={styles.url}>{urlLabel}</span>
        {!isCompact ? <span className={styles.cta}>Visit project</span> : null}
      </div>
    </a>
  );
}
