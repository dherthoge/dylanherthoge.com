# Architecture decisions

Why the site is built the way it is. Read this before suggesting a stack change.

## Astro over Next.js / SvelteKit

Content-first sites benefit from zero-JS-by-default. Astro ships HTML/CSS and only hydrates interactive "islands." This is a blog + landing page that may grow product showcases — Astro is the right shape.

**When to revisit:** if the site grows complex auth, RSC needs, or heavy interactivity beyond islands.

## Cloudflare Workers over Cloudflare Pages

As of 2026, Cloudflare is sunsetting Pages as the recommended Astro deploy target. The official `@astrojs/cloudflare` adapter targets Workers. Don't suggest migrating back to Pages.

## Cloudflare Workers over Vercel Hobby

Vercel Hobby forbids commercial use. This site may eventually sell products, so a free tier that permits commercial use matters. Cloudflare Workers free tier allows commercial use with unlimited bandwidth.

## Markdown-in-git over a CMS

The blog is markdown files in the repo. That's the feature, not a limitation. Don't add Sanity / Contentful / a database for blog posts unless there's an explicit need for editorial workflows (multiple non-technical authors, scheduled publishing, etc.).

## Things to push back on

- "Let's switch to Next.js" — only if a concrete need appears
- "Let's add a CMS" — see above
- "Let's redesign before launching" — ship v1 fast, iterate after. Perfectionism kills personal sites.
