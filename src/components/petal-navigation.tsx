import Link from "next/link";
import type { CSSProperties } from "react";
import { HeroIllustration } from "./hero-illustration";
import { SceneBehavior } from "./scene-behavior";
import { CanopyPetals } from "./falling-petals";
import styles from "./petal-navigation.module.css";

const width = 735;
const height = 1103;

// The overlay uses the source image's viewBox, so these pixel coordinates scale with the branches.
const petals = [
  { name: "Wallpapers", href: "/wallpapers", x: 335, y: 555, stem: 56, tilt: 6, duration: 4.8, delay: -0.9 },
  { name: "Work", href: "/#work", x: 455, y: 585, stem: 72, tilt: -8, duration: 5.6, delay: -2.1 },
  { name: "Contact", href: "/contact", x: 518, y: 687, stem: 70, tilt: -3, duration: 6, delay: -3.4 },
] as const;

const blossomPetals = [
  "M46 40C34 34 27 25 28 15C29 6 37 0 43 3Q46 4 47 7Q50 1 56 4C63 7 66 14 64 21C62 30 55 35 46 40Z",
  "M46 41C46 32 53 21 64 16C72 12 81 15 85 21Q88 25 84 28Q90 30 87 36C83 46 68 53 46 41Z",
  "M45 40C34 44 23 47 14 43C8 40 4 34 7 29Q8 26 12 27Q8 23 13 18C24 10 39 21 45 40Z",
  "M46 40C56 37 69 43 76 52C82 60 78 67 72 69Q68 70 66 66Q65 72 60 72C48 72 41 55 46 40Z",
  "M46 40C47 50 43 64 34 71C29 75 20 74 17 69Q15 64 20 62Q14 63 13 58C13 51 24 39 46 40Z",
];

function WatercolorBlossom({ label }: { label: string }) {
  return (
    <svg x="-44" width="88" height="72" viewBox="0 0 92 82" preserveAspectRatio="xMidYMin meet" overflow="visible">
      <path className={styles.calyx} d="M46 0Q42 4 36 5Q44 3 46 9Q48 4 56 5Q50 2 46 0Z" />
      <g className={styles.skin} filter="url(#scene-blossom-grain)">
        {blossomPetals.map((shape, index) => (
          <path key={shape} d={shape} fill={index % 2 ? "url(#scene-blossom-wash)" : "url(#scene-blossom-blush)"} />
        ))}
      </g>
      <g className={styles.vein}>
        <path d="M46 39Q38 24 43 12M45 35Q52 22 55 14M47 39Q62 27 77 28M51 41Q68 36 78 34M44 39Q29 25 17 29M43 43Q29 40 18 35M45 43Q29 49 23 59M45 44Q40 55 32 64M47 45Q63 50 67 61M48 46Q52 56 57 65" />
      </g>
      <g className={styles.stamens}>
        <path d="M46 41L40 34M46 41L43 30M46 41L47 32M46 41L53 33M46 41L55 38M46 41L36 38" />
        <circle cx="40" cy="34" r="1" /><circle cx="43" cy="30" r=".85" />
        <circle cx="47" cy="32" r=".95" /><circle cx="53" cy="33" r="1.05" />
        <circle cx="55" cy="38" r=".8" /><circle cx="36" cy="38" r=".8" />
      </g>
      <text x="46" y="53" textAnchor="middle" className={styles.label}>{label}</text>
    </svg>
  );
}

export function PetalNavigation() {
  return (
    <div className={styles.artwork} data-scene-artwork>
      <HeroIllustration className={styles.illustration} />
      <span className={styles.groundMist} aria-hidden="true" />
      <CanopyPetals />
      <nav className={styles.navigation} aria-label="Portfolio">
        <svg className={styles.overlay} viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <radialGradient id="scene-blossom-blush" gradientUnits="userSpaceOnUse" cx="44" cy="40" r="42">
              <stop stopColor="#c56483" />
              <stop offset=".35" stopColor="#e3a0b1" />
              <stop offset=".76" stopColor="#f1c2c8" />
              <stop offset="1" stopColor="#f8e1e0" />
            </radialGradient>
            <radialGradient id="scene-blossom-wash" gradientUnits="userSpaceOnUse" cx="46" cy="39" r="43">
              <stop stopColor="#bb577b" />
              <stop offset=".29" stopColor="#e2a0b4" />
              <stop offset=".63" stopColor="#f6d6d7" />
              <stop offset="1" stopColor="#e9a7b8" />
            </radialGradient>
            <filter id="scene-blossom-grain" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency=".29" numOctaves="3" seed="7" result="grain" />
              <feColorMatrix in="grain" type="matrix"
                values="0 0 0 0 .69  0 0 0 0 .31  0 0 0 0 .44  .30 0 0 0 -.07" result="pigment" />
              <feComposite in="pigment" in2="SourceAlpha" operator="in" result="paperGrain" />
              <feBlend in="SourceGraphic" in2="paperGrain" mode="multiply" />
            </filter>
          </defs>
          {petals.map(petal => (
            <g key={petal.name} transform={`translate(${petal.x} ${petal.y})`}>
              <g className={styles.scale}>
                <Link href={petal.href} aria-label={petal.name} className={styles.petalLink} prefetch={false} data-pendant-link>
                  <rect className={styles.target} x="-44" y={petal.stem} width="88" height="72" aria-hidden="true" />
                  <g className={styles.pendant} data-falling="false"
                    style={{
                      "--wind-delay": petal.delay + "s",
                      "--wind-duration": petal.duration + "s",
                    } as CSSProperties} aria-hidden="true">
                    <path className={styles.stem}
                      d={`M0 0 C-5 ${petal.stem * .28} 7 ${petal.stem * .67} 0 ${petal.stem}`} />
                    <circle className={styles.joint} r="3.4" />
                    <g transform={`translate(0 ${petal.stem})`}>
                      <g className={styles.blade}>
                        <g transform={`rotate(${petal.tilt})`}>
                          <rect className={styles.focusRing} x="-50" y="-6" width="100" height="84" rx="21" />
                          <WatercolorBlossom label={petal.name} />
                        </g>
                      </g>
                      {[0, 1, 2, 3].map(i => (
                        <path key={i} className={styles.drift}
                          d={`M${16 + i * 3} 43q6-5 7-1q0 6-7 1Z`}
                          style={{ "--dx": 12 + i * 14 + "px", "--dy": 22 + (3 - i) * 10 + "px", "--wait": i * 75 + "ms" } as CSSProperties} />
                      ))}
                    </g>
                  </g>
                </Link>
              </g>
            </g>
          ))}
        </svg>
      </nav>
      <SceneBehavior artworkWidth={width} />
    </div>
  );
}

export function MobilePetalNavigation() {
  return (
    <nav className={styles.chips} aria-label="Portfolio">
      {petals.map(petal => <Link key={petal.name} href={petal.href} prefetch={false}>{petal.name}</Link>)}
    </nav>
  );
}
