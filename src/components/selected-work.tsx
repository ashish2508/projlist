import Link from "next/link";
import type { ProjectItem } from "@/lib/project-data";
import styles from "./selected-work.module.css";

export function SelectedWork({ projects }: { projects: ProjectItem[] }) {
  return (
    <section
      id="work"
      className={styles.work}
      aria-labelledby="selected-work-title"
    >
      <div className={styles.sectionHead}>
        <h2 id="selected-work-title">Selected work</h2>
        <Link href="/projects" prefetch={false} className={styles.allLink}>
          All projects ↗
        </Link>
      </div>

      <div className={styles.projects}>
        {projects.map((project, idx) => (
          <a
            key={project.name}
            className={styles.project}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ "--stagger-delay": `${idx * 80}ms` } as React.CSSProperties}
          >
            <h3>
              {project.name}
              <span aria-hidden="true" className={styles.arrow}>↗</span>
            </h3>
            <p>{project.summary}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
