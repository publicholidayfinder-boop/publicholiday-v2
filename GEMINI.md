# publicholidayfinder-v2 — Project Context

## Project
- **Name:** Public Holiday Finder
- **Live site:** https://publicholidayfinder.com
- **Local dev:** `npm run dev` → http://localhost:5173

## Tech Stack
- React 18 + Vite + Tailwind CSS
- React Router v7, i18next (translations), Firebase (Firestore/Auth)
- PWA via vite-plugin-pwa

## Hosting — Cloudflare Pages (NOT Firebase Hosting)
- Firebase Hosting was replaced with Cloudflare Pages on 2026-10-21 (bandwidth limits)
- **Cloudflare Pages project:** `publicholiday-v2`
- **Dashboard:** https://dash.cloudflare.com → Workers & Pages → publicholiday-v2
- **GitHub repo:** https://github.com/publicholidayfinder-boop/publicholiday-v2 (branch: `main`)
- Every push to `main` auto-deploys — no manual deploy step needed
- **Build command:** `npm run build` | **Output:** `dist` | **Node version:** 20

## DNS
- Domain registrar: Bluehost
- DNS managed by: Cloudflare (nameservers point to Cloudflare)
- Custom domains on Pages: `publicholidayfinder.com` + `www.publicholidayfinder.com`

## Firebase (backend only)
- Project ID: `publicholidayfinder-38de7`
- Firebase Hosting is NOT used — only Firestore/Auth if needed
- Console: https://console.firebase.google.com/project/publicholidayfinder-38de7

## Important Notes
- The `npm run build` script does NOT include puppeteer prerender (removed — incompatible with Cloudflare build environment)
- Cloudflare Pages `_redirects` and `_headers` files are in `public/` folder
- Environment variables (VITE_FIREBASE_*) are set in Cloudflare Pages dashboard, not committed to repo
- Full deployment details in `DEPLOYMENT.md` at project root
