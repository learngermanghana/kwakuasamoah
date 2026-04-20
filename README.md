# Kwaku Travel & Relocation Website

Production-ready Next.js 15 + React 19 + TypeScript website for travel, relocation, and consultation bookings.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Production features

- SEO metadata + Open Graph + JSON-LD schema.
- Dynamic `robots.txt` and `sitemap.xml`.
- Consultation form that submits to a Next.js API route.
- Optional webhook integration for inquiry delivery (`CONSULTATION_WEBHOOK_URL`).

## Deploy to Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the repository.
4. Add environment variables from `.env.example`.
5. Click **Deploy**.

Or with CLI:

```bash
npm i -g vercel
vercel
```
