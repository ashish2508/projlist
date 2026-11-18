import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { Room } from "@/components/room";
import { projectItems } from "@/lib/project-data";

export const metadata: Metadata = { title: "Projects | Ashish Jha" };

export default function ProjectsPage() {
  return (
    <Room id="projects">
      <ul className="room-grid">
        {projectItems.map((project) => <li key={project.name}><ProjectCard project={project} /></li>)}
      </ul>
    </Room>
  );
}
