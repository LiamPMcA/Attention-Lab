# Attention Lab

Duolingo for attention — short web games that measure capture, switching, and recovery.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/lab` | Start lab — pick a game |
| `/lab/capture` | Capture game |
| `/lab/recover` | Recover game |
| `/lab/switch` | Switch game (placeholder) |
| `/results` | Attention profile |

## Deploy

Push to GitHub, then import the repo at [vercel.com/new](https://vercel.com/new).
