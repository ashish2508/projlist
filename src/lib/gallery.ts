import "server-only";

import { readdirSync } from "node:fs";
import path from "node:path";

const thumbnailWidths = [480, 768] as const;

type Gallery = "wallpapers";

export type GalleryImage = {
  src: string;
  title: string;
  thumbnail?: { src: string; srcSet: string };
};

function readImageNames(folder: string): string[] {
  try {
    return readdirSync(folder, { withFileTypes: true })
      .filter(file => file.isFile() && /\.(avif|gif|jpe?g|png|webp)$/i.test(file.name))
      .map(file => file.name);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export function getGalleryImages(gallery: Gallery): GalleryImage[] {
  const folder = path.join(process.cwd(), "public", gallery);
  const names = readImageNames(folder).sort((first, second) =>
    first.localeCompare(second, "en", { numeric: true }),
  );
  if (names.length === 0) return [];

  const thumbnails = thumbnailWidths.map(width => ({
    width,
    names: new Set(readImageNames(path.join(folder, "thumbnails", String(width)))),
  }));

  return names.map(name => {
    const filename = encodeURIComponent(name);
    const variants = thumbnails.filter(variant => variant.names.has(name));
    const src = `/${gallery}/${filename}`;

    return {
      src,
      title: name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || name,
      thumbnail: variants.length
        ? {
            src: `/${gallery}/thumbnails/${variants[0].width}/${filename}`,
            srcSet: variants.map(({ width }) => `/${gallery}/thumbnails/${width}/${filename} ${width}w`).join(", "),
          }
        : undefined,
    };
  });
}
