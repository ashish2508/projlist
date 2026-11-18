import type { MetadataRoute } from "next";
import { locations } from "@/lib/locations";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${baseUrl}/` },
    ...locations.map(({ id }) => ({ url: `${baseUrl}/${id}` })),
  ];
}
