# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

This repo started from the `vinext-starter` template (Cloudflare Workers + Next.js via
[vinext](https://github.com/cloudflare/vinext), optional D1/Drizzle support) and has been
customized into a single-page marketing site for **Luiz Lima Marcenaria**, a Florianópolis,
Brazil furniture/carpentry business (`app/page.tsx`). Content and copy are in Brazilian
Portuguese. There is currently no database usage — `db/schema.ts` is intentionally empty.

## Commands

- `npm run dev` — start local development (vinext dev, backed by the Cloudflare Vite plugin/Miniflare)
- `npm run build` — production build (`vinext build`); output goes to `dist/`
- `npm run start` — run the built worker locally (`vinext start`)
- `npm test` — runs `npm run build` then `node --test tests/rendered-html.test.mjs`
- `npm run lint` — `eslint . --ignore-pattern dist --ignore-pattern .next`
- `npm run db:generate` — generate Drizzle migrations from `db/schema.ts` via `drizzle-kit generate`
- `node --test tests/rendered-html.test.mjs` — run the test file directly (requires a prior `npm run build`, since it imports `dist/server/index.js`)

### Known state: `npm test` is stale

`tests/rendered-html.test.mjs` was written for the original vinext-starter scaffold: it asserts
the built page renders the starter's "Your site is taking shape" loading skeleton and checks for
an `app/_sites-preview/SkeletonPreview.tsx` file that no longer exists in this repo (the site was
replaced with the real Luiz Lima homepage). Expect this test to fail as-is; don't treat a failure
here as a regression signal for the actual site, and update/replace the test if test coverage for
the real page is needed.

### Netlify static export

`scripts/build-netlify-preview.mjs` is a separate, ad-hoc path for producing a static bundle
deployable via Netlify's drag-and-drop upload (outside the normal Cloudflare/vinext pipeline). It
expects a local server already running at `http://localhost:3000/` (`npm run start` or `dev`),
fetches the rendered HTML, inlines the compiled CSS from `dist/client/assets/*.css`, rewrites
`/_vinext/image` URLs back to direct asset paths, strips scripts/stylesheets, and injects a small
hand-written vanilla-JS behavior script (menu toggle, scroll header, FAQ accordion, reveal-on-scroll,
inline video playback) to replace the React runtime. Output goes to `UPLOAD-NETLIFY-DROP/`. Run it
with `node scripts/build-netlify-preview.mjs` after starting a local server. If you change
interactive behavior in `app/page.tsx` or `components/`, the hand-rolled `behavior` script in this
file needs to be updated in parallel — it is not generated from the React code.

## Architecture

- **Runtime**: Cloudflare Workers, entry point `worker/index.ts`. It intercepts
  `/_vinext/image` requests for on-the-fly image optimization (via the `IMAGES` binding) and
  otherwise delegates to vinext's Next.js App Router handler (`vinext/server/app-router-entry`).
- **App Router**: standard Next.js `app/` directory (`layout.tsx` sets metadata/JSON-LD/fonts,
  `page.tsx` is the entire one-page site, `globals.css` holds all styling — no CSS modules or
  Tailwind classes are used despite Tailwind being a devDependency).
- **Page composition**: `app/page.tsx` is a single large client component (`"use client"`)
  assembling the whole page from local data arrays (services, projects, FAQs, testimonials, etc.)
  and section components. Only two components are extracted: `components/ContactSelector.tsx` and
  `components/VideoGallery.tsx`. Scroll-reveal animation and mobile nav state are handled with
  plain `useState`/`useEffect` + `IntersectionObserver`, not a library.
  Contact links are built from `wa.me` URLs; there's no backend contact form.
- **Bindings/hosting config**: `.openai/hosting.json` declares optional D1 (`d1`) and R2 (`r2`)
  bindings (both currently `null`, i.e. unused). `vite.config.ts` reads this file and simulates
  the declared bindings locally via `@cloudflare/vite-plugin`. `build/sites-vite-plugin.ts` is a
  Vite plugin (build-only) that copies `.openai/hosting.json` and the `drizzle/` migrations
  directory into `dist/.openai/` after the bundle is built, so the hosting platform can read them.
- **Database (unused today)**: `db/index.ts` exposes `getDb()`, which builds a Drizzle client from
  the Cloudflare `env.DB` D1 binding and throws if it's not configured. `db/schema.ts` is
  intentionally empty; `examples/d1/` shows an opt-in example (a Drizzle `notes` table +
  `app/api/notes/route.ts` API route) to copy from if D1 is actually adopted — to enable it, set
  `d1` in `.openai/hosting.json` to a binding name (e.g. `"DB"`).
- **ChatGPT / SIWC auth (unused today, available if needed)**: `app/chatgpt-auth.ts` provides
  `getChatGPTUser()`, `requireChatGPTUser()`, `chatGPTSignInPath()`/`chatGPTSignOutPath()` for
  optional/required "Sign in with ChatGPT" flows, reading identity from
  `oai-authenticated-user-email` and (optionally, percent-encoded) `oai-authenticated-user-full-name`
  request headers. The dispatch layer owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, and
  `/callback` — do not implement app routes at those paths. Pages using these helpers must set
  `export const dynamic = "force-dynamic"` since they depend on per-request headers. SIWC proves
  identity only, not workspace membership — layer on explicit allowlist/membership checks for any
  access control.
- **Path alias**: `@/*` maps to the repo root (`tsconfig.json`).
