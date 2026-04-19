# Ashish Jha — Project Index

Backend-leaning full-stack portfolio showcasing shipped projects, a rope-driven day/night toggle, and a private contact channel.

## Running the project

```bash
npm install
npm run dev    # local development
npm run lint   # static checks
npm run build  # production build
```

Open http://localhost:3000 to view the site. The homepage is driven by `src/app/page.tsx`; the contact form lives at `/contact`.

## Contact form configuration

Outbound email uses SMTP. Set the following environment variables:

- `SMTP_HOST`, `SMTP_PORT` (465 for secure, 587 otherwise)
- `SMTP_USER`, `SMTP_PASS`
- `SMTP_FROM` (optional, defaults to `SMTP_USER`)
- `CONTACT_TARGET_EMAIL` (optional, defaults to `jha250805@gmail.com`)

Without these values, the `/api/contact` endpoint will return an error instead of sending mail.

## Notes

- Rope pull in the nav toggles the shuttered day/night experience.
- Animations are powered by GSAP and Three.js particle haze.
- Social icons link to GitHub, LinkedIn, Codeforces, and LeetCode profiles.
