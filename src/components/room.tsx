import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { locations } from "@/lib/locations";
import type { ReactNode } from "react";
import styles from "./room.module.css";

export function Room({ id, children }: { id: (typeof locations)[number]["id"]; children: ReactNode }) {
  const room = locations.find((location) => location.id === id)!;

  return (
    <main className={`${styles.room} ${styles[id]}`}>
      <nav className={styles.navigation} aria-label="Explore the portfolio">
        <Link className={styles.back} href="/"><FiArrowLeft aria-hidden="true" /> Home</Link>
        <div>
          {locations.filter((location) => location.id !== id).map((location) => (
            <Link key={location.id} href={`/${location.id}`}>{location.name}</Link>
          ))}
        </div>
      </nav>
      <header className={styles.heading}>
        <h1>{room.name}</h1>
        <p>{room.description}</p>
      </header>
      {children}
    </main>
  );
}
