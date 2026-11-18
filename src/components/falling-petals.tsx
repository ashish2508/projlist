import type { CSSProperties } from "react";
import styles from "./falling-petals.module.css";

// Sampled blossom pixels in the 735 × 1103 WebP.
const blooms = [
  [126, 284], [238, 145], [318, 212], [397, 130], [468, 197],
  [538, 241], [599, 347], [639, 408], [553, 507], [564, 594],
];

export function CanopyPetals() {
  return <div className={styles.field} aria-hidden="true">
    {Array.from({ length: 35 }, (_, index) => {
      const [x, y] = blooms[index % blooms.length];
      const depth = (index * 7) % 9;
      const settles = index % 5 === 1;
      return <i key={index} className={settles ? styles.settling : undefined} style={{
        left: x / 735 * 100 + "%",
        top: y / 1103 * 100 + "%",
        width: (8 + depth / 2) + "px",
        "--distance": ((settles ? 1020 : 1115) - y) / 1103 * 100 + "cqh",
        "--drift": (settles ? 14 + depth : 34 + depth * 3) + "cqw",
        "--duration": (13 - depth * .5) + "s",
        "--delay": -index * 1.61 + "s",
        "--turn": (4.2 - depth * .21) + "s",
        "--blur": (1 - depth / 8) + "px",
      } as CSSProperties}><b /></i>;
    })}
  </div>;
}
