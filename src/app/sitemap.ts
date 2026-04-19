import type { MetadataRoute } from "next";
import { projectItems } from "@/lib/project-data";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

export default function sitemap(): MetadataRoute.Sitemap {
  const corePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
  ];

  const projectPages: MetadataRoute.Sitemap = projectItems.map((project) => ({
    url: project.url.startsWith("http") ? project.url : `${baseUrl}${project.url}`,
    lastModified: new Date(),
  }));

  return [...corePages, ...projectPages];
}
