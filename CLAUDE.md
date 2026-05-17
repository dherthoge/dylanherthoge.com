# dylanherthoge.com

Dylan's personal site. Lives at https://dylanherthoge.com. Repo: `github.com/dherthoge/dylanherthoge.com`.

For long-form context (why we picked this stack, launch checklist, future plans), see [`docs/`](./docs/).

## Stack

- **Framework:** Astro 6 (blog starter)
- **Adapter:** `@astrojs/cloudflare` v13+ (targets Cloudflare **Workers**, not Pages)
- **Hosting:** Cloudflare Workers
- **DNS + registrar:** Cloudflare (same account)
- **Content:** Markdown under `src/content/blog/`
- **Node:** >=22.12.0

## Commands

- `npm run dev` — local dev server (http://localhost:4321)
- `npm run build` — production build (emits Worker bundle)
- `npm run preview` — preview the built site
- `npm run generate-types` — regenerate wrangler types

## Repo layout

- `src/pages/` — file-based routes. `index.astro` → `/`, `about.astro` → `/about`
- `src/content/blog/` — blog posts (`.md` or `.mdx`)
- `src/content.config.ts` — frontmatter schema for blog posts. Check before writing a new post.
- `src/layouts/`, `src/components/`, `src/styles/` — standard Astro structure
- `wrangler.jsonc` — Cloudflare Workers config
- `.wrangler/` — local-only state, gitignored

## Branches

- `main` — current Astro site. Push to deploy.
- `archive/old-react-site` — frozen pre-2026 CRA version. Reference only; do not modify.

## Gotchas

- **wrangler.jsonc `name` cannot contain dots.** Must be lowercase alphanumeric + dashes. Current value: `dylanherthoge-com`.
- **Cloudflare Pages is deprecated for new Astro deploys.** Use Workers via `@astrojs/cloudflare`. Don't suggest migrating back.

## Adding a blog post

1. Create `src/content/blog/<slug>.md` (or `.mdx`).
2. Frontmatter must match `src/content.config.ts` — read the schema, don't guess.
3. Push to `main`. Cloudflare redeploys automatically.

## Adding a page

Drop a file in `src/pages/` — file-based routing (`src/pages/about.astro` → `/about`).
