# Buyer Matrix

Static frontend (`index.html`) + two Vercel serverless functions (`api/claude.js`,
`api/lookup.js`) that hold the API keys server-side so visitors can use the tool
without needing their own.

## Deploy

1. Push this folder to a GitHub repo.
2. Import the repo in Vercel (New Project -> your repo). No build settings needed —
   it's a static site with `/api` functions, which Vercel detects automatically.
3. Before (or right after) the first deploy, go to the Vercel project's
   **Settings -> Environment Variables** and add:
   - `ANTHROPIC_API_KEY` — your Anthropic API key (console.anthropic.com)
   - `ALPHAVANTAGE_API_KEY` — your Alpha Vantage API key
   - `ANTHROPIC_MODEL` (optional) — defaults to `claude-sonnet-4-5` if unset
4. Redeploy (Vercel -> Deployments -> ... -> Redeploy) so the functions pick up
   the new environment variables.

## Important — do not commit your keys

Never paste your actual API keys into `index.html`, `api/claude.js`,
`api/lookup.js`, or any file in this repo. Set them only in Vercel's
Environment Variables panel, which keeps them private and out of git history.
If a key is ever committed by mistake, rotate (regenerate) it immediately in
the Anthropic / Alpha Vantage dashboard — a key that's touched a public GitHub
repo should be treated as compromised even if you delete the commit later,
since it can still show up in forks, caches, or scraper history.

## Notes

- Alpha Vantage's free tier is rate-limited (a handful of requests per day/minute).
  If the demo needs to be reliable for a specific meeting, test the exact
  lookups you plan to show ahead of time.
- PitchBook and CapIQ keys entered in the UI are not wired to a live call —
  those platforms require their own server-side authenticated integration, which
  is a further step beyond this build. They currently only flag in the
  generated brief that their data should be used to verify the AI's figures.
