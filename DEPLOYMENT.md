# Deployment Notes — publicholidayfinder.com

## Hosting
- **Platform:** Cloudflare Pages (migrated from Firebase Hosting on 2026-10-21)
- **Project name:** `publicholiday-v2`
- **Dashboard:** https://dash.cloudflare.com → Workers & Pages → publicholiday-v2
- **Pages URL:** https://publicholiday-v2.pages.dev
- **Live site:** https://publicholidayfinder.com

## GitHub Repository
- **Repo:** https://github.com/publicholidayfinder-boop/publicholiday-v2
- **Branch:** `main`
- **Auto-deploy:** Every push to `main` triggers a Cloudflare Pages build automatically

## Build Settings
| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `20` |

## Environment Variables (set in Cloudflare Pages dashboard)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `NODE_VERSION` = `20`

## Domain & DNS
- **Registrar:** Bluehost
- **DNS managed by:** Cloudflare (nameservers pointed to Cloudflare)
- **Custom domains on Pages:** `publicholidayfinder.com` + `www.publicholidayfinder.com`
- **SSL:** Free Cloudflare universal SSL (auto-renews)

## Firebase (still used for backend)
- **Project:** `publicholidayfinder-38de7`
- **Console:** https://console.firebase.google.com/project/publicholidayfinder-38de7
- Firebase Hosting is no longer used — only Firestore/Auth if needed

## How to Deploy
Deployments are automatic on every `git push`. To deploy manually:
```bash
git add -A
git commit -m "your message"
git push origin main
```

## Local Development
```bash
npm run dev        # Start dev server at http://localhost:5173
npm run build      # Build for production (no prerender)
```
