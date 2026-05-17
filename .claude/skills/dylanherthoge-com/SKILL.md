---
name: dylanherthoge-com
description: Project context for dylanherthoge.com — Dylan's personal website (Astro 6 blog starter on Cloudflare Workers). Use this skill whenever working in the dylanherthoge.com repo, writing a blog post, editing the landing page, adjusting the Astro config, deploying the site, troubleshooting the Cloudflare Workers deployment, adding a new page, or making any change to the personal site. Trigger even when the user doesn't name the project explicitly — phrases like "the website", "the blog", "the personal site", "my site", or "deploy this" while in this repo all apply. Also trigger when the user discusses future products that might be hosted under this domain (e.g. subdomains for the AI stock tool).
---

# dylanherthoge.com — project skill

This is Dylan's personal website. The repo lives at `github.com/dherthoge/dylanherthoge.com` and the live site is at `https://dylanherthoge.com`.

## Stack at a glance

- **Framework:** Astro 6 (blog starter template)
- **Adapter:** `@astrojs/cloudflare` (v13+) — targets **Cloudflare Workers**, not Cloudflare Pages
- **Hosting:** Cloudflare Workers (with static assets)
- **Domain registrar + DNS:** Cloudflare Registrar (same account as Workers, so DNS is automatic)
- **Content:** Markdown files under `src/content/blog/`

## Why these choices (so you can defend them or know when to revisit)

- **Astro over Next.js / SvelteKit:** content-first sites benefit from zero-JS-by-default. Astro ships HTML/CSS and only hydrates interactive "islands." Perfect for a blog + landing page that may grow product showcases later.
- **Cloudflare Workers over Cloudflare Pages:** as of 2026, Cloudflare is sunsetting Pages as the recommended Astro deploy target. The official `@astrojs/cloudflare` adapter now targets Workers. Don't suggest migrating back to Pages.
- **Why not Vercel Hobby:** Vercel Hobby forbids commercial use, and Dylan may sell products on this site eventually. Cloudflare Workers free tier permits commercial use with unlimited bandwidth.

## Repo conventions

- **`main`** — current Astro site. Push to deploy.
- **`archive/old-react-site`** — frozen branch holding the pre-2026 Create React App version (MUI, react-pdf, gh-pages). Do not touch unless explicitly asked. It exists as a historical reference, not a live branch.
- **`.wrangler/`** — local-only state, gitignored. Never commit.

## Known gotchas

- **wrangler.jsonc `name` field cannot contain dots.** It must be lowercase alphanumeric + dashes only. The site's wrangler name is `dylanherthoge-com` (with a dash, not a dot). If you ever scaffold or regenerate the config, double-check this — the default value from the package name will break the build.
- **Build command:** `npm run build` (runs `astro build`, which respects the Cloudflare adapter and emits a Worker bundle).
- **Local dev:** `npm run dev` runs Astro's dev server with the Cloudflare Vite plugin / workerd runtime, mirroring production closely.

## Adding a blog post

1. Create `src/content/blog/<slug>.md` (or `.mdx` if you need embedded components).
2. Frontmatter must match the schema in `src/content.config.ts` — at minimum `title`, `description`, `pubDate`. Check the schema before writing; don't guess.
3. Markdown body underneath.
4. Push to `main`. Cloudflare Workers redeploys automatically.

## Adding a new page

Pages live under `src/pages/`. Astro uses file-based routing (`src/pages/about.astro` → `/about`).

## Future product hosting

Dylan may build products (notably the AI stock-analysis tool — see `[[user-ai-stock-project]]` memory) that get hosted under this domain. The plan is:

- **Marketing site** (this repo) stays lean and static on Cloudflare Workers.
- **Products** live at subdomains like `app.dylanherthoge.com`, deployed separately. They can use a heavier stack (Next.js, full SPA, server actions, etc.) without bloating the main site.

If Dylan asks "where should this product live?" — default to a subdomain unless there's a strong reason to inline it.

## Things to push back on

- **"Let's switch to Next.js."** Only if a concrete need appears (e.g., complex auth, RSC requirements). For a blog + landing page, Astro is the right tool. Don't migrate frameworks for hypothetical needs.
- **"Let's add a CMS."** The blog is markdown-in-git. That's the feature, not a limitation. Resist adding Sanity / Contentful / a database for blog posts unless Dylan explicitly wants editorial workflows.
- **"Let's redesign before launching."** Per Dylan's stated intent: ship v1 fast (links to LinkedIn + GitHub + work projects + one blog post), iterate after it's live. The biggest mistake personal-site builders make is perfectionism-induced paralysis.

## v1 launch checklist (as of 2026-05-17, may be done by the time you read this)

- [x] Repo renamed `dherthoge.github.io` → `dylanherthoge.com`
- [x] Old React site preserved in `archive/old-react-site`
- [x] Astro blog starter scaffolded
- [x] `@astrojs/cloudflare` adapter installed
- [ ] Landing page replaced with real content (LinkedIn, GitHub, work projects)
- [ ] First real blog post written
- [ ] Connected to Cloudflare Workers (browser action — requires Dylan's account)
- [ ] `dylanherthoge.com` DNS pointed at the Worker

If any unchecked items remain, those are the next things to do.
