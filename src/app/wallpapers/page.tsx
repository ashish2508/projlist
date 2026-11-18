import type { Metadata } from "next";
import { ImageGallery } from "@/components/image-gallery";
import { Room } from "@/components/room";
import { getGalleryImages } from "@/lib/gallery";

export const metadata: Metadata = { title: "Wallpapers | Ashish Jha" };

export default function WallpapersPage() {
  return (
    <Room id="wallpapers">
      <p className="room-note">I don’t own the rights to these wallpapers. I collected them from a GitHub repository, and I can’t recall which one. The gallery displays optimized previews.</p>
      <ImageGallery images={getGalleryImages("wallpapers")} emptyMessage="I haven’t added any wallpapers yet." />
    </Room>
  );
}
