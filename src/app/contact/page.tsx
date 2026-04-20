"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { BiLogoLinkedin } from "react-icons/bi";
import { SiCodeforces, SiGithub, SiLeetcode } from "react-icons/si";
import styles from "./contact.module.css";

type FormState = {
  name: string;
  email: string;
  message: string;
};

const socialLinks = [
  { label: "GitHub", url: "https://github.com/ashish2508", icon: SiGithub },
  { label: "LinkedIn", url: "https://linkedin.com/in/ashish25-jha/", icon: BiLogoLinkedin },
  { label: "Codeforces", url: "https://codeforces.com/profile/MeCodeFire", icon: SiCodeforces },
  { label: "LeetCode", url: "https://leetcode.com/u/jha250805", icon: SiLeetcode },
];

export default function ContactPage() {
  const fallbackEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "jha250805@gmail.com";
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Unable to deliver your message right now.");
      }

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setStatus("error");
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.hero}>
          <p className={styles.kicker}>Contact</p>
          <h1>Tell me about the role or collaboration you have in mind.</h1>
          <p>
            I reply within a day whenever possible. Your note is delivered privately—no email
            address is shown on the site.
          </p>
          <div className={styles.actions}>
            <Link href="/" className={styles.chip}>
              ← Back to projects
            </Link>
            <span className={styles.chip}>Available for full-stack work</span>
          </div>
        </header>

        <section className={styles.grid}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="name">Your name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, name: event.target.value }))
                }
                placeholder="Jane Doe"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Work email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, email: event.target.value }))
                }
                placeholder="you@company.com"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="message">Purpose of contact</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={form.message}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, message: event.target.value }))
                }
                placeholder="Share the role details, project goals, or timelines."
                required
              />
            </div>

            <div className={styles.formFooter}>
              <button className={styles.submit} disabled={status === "submitting"} type="submit">
                {status === "submitting" ? "Sending..." : "Send message"}
              </button>
              {status === "success" && (
                <p aria-live="polite" className={styles.success} role="status">
                  Thanks—I will reply soon.
                </p>
              )}
              {status === "error" && (
                <div aria-live="assertive" className={styles.error} role="alert">
                  <p>{error}</p>
                  <a href={`mailto:${fallbackEmail}`}>Email me directly</a>
                </div>
              )}
            </div>
          </form>

          <aside className={styles.sidebar}>
            <div className={styles.card}>
              <h2>Quick facts</h2>
              <ul className={styles.list}>
                <li>full-stack developer focused on reliability</li>
                <li>Comfortable across React/Next.js, Convex, PostgreSQL, Drizzle, and Go</li>
                <li>Enjoy solving systems and algorithmic challenges for product teams</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h2>Connect elsewhere</h2>
              <div className={styles.socialGrid}>
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      className={styles.socialLink}
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
              <p className={styles.note}>
                Prefer async first: send your scope, problem statement, or role expectations and
                I&apos;ll respond with next steps.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
