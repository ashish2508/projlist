import { readdirSync } from "node:fs";
import path from "node:path";

export type Song = { src: string; title: string; artist: string };

const credits = [
  ["udd-chala.mp3", "Udd Chala", "Taba Chake"],
  ["ik-kudi.mp3", "Ik Kudi", "Arpit Bala & Wolf.Cryman"],
  ["jaanu-naa.mp3", "Jaanu Naa", "Markio Tanaldo"],
  ["iro-kousui.mp3", "Iro Kousui", "Yoh Kamiyama"],
];

export function getSoundtrack(): Song[] {
  const files = new Set(readdirSync(path.join(process.cwd(), "public/music"))
    .filter(name => /\.(mp3|ogg|m4a|wav|aac)$/i.test(name)).sort());
  const songs: Song[] = [];
  for (const [file, title, artist] of credits) {
    if (files.delete(file)) songs.push({ src: "/music/" + file, title, artist });
  }
  for (const file of files) {
    songs.push({ src: "/music/" + encodeURIComponent(file), title: path.parse(file).name, artist: "" });
  }
  const url = process.env.NEXT_PUBLIC_MUSIC_URL;
  if (url && !songs.some(song => song.src === url)) songs.unshift({src: url, title: "Portfolio soundtrack", artist: ""});
  return songs;
}
