export type ProjectItem = {
  name: string;
  summary: string;
  url: string;
  year: number;
  stack: string;
  status: "Live" | "Beta" | "Archived";
  highlights: string[];
};

export const projectItems: ProjectItem[] = [
  {
    name: "Type-DD",
    summary:
      "Browser-based multi-language code execution platform designed for concurrent usage.",
    url: "https://code.bysao.dev",
    year: 2026,
    stack: "Next.js, Convex, Piston API, Clerk, Zustand",
    status: "Live",
    highlights: [
      "Built queue-driven execution workflows with realtime state updates.",
      "Integrated Piston API sandboxing with controlled execution resources.",
      "Reduced end-to-end latency by optimizing request batching and DB writes.",
    ],
  },
  {
    name: "Memeify",
    summary:
      "Full-stack content platform for creating, editing, and sharing memes with robust moderation.",
    url: "https://memeify.bysao.dev",
    year: 2025,
    stack: "React, Convex, PostgreSQL, Drizzle ORM",
    status: "Live",
    highlights: [
      "Modeled schema with Drizzle to improve relational consistency.",
      "Integrated image optimization, compression, and CDN-backed delivery.",
      "Implemented authentication, access control, and user-specific content scopes.",
    ],
  },
  {
    name: "Cloud-Drive",
    summary:
      "Realtime cloud storage system with file synchronization and hierarchical management.",
    url: "https://cloud.bysao.dev",
    year: 2026,
    stack: "Convex, UploadThing, React, TypeScript",
    status: "Beta",
    highlights: [
      "Engineered scalable metadata models for upload sessions and hierarchy.",
      "Added secure file upload pipeline using UploadThing validations.",
      "Enabled multi-session realtime updates and conflict-safe UI refresh.",
    ],
  },
];
