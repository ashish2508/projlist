import { getImageProps } from "next/image";
import type { GalleryImage } from "@/lib/gallery";
import styles from "./image-gallery.module.css";

// Room width and the 290px minimum grid track determine these breakpoints.
const sizes = [
  "(max-width: 520px) calc(100vw - 30px)",
  "(max-width: 651px) calc(100vw - 58px)",
  "(max-width: 957px) calc((100vw - 76px) / 2)",
  "(max-width: 1175px) calc((100vw - 94px) / 3)",
  "361px",
].join(", ");

export function ImageGallery({ images, emptyMessage }: { images: GalleryImage[]; emptyMessage: string }) {
  if (images.length === 0) return <p className={styles.empty}>{emptyMessage}</p>;

  return (
    <ul className="room-grid">
      {images.map(({ src, title, thumbnail }, index) => {
        const loading = index === 0 ? "eager" : "lazy";
        const fetchPriority = index === 0 ? "high" : undefined;
        // Prefer static thumbnails. Future uploads can use Next's responsive URLs without a client component.
        const preview = thumbnail ?? getImageProps({ src, sizes, alt: "", fill: true }).props;

        return (
          <li key={src}>
            <a className={styles.imageLink} href={src} target="_blank" rel="noopener noreferrer" aria-label={`Open ${title} in a new tab`}>
              <div className={styles.preview}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview.src} srcSet={preview.srcSet} sizes={sizes} alt=""
                  loading={loading} fetchPriority={fetchPriority} decoding="async" />
              </div>
              <span>{title}<span aria-hidden="true">↗</span></span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
