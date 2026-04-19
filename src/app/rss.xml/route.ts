import { projectItems } from "@/lib/project-data";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const runtime = "nodejs";

export function GET() {
  const items = projectItems
    .map((project) => {
      const link = project.url.startsWith("http") ? project.url : `${baseUrl}${project.url}`;
      return `
        <item>
          <title>${escapeXml(project.name)}</title>
          <link>${link}</link>
          <guid>${link}</guid>
          <description>${escapeXml(project.summary)}</description>
          <pubDate>${new Date().toUTCString()}</pubDate>
        </item>
      `;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Ashish Jha — Projects</title>
    <link>${baseUrl}/</link>
    <description>Backend-heavy builds and updates from Ashish Jha.</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
