import projects from "./projects.json";

export type ProjectItem = {
  name: string;
  summary: string;
  url: string;
};

export const projectItems = projects as ProjectItem[];
