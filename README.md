# Ashish Jha’s portfolio

Select a hanging petal for work, wallpapers, or contact. Add a song to public/music/ or set NEXT_PUBLIC_MUSIC_URL to a direct audio URL before building. The soundtrack loops at 40% volume. When the browser blocks autoplay, playback is retried on a click or keypress.

## Run locally

```sh
bun install --frozen-lockfile
bun run dev
```

Open http://localhost:3000.

## Update the portfolio

- Edit `src/lib/projects.json` to update the project cards and RSS feed.
- Add JPG, JPEG, PNG, WebP, AVIF, or GIF files directly under `public/wallpapers/`. File names become captions and sort in natural order. Rebuild and redeploy after adding assets.
- Set `NEXT_PUBLIC_SITE_URL` to the public origin for RSS and sitemap links.
- Configure `CONTACT_TARGET_EMAIL`, `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` for direct mail delivery. `SMTP_PORT` defaults to 587 and `SMTP_FROM` is optional. When SMTP is unavailable the form opens a mail draft instead. `NEXT_PUBLIC_CONTACT_EMAIL` controls the direct-email link shown if the API request fails.

