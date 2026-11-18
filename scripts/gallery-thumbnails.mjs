import { mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const folder = "public/wallpapers";
const widths = [480, 768];
const files = (await readdir(folder, { withFileTypes: true }))
  .filter(file => file.isFile() && file.name.endsWith(".webp"));

await Promise.all(widths.map(width => mkdir(path.join(folder, "thumbnails", String(width)), { recursive: true })));

let index = 0;
let count = 0;
let bytes = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (index < files.length) {
    const { name } = files[index++];
    const filename = path.join(folder, name);
    const source = sharp(filename);
    const [metadata, original] = await Promise.all([source.metadata(), stat(filename)]);
    for (const width of widths) {
      const target = path.join(folder, "thumbnails", String(width), name);
      if (metadata.width <= width) {
        await rm(target, { force: true });
        continue;
      }
      const data = await source.clone().resize({ width }).webp({ quality: 68 }).toBuffer();
      if (data.length >= original.size) {
        await rm(target, { force: true });
        continue;
      }
      await writeFile(target, data);
      count++;
      bytes += data.length;
    }
  }
}));
console.log(`Generated ${count} thumbnails (${(bytes / 1e6).toFixed(2)} MB).`);
