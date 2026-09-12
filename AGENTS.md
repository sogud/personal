@/Users/changshun/.codex/RTK.md

# Project Notes

- This repository deploys `https://sogud.me` through Cloudflare Workers service `personal`, not Cloudflare Pages.
- Use `wrangler deploy` for production deploys. Do not use `wrangler pages deploy` for this project.
- Keep `wrangler.toml` configured for Workers Assets:
  - `name = "personal"`
  - `main = "src/worker.ts"`
  - `[assets] directory = "./dist"`
- API routes for the terminal must live in `src/worker.ts`; Pages Functions under `functions/` are not used by production.
- The terminal is BYOK-only. Do not add owner-funded provider keys or server-side default AI credentials.

## Blog ownership

- This is the single maintained website and blog. Preserve the Bamboo OS homepage; use `/blog/` for the reading archive.
- Write posts only in `src/content/blog/`. The sibling `blog` repository is historical reference; its two MDX posts have been migrated here.
