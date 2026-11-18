import type { ProjectItem } from "@/lib/project-data";
import styles from "./project-card.module.css";

export function ProjectCard({ project }: { project: ProjectItem }) {
  const urlLabel = project.url.replace(/^https?:\/\//, "");

  return (
    <a className={styles.card} href={project.url} rel="noopener noreferrer" target="_blank">
      <div className={styles.titleRow}>
        <h2>{project.name}</h2>
        <span aria-hidden="true">↗</span>
      </div>
      <p>{project.summary}</p>
      <span className={styles.url}>{urlLabel}</span>
    </a>
  );
}
