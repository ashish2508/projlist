"use client";

import { projectItems } from "@/lib/project-data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { SiCodeforces, SiGithub, SiLeetcode, SiLinkerd } from "react-icons/si";
import * as THREE from "three";
import styles from "./page.module.css";

gsap.registerPlugin(ScrollTrigger);

type ThemeMode = "day" | "night";

const socialLinks = [
  {
    label: "GitHub",
    url: "https://github.com/ashish2508",
    icon: SiGithub,
  },
  {
    label: "LinkedIn",
    url: "https://linkedin.com/in/ashish25-jha",
    icon: SiLinkerd,
  },
  {
    label: "Codeforces",
    url: "https://codeforces.com/profile/MeCodeFire",
    icon: SiCodeforces,
  },
  {
    label: "LeetCode",
    url: "https://leetcode.com/u/jha250805",
    icon: SiLeetcode,
  },
];

const skillCards = [
  {
    title: "Languages",
    details: "C, C++, Go, Java, TypeScript, JavaScript",
  },
  {
    title: "Frontend",
    details: "React, Next.js (App Router), Zustand, Tailwind CSS",
  },
  {
    title: "Backend",
    details: "Convex realtime backend, REST APIs, Clerk/Auth.js flows",
  },
  {
    title: "Databases",
    details: "PostgreSQL, Neon serverless, Drizzle ORM, query optimization",
  },
  {
    title: "Core CS",
    details: "DSA, DBMS, OS, CN, distributed systems foundations",
  },
];

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shutterTopRef = useRef<HTMLDivElement>(null);
  const shutterBottomRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);
  const betaRef = useRef<HTMLSpanElement>(null);
  const archivedRef = useRef<HTMLSpanElement>(null);
  const ropeDragRef = useRef(false);
  const ropeStartYRef = useRef(0);
  const ropePullRef = useRef(0);

  const [theme, setTheme] = useState<ThemeMode>("day");
  const [ropePull, setRopePull] = useState(0);

  const statusCount = projectItems.reduce(
    (acc, project) => {
      if (project.status === "Live") {
        acc.live += 1;
      }

      if (project.status === "Beta") {
        acc.beta += 1;
      }

      if (project.status === "Archived") {
        acc.archived += 1;
      }

      return acc;
    },
    { live: 0, beta: 0, archived: 0 },
  );

  const latestYear = Math.max(...projectItems.map((project) => project.year));

  const toggleThemeWithShutter = useCallback(() => {
    const top = shutterTopRef.current;
    const bottom = shutterBottomRef.current;

    if (!top || !bottom) {
      setTheme((previous) => (previous === "day" ? "night" : "day"));
      return;
    }

    const timeline = gsap.timeline();

    timeline
      .set([top, bottom], { display: "block" })
      .set(top, { yPercent: -100 })
      .set(bottom, { yPercent: 100 })
      .to(top, {
        yPercent: 0,
        duration: 0.32,
        ease: "power2.in",
      })
      .to(
        bottom,
        {
          yPercent: 0,
          duration: 0.32,
          ease: "power2.in",
        },
        "<",
      )
      .call(() => {
        setTheme((previous) => (previous === "day" ? "night" : "day"));
      })
      .to(top, {
        yPercent: -100,
        duration: 0.38,
        ease: "power2.out",
      })
      .to(
        bottom,
        {
          yPercent: 100,
          duration: 0.38,
          ease: "power2.out",
        },
        "<",
      )
      .set([top, bottom], { display: "none" });
  }, []);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (!ropeDragRef.current) {
        return;
      }

      const nextPull = Math.max(0, Math.min(120, event.clientY - ropeStartYRef.current));
      ropePullRef.current = nextPull;
      setRopePull(nextPull);
    };

    const onPointerRelease = () => {
      if (!ropeDragRef.current) {
        return;
      }

      ropeDragRef.current = false;
      const shouldToggle = ropePullRef.current > 72;

      const proxy = { value: ropePullRef.current };
      gsap.to(proxy, {
        value: 0,
        duration: 0.64,
        ease: "elastic.out(1, 0.55)",
        onUpdate: () => {
          ropePullRef.current = proxy.value;
          setRopePull(proxy.value);
        },
      });

      if (shouldToggle) {
        toggleThemeWithShutter();
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerRelease);
    window.addEventListener("pointercancel", onPointerRelease);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerRelease);
      window.removeEventListener("pointercancel", onPointerRelease);
    };
  }, [toggleThemeWithShutter]);

  const handleRopePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    ropeDragRef.current = true;
    ropeStartYRef.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(theme === "day" ? "#f3efe7" : "#050e1a", 4.5, 14);

    const camera = new THREE.PerspectiveCamera(
      44,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0.15, 6.8);

    const ambientLight = new THREE.AmbientLight(
      theme === "day" ? "#f9f2df" : "#8db0d9",
      theme === "day" ? 0.92 : 0.55,
    );
    const keyLight = new THREE.PointLight(
      theme === "day" ? "#85cfb2" : "#4f79de",
      theme === "day" ? 1.45 : 1.9,
      20,
      1.4,
    );
    keyLight.position.set(2, 2, 4.2);
    scene.add(ambientLight);
    scene.add(keyLight);

    const pointCount = 540;
    const positions = new Float32Array(pointCount * 3);
    const basePositions = new Float32Array(pointCount * 3);
    const speedSeeds = new Float32Array(pointCount);

    for (let i = 0; i < pointCount; i += 1) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * 9;
      const y = (Math.random() - 0.5) * 6;
      const z = (Math.random() - 0.5) * 8;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      basePositions[i3] = x;
      basePositions[i3 + 1] = y;
      basePositions[i3 + 2] = z;

      speedSeeds[i] = 0.4 + Math.random() * 1.4;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );

    const particlesMaterial = new THREE.PointsMaterial({
      color: theme === "day" ? "#4ca58b" : "#8fb6ff",
      size: 0.045,
      transparent: true,
      opacity: theme === "day" ? 0.2 : 0.3,
      depthWrite: false,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const pointer = { x: 0, y: 0 };
    let elapsed = 0;

    const onPointerMove = (event: MouseEvent) => {
      pointer.x = event.clientX / window.innerWidth - 0.5;
      pointer.y = event.clientY / window.innerHeight - 0.5;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      elapsed += 0.01;

      const positionAttribute = particlesGeometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;

      for (let i = 0; i < pointCount; i += 1) {
        const i3 = i * 3;
        const x = basePositions[i3];
        const y = basePositions[i3 + 1];

        positionAttribute.array[i3] = x + Math.sin(elapsed * speedSeeds[i]) * 0.04;
        positionAttribute.array[i3 + 1] =
          y + Math.cos(elapsed * speedSeeds[i] + x * 0.25) * 0.08;
      }

      positionAttribute.needsUpdate = true;

      particles.rotation.y += 0.0008;

      camera.position.x += (pointer.x * 0.42 - camera.position.x) * 0.015;
      camera.position.y += (-pointer.y * 0.38 - camera.position.y) * 0.015;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onPointerMove);
    renderer.setAnimationLoop(animate);

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onPointerMove);

      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [theme]);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const animateNumber = (target: HTMLSpanElement | null, value: number) => {
      if (!target) {
        return;
      }

      const state = { value: 0 };
      gsap.to(state, {
        value,
        duration: 1.1,
        ease: "power2.out",
        onUpdate: () => {
          target.textContent = String(Math.round(state.value));
        },
      });
    };

    const onPointerMove = (event: MouseEvent) => {
      const offsetX = (event.clientX / window.innerWidth - 0.5) * 30;
      const offsetY = (event.clientY / window.innerHeight - 0.5) * 18;

      gsap.to("[data-blob-one]", {
        x: offsetX * 0.42,
        y: offsetY * 0.58,
        duration: 1.2,
        overwrite: "auto",
      });

      gsap.to("[data-blob-two]", {
        x: -offsetX * 0.35,
        y: -offsetY * 0.52,
        duration: 1.2,
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", onPointerMove);

    const context = gsap.context(() => {
      const socialItems = gsap.utils.toArray<HTMLElement>("[data-social-item]");
      const specs = gsap.utils.toArray<HTMLElement>("[data-spec-card]");
      const skills = gsap.utils.toArray<HTMLElement>("[data-skill-card]");
      const tiles = gsap.utils.toArray<HTMLElement>("[data-project-tile]");

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-nav]", {
          y: -16,
          opacity: 0,
          duration: 0.44,
        })
        .from("[data-ribbon]", {
          y: 16,
          opacity: 0,
          duration: 0.42,
        }, "-=0.14")
        .from(
          "[data-title]",
          {
            y: 34,
            opacity: 0,
            duration: 0.74,
          },
          "-=0.2",
        )
        .from(
          "[data-subtitle]",
          {
            y: 20,
            opacity: 0,
            duration: 0.58,
          },
          "-=0.42",
        )
        .from(
          socialItems,
          {
            y: 14,
            opacity: 0,
            duration: 0.42,
            stagger: 0.06,
          },
          "-=0.4",
        )
        .from(
          specs,
          {
            y: 24,
            opacity: 0,
            duration: 0.54,
            stagger: 0.08,
          },
          "-=0.36",
        )
        .from(
          tiles,
          {
            y: 20,
            opacity: 0,
            duration: 0.56,
            stagger: 0.09,
          },
          "-=0.16",
        );

      skills.forEach((skill, index) => {
        gsap.from(skill, {
          y: 28,
          opacity: 0,
          duration: 0.52,
          delay: index * 0.03,
          scrollTrigger: {
            trigger: skill,
            start: "top 86%",
          },
        });
      });

      animateNumber(totalRef.current, projectItems.length);
      animateNumber(liveRef.current, statusCount.live);
      animateNumber(betaRef.current, statusCount.beta);
      animateNumber(archivedRef.current, statusCount.archived);

      gsap.to("[data-blob-one]", {
        x: 12,
        y: -8,
        duration: 5.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to("[data-blob-two]", {
        x: -10,
        y: 7,
        duration: 6.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      tiles.forEach((tile) => {
        gsap.from(tile, {
          y: 28,
          opacity: 0,
          scale: 0.97,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: {
            trigger: tile,
            start: "top 86%",
          },
        });
      });
    }, rootRef);

    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      context.revert();
    };
  }, [statusCount.archived, statusCount.beta, statusCount.live]);

  const statusClass = {
    Live: styles.live,
    Beta: styles.beta,
    Archived: styles.archived,
  };

  return (
    <div
      className={`${styles.page} ${theme === "night" ? styles.night : ""}`}
      ref={rootRef}
    >
      <canvas aria-hidden="true" className={styles.backdropCanvas} ref={canvasRef} />
      <div aria-hidden="true" className={styles.shutterTop} ref={shutterTopRef} />
      <div aria-hidden="true" className={styles.shutterBottom} ref={shutterBottomRef} />
      <div aria-hidden="true" className={styles.blobOne} data-blob-one />
      <div aria-hidden="true" className={styles.blobTwo} data-blob-two />
      <div aria-hidden="true" className={styles.grainOverlay} />

      <main className={styles.main}>
        <nav className={styles.topNav} data-nav>
          <div className={styles.identityBlock}>
            <p className={styles.identityName}>Ashish Jha</p>
            <p className={styles.identityRole}>Backend-Heavy Full-Stack Developer</p>
          </div>

          <div className={styles.navActions}>
            <Link href="/contact">Contact</Link>
          </div>

          <button
            aria-label="Pull rope to toggle day and night"
            className={styles.ropeToggle}
            onPointerDown={handleRopePointerDown}
            type="button"
          >
            <span className={styles.ropeString} style={{ height: `${68 + ropePull}px` }} />
            <span
              className={styles.ropeKnob}
              style={{ transform: `translate(-50%, ${ropePull}px)` }}
            />
          </button>
        </nav>

        <header className={styles.hero}>
          <p className={styles.kicker} data-ribbon>
            Open To Internship 2026
          </p>
          <h1 className={styles.title} data-title>
            Building production-style full-stack systems with backend depth.
          </h1>
          <p className={styles.subtitle} data-subtitle>
            Fourth-year Information Technology student with strong emphasis on
            scalable backends, type-safe data models, and performance-first
            engineering. I enjoy solving algorithmic problems and shipping
            end-to-end systems for real users.
          </p>

          <div className={styles.socialRow}>
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  className={styles.socialLink}
                  data-social-item
                  href={item.url}
                  key={item.label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          <section className={styles.specGrid}>
            <article className={styles.specCard} data-spec-card>
              <span className={styles.specLabel}>Projects Built</span>
              <strong className={styles.specValue} ref={totalRef}>
                0
              </strong>
            </article>

            <article className={styles.specCard} data-spec-card>
              <span className={styles.specLabel}>Live</span>
              <strong className={styles.specValue} ref={liveRef}>
                0
              </strong>
            </article>

            <article className={styles.specCard} data-spec-card>
              <span className={styles.specLabel}>Beta</span>
              <strong className={styles.specValue} ref={betaRef}>
                0
              </strong>
            </article>

            <article className={styles.specCard} data-spec-card>
              <span className={styles.specLabel}>Latest Build Year</span>
              <strong className={styles.specValue}>
                {latestYear}
              </strong>
            </article>

            <article className={styles.specCard} data-spec-card>
              <span className={styles.specLabel}>Archived</span>
              <strong className={styles.specValue} ref={archivedRef}>
                0
              </strong>
            </article>
          </section>
        </header>

        <section className={styles.skillsSection}>
          <header className={styles.sectionHeader}>
            <h2>Core Skills</h2>
            <p>Production engineering stack for backend-heavy product development.</p>
          </header>

          <div className={styles.skillsGrid}>
            {skillCards.map((skill) => (
              <article className={styles.skillCard} data-skill-card key={skill.title}>
                <h3>{skill.title}</h3>
                <p>{skill.details}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.feed}>
          <header className={styles.sectionHeader}>
            <h2>Selected Projects</h2>
            <Link href="/contact">Hire Me</Link>
          </header>

          {projectItems.map((project, index) => (
            <article
              className={`${styles.tile} ${statusClass[project.status]}`}
              data-project-tile
              key={project.name}
            >
              <div className={styles.tileTop}>
                <span className={styles.order}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.statusChip}>{project.status}</span>
              </div>

              <h2>{project.name}</h2>
              <p>{project.summary}</p>

              <div className={styles.tileMeta}>
                <span>{project.stack}</span>
                <span>{project.year}</span>
              </div>

              <ul className={styles.highlightsList}>
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>

              <a
                href={project.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                Visit
              </a>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
