# Attention Lab

Duolingo for attention — short web games that measure capture, switching, and recovery.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (auth + cloud scores)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase setup (Phase 1 — login only)

1. Create a free project at [supabase.com](https://supabase.com)
2. Copy `env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` — Project Settings → API → Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Project Settings → API → anon public key
3. In Supabase → Authentication → URL Configuration, add:
   - Site URL: `http://localhost:3000` (and your Vercel URL when deployed)
   - Redirect URL: `http://localhost:3000/auth/callback`
4. Restart `npm run dev`

For quick local testing, you can disable email confirmation under Authentication → Providers → Email.

## Supabase setup (Phase 2 — cloud scores)

1. In Supabase, open **SQL Editor** → **New query**
2. Paste the contents of `supabase/game_sessions.sql` from this repo
3. Click **Run** — you should see “Success. No rows returned”
4. Optional check: **Table Editor** → you should see a `game_sessions` table

When logged in, game scores save to Supabase and sync across devices. Existing local scores upload automatically on first login.

## Routes

| Path | Page |
|------|------|
| `/` | Home — pick a game |
| `/lab` | Redirects to home |
| `/lab/capture` | Capture game |
| `/lab/recover` | Recover game |
| `/lab/switch` | Switch game |
| `/results` | Attention profile |
| `/login` | Sign in / sign up |

## Deploy

Push to GitHub, then import the repo at [vercel.com/new](https://vercel.com/new).

Add the same Supabase env vars in Vercel → Project Settings → Environment Variables.
