Buyer Matrix
Automates the first pass of buyer sourcing in a sell-side M&A process.

Live: https://intern-deliverable.vercel.app
What it does
Give it three inputs about a target company — EBITDA, geography, and sub-sector — and it returns 5 to 10 screened strategic and financial buyers, each with background, transaction history, and risk flags.

The manual version of this takes an analyst days of research. This returns a starting list in seconds.
Why it exists
Buyer sourcing is the least differentiated work in a sell-side process and the most time-consuming. The judgment is in deciding which buyers to actually approach, not in assembling the universe to choose from. This handles the assembly so the judgment happens sooner.
Architecture
Static frontend (index.html) plus two Vercel serverless functions:

api/claude.js — calls the Anthropic API for screening, ranking, and rationale
api/lookup.js — calls the Alpha Vantage API for live company financials

Both functions hold their credentials server-side, so visitors can use the tool without supplying their own keys and no key is ever exposed to the browser.

User input (EBITDA, geography, sub-sector)
        |
        v
  index.html
        |
        +---> api/claude.js   -> screening, ranking, rationale
        |
        +---> api/lookup.js   -> live financials
        |
        v
  Screened buyer list with background, transaction history, risk flags
Design decisions
Financials come from live market data, not from the model. This is the important one. Asking a language model to recall a company's revenue is where hallucination risk actually lives in this workflow. The model decides who belongs on the list and why; the numbers attached to each name come from an API call.

Credentials stay server-side. Both keys live in Vercel environment variables, never in the repository and never in client code.

The output is scoped as a first pass. It is a research starting point requiring validation against source filings before it reaches a client. The tool narrows the universe; the analyst still decides.


Running it yourself
Push this folder to a GitHub repo.
Import the repo in Vercel (New Project -> your repo). No build settings needed; it is a static site with /api functions, which Vercel detects automatically.
In the Vercel project's Settings -> Environment Variables, add:
ANTHROPIC_API_KEY — your Anthropic API key (console.anthropic.com)
ALPHAVANTAGE_API_KEY — your Alpha Vantage API key
ANTHROPIC_MODEL (optional) — defaults to claude-sonnet-4-5 if unset
Redeploy (Vercel -> Deployments -> ... -> Redeploy) so the functions pick up the new variables.

Do not commit your keys. They belong in Vercel environment variables, not in the repository.


Author
Valerie Orozco — University of Miami, Finance / Business Analytics / Global Business orovalerie0801@gmail.com | linkedin.com/in/valerie-orozco
