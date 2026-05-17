# SEO: a primer for a developer who wants to actually understand it

Written for Dylan, May 2026. The goal of this document is two things at once:

1. Teach SEO well enough that you can apply it to **any** client site, not just this one.
2. Give you a concrete, prioritized action plan for `dylanherthoge.com`.

It tries to explain the *mechanism* behind every recommendation. SEO is a field full of cargo-culted advice — half the blog posts repeat each other and the other half contradict each other. The way to stay sane is to lean on first-party sources (Google Search Central, web.dev, Microsoft Bing, Schema.org, MDN) and reason from how the system actually works.

The whole field can be summarized in one sentence: **the search engines want to send users to pages that satisfy what they were looking for**. Everything else is a consequence of that.

---

## Table of contents

1. [How search actually works in 2026](#how-search-actually-works-in-2026)
2. [On-page SEO: writing pages search engines understand](#on-page-seo-writing-pages-search-engines-understand)
3. [Structured data with JSON-LD](#structured-data-with-json-ld)
4. [Technical SEO: the plumbing](#technical-seo-the-plumbing)
5. [Core Web Vitals and performance](#core-web-vitals-and-performance)
6. [Content, intent, and E-E-A-T](#content-intent-and-e-e-a-t)
7. [Off-page SEO: links, mentions, and authority](#off-page-seo-links-mentions-and-authority)
8. [The AI-era layer: LLM search and answer engines](#the-ai-era-layer-llm-search-and-answer-engines)
9. [Verification and monitoring](#verification-and-monitoring)
10. [Astro-specific recipes](#astro-specific-recipes)
11. [Common mistakes and dark patterns to avoid](#common-mistakes-and-dark-patterns-to-avoid)
12. [For dylanherthoge.com — prioritized action plan](#for-dylanherthogecom--prioritized-action-plan)
13. [Authoritative resources to bookmark](#authoritative-resources-to-bookmark)

---

## How search actually works in 2026

Before optimizing for a system, understand how it works. There are three sequential stages — **crawling**, **indexing**, **ranking** — plus a relatively new fourth layer: **AI synthesis**.

### 1. Crawling

A crawler (Googlebot, Bingbot, GPTBot, ClaudeBot, etc.) is a program that downloads pages and follows links. They start from a seed list and a sitemap, then discover new pages via `<a href>` links from pages they already know about.

Two practical consequences:

- **If a page isn't linked from anywhere and isn't in your sitemap, it's effectively invisible.**
- **Crawl budget matters on large sites.** Google allocates a finite amount of crawling per site per day, biased by perceived authority and update frequency. Wasting budget on duplicates, infinite parameter combinations, or thin pages means real pages get re-crawled less often. (For a small personal site this is a non-issue, but you'll need to know it for client work.)

Modern crawlers render JavaScript, but rendering happens in a second pass that can lag the initial crawl. Pages whose primary content is HTML are indexed faster and more reliably than ones whose content only appears after a JS render. This is one reason Astro's "static HTML by default" is an SEO advantage out of the box.

### 2. Indexing

Once crawled, the page is parsed: text extracted, structured data parsed, canonical URL determined, language detected, duplicates folded together. Then it's evaluated for quality. Google publicly distinguishes between pages that get into the main index (eligible to rank for competitive queries) and pages that are "Crawled — currently not indexed" (Google judged the content not worth storing). On a thin or low-quality site, Google may decide to skip indexing entirely.

Key gates that block indexing:

- `noindex` meta tag or `X-Robots-Tag: noindex` HTTP header
- `robots.txt` `Disallow` on the URL (note: blocks crawling, but a blocked URL can still appear in results without a description if other sites link to it)
- The page being judged duplicative of another URL (Google picks one as canonical)
- The page being judged low-quality / thin

### 3. Ranking

For a given query, Google scores all candidate pages and returns them in order. The score is a function of many signals, but the public framing has stabilized around a few buckets:

- **Relevance**: does the page match the query's words and meaning (the latter via embedding/semantic matching)?
- **Quality**: is the content people-first, expert, accurate? Captured by the **E-E-A-T** framework (Experience, Expertise, Authoritativeness, Trustworthiness).
- **Usability**: is the page fast, mobile-friendly, accessible, HTTPS? Captured by **Core Web Vitals** and **page experience**.
- **Authority**: do other sites link to or mention this page / domain?
- **User signals**: are people clicking this result and staying on it (NavBoost / click data)? Google denied this for years and DOJ-leaked documents in 2023–2024 confirmed it's used.
- **Freshness**: for query types where recency matters, newer content wins.

Don't try to memorize "ranking factors." There isn't a numbered list. There's a giant model trained on billions of judgments, and the signals above feed it.

### 4. AI synthesis (the new layer)

Since 2024 a fourth stage matters: AI systems summarize and cite web content. The major surfaces:

- **Google AI Overviews** and **AI Mode** — Google's LLM-generated answer at the top of SERPs, with inline citations. Reach over 2B monthly users.
- **Bing chat / Copilot search** — Microsoft's equivalent. Bing's index also feeds ChatGPT's search and DuckDuckGo.
- **Perplexity** — answer engine that nearly always cites sources.
- **ChatGPT (with browsing)** — does live retrieval; mentions brands more than it cites links.

These systems pull from the regular web index. They tend to favor pages with **clear, front-loaded answers**, **structured data**, and **authoritative brand signals**. AI Overviews already correlate with a ~34% drop in click-through on affected queries — being *cited* matters more than ranking #1 if your goal is to appear in the answer.

Implication: optimizing for traditional rank and optimizing for AI citation overlap heavily, but the AI side rewards crisper, more declarative writing.

Sources: Google's [How Search Works](https://www.google.com/search/howsearchworks/), Google [Search Central docs](https://developers.google.com/search/docs), [Search Engine Land on AI Overviews](https://searchengineland.com/library/platforms/google/google-ai-overviews).

---

## On-page SEO: writing pages search engines understand

This is the layer you have the most direct control over.

### Title tag — the single most influential on-page signal

```html
<title>Dylan Herthoge — Full-Stack Developer at Tire Rack</title>
```

What it does: it's the headline of your search result and the most weighted on-page text signal. A clear, specific title beats a clever one almost every time.

Practical rules:

- **Keep it under ~60 characters** (Google truncates around 600 pixels; varies by character width).
- **Lead with the most important words.** Google truncates from the right.
- **One title per page, unique.** If five pages share the same title, Google will rewrite them on the fly and pick worse rewrites than you would have.
- **Match what's actually on the page.** If the title and body don't match, Google may swap your title for one it generates from the page body. Watch for this in Search Console.
- **Brand placement:** for the homepage, lead with your name. For deep pages, lead with the page topic and append the brand: `Page topic — Brand`.

### Meta description — not a ranking factor, but a CTR lever

```html
<meta name="description" content="Dylan Herthoge is a Full-Stack Developer II at Tire Rack building conversational commerce. Writes about software, tires, and the messy middle.">
```

What it does: Google often uses this as the snippet under the title in the SERP. **It does not directly affect ranking.** But it heavily affects whether users click your result, and CTR is a signal Google uses to validate result quality.

Rules:

- **140–160 characters.** Google truncates around 920 pixels.
- **Write it like ad copy.** What does the user get if they click?
- **Include the search terms naturally.** Matched terms get bolded in the SERP.
- **Unique per page.** Don't reuse one description across the site.
- **Don't bother writing one if you'd rather Google guess.** If you write a bad description, you lock in a bad snippet. A page with no description lets Google pick a snippet from the body, which is sometimes better.

### Heading hierarchy: H1, H2, H3

The standard advice is "one H1 per page, then nest H2s under it, H3s under those, never skip levels."

Mechanism:

- For **search engines**: headings are weighted higher than body text and signal the document's structure. They help disambiguate "what is this page about."
- For **accessibility**: screen reader users navigate by heading. A logical hierarchy is how they understand the page shape.
- For **AI/LLM crawlers**: headings are extraction targets. AI Overviews disproportionately cite pages whose answers sit under a clear H2/H3.

Honest note: Google has publicly said that multiple H1s and out-of-order headings don't directly hurt rankings. But the *content discoverability* effect via accessibility and snippet extraction is real, and the cost of doing it right is zero. Do it right.

Hierarchy example for a blog post:

```html
<h1>How conversational commerce changes recommendation UX</h1>
  <h2>The problem with spec-sheet shopping</h2>
    <h3>Treadwear scores</h3>
    <h3>Speed ratings</h3>
  <h2>What "ask, don't filter" looks like in practice</h2>
  <h2>Building it on top of an existing catalog</h2>
```

### Semantic HTML

Use the elements that say what they mean. `<article>`, `<nav>`, `<main>`, `<header>`, `<footer>`, `<aside>`, `<time datetime="2026-05-17">`. Search engines and accessibility tools both extract structure from these.

Bad: `<div class="article-title">Title</div>`
Good: `<h1>Title</h1>` inside `<article>`

### Internal linking

Internal links pass authority within your site and tell search engines which pages are important.

- **Use descriptive anchor text.** "How I built the AI Assist project" beats "click here."
- **Link to the canonical URL** (no trailing slash inconsistencies, no `?ref=` params).
- **Keep important pages within ~3 clicks of the homepage.** This is the "flat architecture" principle. Pages buried 6 clicks deep get crawled rarely and rank poorly.
- **Topic clusters / hub-and-spoke**: when you have a body of content on one topic, create a "pillar" page that introduces the topic and links to detailed "spoke" pages, with the spokes linking back to the pillar. This is the modern alternative to chronological blog archives. For Dylan: when there are 5+ posts on conversational commerce, create one "Conversational commerce" pillar page and link the posts to/from it.

### Image SEO

Three things matter:

1. **`alt` text.** A concise description of the image's purpose in context. For a screenshot of a chat UI: `alt="Screenshot of the Tire Rack AI Assist chat answering a question about all-season tires"`. Decorative images use `alt=""` (empty, not omitted) so screen readers skip them.
2. **Explicit `width` and `height` attributes.** These reserve layout space and prevent CLS. Astro's `<Image>` component handles this for you.
3. **Modern formats.** WebP or AVIF instead of JPG. Smaller = faster LCP.

```astro
---
import { Image } from 'astro:assets';
import heroImg from '../assets/hero.png';
---
<Image src={heroImg} alt="Description of the image" width={1200} height={630} loading="lazy" />
```

Two pitfalls:

- **Never `loading="lazy"` your LCP image** (usually the hero/above-the-fold image). Lazy loading defers the load — exactly the wrong thing for the metric you're trying to optimize.
- **Don't keyword-stuff alt text.** "blue jeans denim pants levis 501" is worse than "Levi's 501 jeans in blue".

### Keywords without keyword stuffing

The 2010s tactic of repeating "best widget reviews" 14 times per page is dead. Modern search uses semantic embeddings — it understands that "fast tire" and "high-performance summer tread" overlap conceptually.

Practical rules:

- **Use the target phrase naturally** in the title, H1, and once in the first paragraph.
- **Cover the topic comprehensively** rather than repeating the same phrase. Synonyms and related concepts strengthen relevance via the embedding model.
- **Write like a human.** If a sentence sounds like it was written for a robot, rewrite it.

---

## Structured data with JSON-LD

This is one of the highest-leverage changes you can make to a site, especially for AI citation.

### What it is and why it matters

Structured data is a machine-readable description of what's on a page, using a shared vocabulary called **Schema.org**. Google supports three serialization formats — JSON-LD, microdata, RDFa — but [explicitly recommends JSON-LD](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) because it's separable from the visible content and easier to maintain.

What it does for you:

- **Rich results** — star ratings, recipe times, FAQ accordions, breadcrumbs in the SERP.
- **Entity disambiguation** — when 14 people share your name, structured data tells Google which one is *you*.
- **AI citation** — LLM crawlers ingest JSON-LD and use it to build the entity model. Pages with strong structured data are more likely to be referenced.
- **Knowledge Graph eligibility** — if you ever want to appear as a panel on the right side of search results, structured data is the foundation.

JSON-LD is a `<script type="application/ld+json">` block. It goes in `<head>` (or anywhere; head is conventional). There is **no visible effect** on the page; it's purely metadata.

### Schemas that matter for a personal/portfolio site

- **`Person`** — describes a human. The core schema for Dylan.
- **`WebSite`** — describes the website itself; lets you declare a `SearchAction` for sitelinks search box.
- **`ProfilePage`** — when a page is *about* a single person (like a homepage that is essentially a bio). Pairs with `Person` as its `mainEntity`.
- **`Article` / `BlogPosting`** — for blog posts.
- **`BreadcrumbList`** — declares the breadcrumb trail, enabling breadcrumbs in the SERP.
- **`Organization`** — for companies (not relevant here since you're a person, not an org).

### A complete homepage block for dylanherthoge.com

This pairs `ProfilePage` and `Person` (the right combo for a homepage that's effectively "this is who I am"), and uses `WebSite` separately. Multiple JSON-LD blocks on one page are fine; you can also combine them with `@graph`.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://dylanherthoge.com/#website",
      "url": "https://dylanherthoge.com/",
      "name": "Dylan Herthoge",
      "description": "Personal site of Dylan Herthoge, Full-Stack Developer at Tire Rack.",
      "inLanguage": "en-US"
    },
    {
      "@type": "ProfilePage",
      "@id": "https://dylanherthoge.com/#profile",
      "url": "https://dylanherthoge.com/",
      "name": "Dylan Herthoge",
      "mainEntity": { "@id": "https://dylanherthoge.com/#person" }
    },
    {
      "@type": "Person",
      "@id": "https://dylanherthoge.com/#person",
      "name": "Dylan Herthoge",
      "givenName": "Dylan",
      "familyName": "Herthoge",
      "url": "https://dylanherthoge.com/",
      "jobTitle": "Full-Stack Developer II",
      "worksFor": {
        "@type": "Organization",
        "name": "Tire Rack",
        "url": "https://www.tirerack.com"
      },
      "description": "Full-Stack Developer building conversational commerce at Tire Rack.",
      "knowsAbout": [
        "Software engineering",
        "Conversational AI",
        "E-commerce",
        "Full-stack web development",
        "TypeScript",
        "Astro"
      ],
      "homeLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "South Bend",
          "addressRegion": "IN",
          "addressCountry": "US"
        }
      },
      "sameAs": [
        "https://github.com/dherthoge",
        "https://www.linkedin.com/in/dylanherthoge"
      ]
    }
  ]
}
</script>
```

The `@id` URIs with fragments (`#website`, `#person`) let you cross-reference entities — `ProfilePage.mainEntity` points to the `Person` by its `@id`. This is the cleaner pattern Google's docs use.

**The `sameAs` array is the most important property for a personal site.** It tells Google "this Person on this site is the same Person as these external profiles." Every authoritative URL you add (GitHub, LinkedIn, Twitter/X, Mastodon, Stack Overflow, conference speaker pages, Wikipedia if you ever get one) makes the entity more grounded. This is how you become "an entity Google knows about" — the prerequisite for Knowledge Panel candidacy.

### Validating

Two tools, run both:

- **[Google Rich Results Test](https://search.google.com/test/rich-results)** — tells you which Google features your markup is eligible for.
- **[Schema.org Validator](https://validator.schema.org/)** — generic correctness check; catches typos in property names.

After deploy, the **Search Console > Enhancements** section will surface errors and warnings on live pages.

### JSON-LD vs microdata vs RDFa

Short answer: use JSON-LD. The other two interleave attributes (`itemtype`, `vocab`, `property`) into your HTML, which means structured data evolves coupled to your markup. JSON-LD lets you change templates without breaking schema, and you can drop schema into the `<head>` from a layout file regardless of where the visible content lives. Google [recommends it explicitly](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data#format).

---

## Technical SEO: the plumbing

The job here is: make sure crawlers can find every page you want indexed, and only those, and that they understand what's canonical.

### Sitemap.xml

A sitemap is an XML file listing the URLs on your site you want indexed. Astro's `@astrojs/sitemap` integration (already installed) builds this from your static routes at build time.

Why it matters:

- It's a **discovery mechanism**. New pages get picked up faster than waiting for a crawler to follow links.
- It lets you tell crawlers about **lastmod** timestamps so they re-crawl updated pages sooner.
- Submission to Search Console is the cleanest way to monitor indexing status — you'll see exactly how many of your URLs are indexed.

It's **not** a ranking signal. It's a hint. Google [says explicitly](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) that submission "doesn't guarantee crawling or indexing."

For Dylan: it's already configured in `astro.config.mjs`. Verify after build that `dist/sitemap-index.xml` exists, then submit it to Search Console and Bing Webmaster Tools. Reference it in `robots.txt` too.

### robots.txt

A plain text file at `/robots.txt` that tells crawlers which paths they're allowed to fetch. Astro does not generate one automatically.

A minimum, sane robots.txt for a personal site:

```txt
User-agent: *
Allow: /

Sitemap: https://dylanherthoge.com/sitemap-index.xml
```

That tells all bots they can access everything and points them at the sitemap.

What `robots.txt` is *not*: a privacy or noindex mechanism. A page blocked in `robots.txt` can still be indexed if other sites link to it; Google just won't crawl it to read its content. If you want a page **not in the index**, use a `noindex` meta tag, not robots.txt.

For Astro, place a file in `public/robots.txt` and Astro will serve it as-is. Or generate it dynamically at `src/pages/robots.txt.ts` so it picks up `Astro.site` automatically — useful if you have multiple environments.

### Canonical URLs

A `<link rel="canonical" href="...">` in `<head>` tells search engines "this is the official URL for this page." It's the primary way to handle accidental duplicates.

Why it matters:

- **Consolidates ranking signals.** If your page is reachable at `/about/`, `/about`, `/?ref=twitter`, and `https://www.dylanherthoge.com/about`, those look like four different URLs to a crawler. Canonical tags collapse them.
- **Prevents Google from picking the wrong URL.** Without a canonical, Google guesses. It often guesses wrong, especially for sites with multiple param variants.

Rules (from [Google's canonical docs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)):

- **Self-referential is best practice.** Every indexable page should have a canonical pointing to itself (with the URL you want indexed — usually no trailing slash, no query params).
- **Use a single canonical signal per page.** Don't put one URL in your sitemap and a different one in `<link rel=canonical>`.
- **Internal links should point at the canonical URL.** Consistency reinforces the signal.
- **Cross-domain canonicalization** is real: if you syndicate a post to Medium, you can set Medium's canonical back to your original. Worth doing if syndicating.

Your `BaseHead.astro` already does this correctly:

```astro
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
// ...
<link rel="canonical" href={canonicalURL} />
```

### Redirects

A redirect tells the browser (and search engine) "this URL has moved." Two codes matter:

- **301 Permanent** — pass nearly all link equity to the new URL. Use for permanent moves.
- **302 Temporary** — Google treats short-term 302s as effectively 301s now, but the semantic intent is "this is temporary."

For a personal site, the main use cases are:

1. **Pre-launch URL cleanup.** Your `astro.config.mjs` already redirects `/about`, `/blog`, `/rss.xml` → `/` while you've collapsed to one page. That's fine. When you bring those pages back, *remove the redirect* — don't add a redirect from `/about` → `/` and then later try to host content at `/about`.
2. **Domain canonicalization.** Decide between `www.dylanherthoge.com` and `dylanherthoge.com` (Cloudflare can redirect one to the other). Pick the apex (no www) — it's shorter, cleaner. Make sure all internal links use the chosen form.

Two pitfalls:

- **No redirect chains.** `A → B → C` loses some equity at each hop. Always redirect directly to the final destination.
- **Don't redirect everything to `/`.** When a page goes away permanently and there's no relevant replacement, return a 404 (or 410 Gone). Redirecting unrelated pages to the homepage is called "soft 404" and Google penalizes it.

### HTTPS

Mandatory. Cloudflare gives this for free, so this is solved. Worth noting only because: if a client's site is on HTTP, fixing it is the single highest-impact technical SEO change available.

### Mobile-friendliness

Google has used a mobile-first index since 2019, meaning the version of your page Googlebot sees and ranks is the *mobile* version. If your mobile page has less content than desktop, the missing content effectively doesn't exist.

For Astro responsive sites this is usually fine — the same markup serves both. Check with Chrome DevTools device emulation that nothing important is hidden behind `display: none` on small screens.

### noindex and `X-Robots-Tag`

Two ways to tell Google "do not index this":

```html
<meta name="robots" content="noindex">
```

```http
X-Robots-Tag: noindex
```

The meta tag works for HTML pages. The HTTP header works for anything — PDFs, images, JSON files. Set it via your server or Worker.

When to use:

- **Staging environments** (along with HTTP auth — never rely on `noindex` alone on staging since the URL might still be crawled).
- **Search results pages** on a site with on-site search.
- **Tag/category archive pages** that exist for navigation but don't carry standalone value.
- **Pages you want crawlers to follow but not surface**: use `<meta name="robots" content="noindex,follow">` to let link equity still flow.

You will probably not need this on a personal site. Worth knowing for client work.

---

## Core Web Vitals and performance

Page speed is a confirmed ranking factor, formalized as the Core Web Vitals. As of 2026 there are three metrics, all measured at the 75th percentile of real visitor data (the "field data" from Chrome User Experience Report — CrUX):

| Metric | What it measures | Good | Needs work | Poor |
|--------|------------------|------|------------|------|
| **LCP** (Largest Contentful Paint) | Time until the largest visible element (usually hero image or H1) renders | ≤ 2.5s | 2.5–4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | Latency between user input and visual response, 98th percentile across the visit | ≤ 200ms | 200–500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | How much visible content shifts unexpectedly during load (dimensionless) | ≤ 0.1 | 0.1–0.25 | > 0.25 |

INP replaced FID (First Input Delay) in March 2024 — it's harder to score well on because it measures every interaction across the visit, not just the first one.

### Why it ranks

User experience is what Google is selling. Faster, more stable pages keep users happy with the SERP result, which keeps users on Google, which sells more ads. Performance also strongly correlates with conversion: 100ms of LCP improvement can move conversions a few percentage points.

But it's a tiebreaker, not a magic bullet. A perfectly performant page with thin content will still lose to a slower page with better content. Don't spend a month going from 2.0s to 1.8s LCP if you have 3 blog posts. Spend the month writing post #4.

### How to measure

- **[PageSpeed Insights](https://pagespeed.web.dev/)** — paste a URL, get both field data (real users) and lab data (Lighthouse simulation). Field data is what Google uses for ranking; lab data is what you debug against during development.
- **Chrome DevTools > Lighthouse** — local audit including SEO and accessibility checks.
- **Chrome DevTools > Performance panel** — record an interaction and inspect actual timing.
- **Search Console > Core Web Vitals report** — site-wide rollup of field data with URLs broken out by status.
- **[web.dev/measure](https://web.dev/measure/)** — same as PageSpeed Insights but with a cleaner UX.

INP can't be measured in pure lab tests because it requires real interactions. Lighthouse approximates it with Total Blocking Time (TBT). In production, you need real-user data via PageSpeed Insights, Search Console, or a RUM library like `web-vitals.js`.

### Common LCP fixes

LCP includes Time To First Byte (TTFB), connection time, redirects, render-blocking resources, and the time to actually paint the LCP element. So fixes touch all of those:

- **Serve the LCP image as quickly as possible.** Preload it: `<link rel="preload" as="image" href="hero.webp" fetchpriority="high">`. Never `loading="lazy"` it.
- **Set `fetchpriority="high"`** on the LCP `<img>`.
- **Reduce render-blocking CSS.** Inline critical CSS; defer the rest. Astro's bundling helps but doesn't automatically inline critical.
- **Eliminate unnecessary fonts.** Each font file is a serial network request. Local-host fonts via Astro's font provider (you're already doing this with Atkinson).
- **Avoid client-side rendered hero.** If your H1/hero image is built in JS, it can't render until the JS executes. Astro ships static HTML by default, so this is usually a non-issue.

### Common INP fixes

INP measures input-to-paint latency. Causes are almost always long JavaScript tasks blocking the main thread:

- **Reduce JS payload.** Astro's "zero JS by default" is the easiest fix.
- **Break up long tasks.** If you have a function that takes 200ms, slice it into chunks with `setTimeout(0)` or `scheduler.yield()`.
- **Defer third-party scripts.** Analytics, embeds, etc. should be `async` or `defer`, ideally loaded after first interaction.
- **Avoid heavy synchronous work in event handlers.** Validation, parsing, etc. should be async.

### Common CLS fixes

CLS happens when content jumps around as the page loads:

- **Set explicit width/height on `<img>` and `<iframe>`.** This is the single most common CLS cause.
- **Reserve space for embeds and ads.** Use a wrapper `<div>` with fixed dimensions.
- **Avoid injecting content above existing content.** Banners that appear after page load and push everything down are CLS bombs.
- **Use `font-display: swap` carefully.** It can cause FOUT (flash of unstyled text), which counts as layout shift. `font-display: optional` avoids it but may not show your font at all.

The current site is already in good shape on this — pure HTML/CSS, no client-side framework, no above-fold ads. Worth running PageSpeed Insights after launch to confirm.

---

## Content, intent, and E-E-A-T

This is the part that matters most and that most engineers underweight.

### Search intent

Every query has an intent. The classic four-bucket model:

- **Informational** — "what is conversational commerce" — user wants to learn.
- **Navigational** — "tire rack" — user wants a specific destination.
- **Commercial investigation** — "best michelin all-season tires" — user is evaluating options before buying.
- **Transactional** — "buy michelin crossclimate2 245/45r19" — user is ready to act.

The mistake amateurs make: writing the wrong intent for the keyword. A page titled "best conversational AI tools" should be a comparison/evaluation page. If you publish a 4000-word philosophical essay there, it won't rank no matter how good it is — it's the wrong shape for the intent.

For Dylan: your name ("Dylan Herthoge") is a **navigational** query. The user typing it wants to find you, specifically. The pages that rank for it should be: your personal site (the canonical you), your LinkedIn, your GitHub, your conference talks, etc. **Your personal site is the page Google should pick as canonical for "Dylan Herthoge."** If you put it together correctly with strong entity markup, it almost certainly will be — your name isn't competing with a famous person.

### Keyword research, briefly

For a personal site you don't need to do "keyword research" in the SEO-industry sense. What you should do:

1. **Decide what topics you want to be known for.** ("Conversational commerce," "Astro for content sites," "AI in e-commerce" — whatever you're actually working on.)
2. **Search those topics yourself.** See what ranks. Read what's already there. Identify what's *missing*.
3. **Use Google Search Console after a few months** to see which queries Google is *already* surfacing your site for. These are the ones to lean into — Google has effectively told you "this is what we think your site is about."

For client work, the standard toolset:

- **[Google Search Console](https://search.google.com/search-console)** — free, first-party, shows what queries you already rank for.
- **[Google Trends](https://trends.google.com/)** — relative search volume over time.
- **[Keyword Planner](https://ads.google.com/home/tools/keyword-planner/)** — free with a Google Ads account, gives volume estimates.
- **Paid tools** — Ahrefs, Semrush, Mangools. Useful at scale; not necessary for a personal site.

### Search intent + AI Overviews

AI Overviews disproportionately cite content that answers a question directly and structurally:

- **Question-shaped subheads** ("What is conversational commerce?") perform well.
- **A direct answer in the first 2 sentences** under the subhead is what gets extracted.
- **Numbered lists and tables** are AI-extraction targets.
- **Original data, screenshots, and personal experience** are differentiators — AI Overviews try not to cite content that's just a rephrasing of what's already common knowledge.

### E-E-A-T

Stands for Experience, Expertise, Authoritativeness, Trust. Pronounced "double-E-A-T." It is not a single ranking signal — it's a framework Google's *quality raters* use to evaluate result quality, and the algorithm is tuned to match what raters score highly.

- **Experience** — added in late 2022. Did the author actually *do* the thing? A product review by someone who used the product beats one that summarizes other reviews.
- **Expertise** — does the author know what they're talking about? Formal credentials sometimes, demonstrated competence always.
- **Authoritativeness** — is the site/author recognized as authoritative in this space? Citations, mentions, backlinks from peers.
- **Trust** — is the content accurate, transparent, and honest? *Most important of the four*, per Google.

How to show it on a personal site:

- **An "About" page with your real name, photo, role, employer, and links to verifiable accounts.** This is the foundation.
- **Bylines on blog posts.** Link to your About page from the byline.
- **Concrete details that prove first-hand experience.** "I built X. Here's the code, here's what broke, here's the metric." Beats abstract summary every time.
- **Cite sources for claims you didn't author.** Look credible, be credible.
- **Get older.** Domain age and content history are real signals. A personal site built five years ago with steady updates outranks a new site, all else equal. (Patience is genuinely a strategy.)

### YMYL: a flag to know

**YMYL** (Your Money or Your Life) is Google's category for content where bad advice can hurt people — medical, financial, legal, safety. Google holds YMYL content to a much higher quality bar and weighs author expertise heavily. As an engineer writing about engineering, you're not YMYL — but a *client* in medical or financial space is, and the bar is significantly higher.

---

## Off-page SEO: links, mentions, and authority

Everything we've discussed so far is on-page. Off-page is the other half: what other sites say about you.

### Backlinks

A backlink is any inbound `<a href>` from another domain. Google has used backlinks as a quality/authority signal since PageRank in 1998. They still matter, but the bar for what "counts" is much higher than it was.

What counts:

- **Editorial links** from real, topically relevant sites. A link to your post from a respected engineering blog is worth a thousand links from auto-generated directory sites.
- **Mentions of your domain** even without a clickable link. Google understands implicit citations and weighs them similarly.

What doesn't count (or actively hurts):

- **Paid links**, link farms, link exchanges. Google's SpamBrain detects these in near-real-time and either ignores them or penalizes the site.
- **Directory submissions** to anything other than a few legitimately curated industry directories.
- **PBNs** (private blog networks) — a 2015 SEO trick that gets sites de-indexed in 2026.

What's actually worth doing for a personal site:

- **Put your URL in your bio everywhere.** GitHub profile, LinkedIn, Twitter/X, Mastodon, Stack Overflow, Hacker News profile, conference speaker pages, podcast episode notes.
- **Write content people link to organically.** A post that solves a specific technical problem with code attracts links automatically over years.
- **Speak / write for other venues.** Guest posts on tech blogs, conference talks (recorded talks get linked from CFP listings), podcast appearances.
- **Open source.** A README that links to your site, on a repo with stars, is a long-lived link from a high-authority domain (`github.com`).

What's *not* worth doing:

- Chasing "Domain Authority" scores (DA / DR — those are third-party metrics from Moz/Ahrefs, not Google numbers).
- Reciprocal link schemes.
- Comment-spam links.
- Buying "high DA backlinks."

### Brand mentions (the new currency)

In the AI era, **unlinked brand mentions** correlate with AI visibility about 3x more strongly than backlinks do. A mention of "Dylan Herthoge" in a blog post — even without a hyperlink — feeds the entity model that LLMs use.

Tactics that build brand mentions:

- Commenting thoughtfully on Hacker News, lobste.rs, Reddit r/programming under your real name.
- Speaking at meetups and conferences (talks get written up).
- Publishing things people want to cite (a benchmark, a tool, a deeply-researched explainer).
- Being interviewed on podcasts.

### Social signals

Direct social media activity isn't a ranking signal (Google has said this repeatedly), but:

- Social posts can drive traffic, which is observed by Google as a signal.
- Social profiles populate your `sameAs` array.
- Activity on LinkedIn, X, GitHub builds the entity-mention graph.

---

## The AI-era layer: LLM search and answer engines

A lot of SEO advice from 2018–2022 still applies. But several things changed in the last two years and you should know them.

### What changed

- **AI Overviews replace clicks.** A query that used to send 100 users to your site might now send 60 — the other 40 read the AI summary and don't click. This is most pronounced for informational queries.
- **Being cited matters more than ranking.** A page that's cited inline in Google's AI Overview gets a small flag of authority on Google's surface even if the user doesn't click through. For brand-building this is real.
- **Entity signals matter more.** LLMs work in entity-space, not keyword-space. "Dylan Herthoge — Tire Rack — conversational commerce" is a triple the LLM stores. Strong schema markup feeds this triple directly.
- **First-party voice wins.** AI Overviews try not to summarize summaries. Original content with first-hand experience gets cited; rewrites of other content rarely do.

### llms.txt — probably skip it

There's a proposed convention called `llms.txt` (analogous to `robots.txt`) that puts a markdown summary of your site at `/llms.txt` for AI agents to ingest. It was proposed by Jeremy Howard in September 2024.

**As of 2026, no major AI company has committed to honoring it in production**. Google has explicitly said they don't and won't. Anthropic, OpenAI, Microsoft, and Meta haven't committed either. Adoption sits around 10% of sites, mostly developer docs.

Where it *is* useful: **developer tools that index docs** (Cursor, Claude Code, Windsurf, GitHub Copilot) look for `llms.txt` and `llms-full.txt` when you point them at a documentation site. This is a developer-experience win, not an SEO win.

For Dylan: don't bother yet. Revisit in 12 months if vendors actually adopt it. If you do add one, do it as a small markdown file with links to your key pages — no harm done.

### AI bot crawlers in robots.txt

The crawlers from AI vendors split into two categories:

1. **Training crawlers** — `GPTBot` (OpenAI), `ClaudeBot` / `anthropic-ai` (Anthropic), `Google-Extended` (Google's training, distinct from Googlebot which does search indexing), `CCBot` (Common Crawl), `Applebot-Extended`, `Meta-ExternalAgent`. These fetch content for training future models.
2. **Retrieval crawlers / user agents** — `ChatGPT-User`, `OAI-SearchBot`, `Claude-Web`, `PerplexityBot`, `Perplexity-User`. These fetch content in real time to answer specific user queries.

If you want to **show up in AI search answers**, allow the retrieval crawlers. If you want to **avoid your content being used to train models**, block the training crawlers. A common stance for individual creators:

```txt
# robots.txt
User-agent: *
Allow: /

# Disallow AI training crawlers — keep my content out of training sets
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

# Allow AI retrieval / real-time agents — appear in AI search answers
User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

Sitemap: https://dylanherthoge.com/sitemap-index.xml
```

A pragmatic personal-site argument is the opposite: **allow everything**, including training crawlers. Your goal as someone building a personal brand is to be referenced by future LLMs when someone asks "who is Dylan Herthoge?" or "who builds conversational commerce?" Being in the training set is how that happens. Trade-offs:

- **Block training crawlers**: protects content; limits future LLM recall.
- **Allow training crawlers**: increases LLM recall; you have no control over how your words are used.

A reasonable default for a developer building a brand is to **allow everything**. Make a deliberate choice; either is defensible.

### Cloudflare's default AI block

Important: Cloudflare added a feature in July 2025 called **AI Crawl Control** that, on new zones, defaults to **blocking many AI bots**. Since `dylanherthoge.com` is on Cloudflare, **you need to check this**. Go to your Cloudflare dashboard > the zone > AI Crawl Control. Either disable the blocking (allow everything) or configure which bots to allow.

If you skip this step, your robots.txt is irrelevant — Cloudflare blocks the bot at the edge before it ever reaches your server.

### How to be cited by AI

Concrete tactics:

- **Lead with the answer.** First sentence of a section should answer the question the section asks.
- **Use question-shaped subheads.** ("How does conversational commerce work?")
- **Add structured data.** Person, Article, FAQPage where relevant.
- **Original content with details.** Specifics, numbers, screenshots, code. Anti-pattern: vague summary.
- **Be a named entity Google knows.** Get into Knowledge Graph via consistent name+role mentions across the web.
- **Get your content into Bing.** ChatGPT search uses Bing's index. Submit your sitemap to Bing Webmaster Tools and enable IndexNow.

---

## Verification and monitoring

You can't optimize what you can't measure.

### Google Search Console

Free, first-party, indispensable.

What you get:

- **Coverage report** — which of your URLs Google has indexed, and why others aren't.
- **Performance report** — queries you appear for, your click-through rate, your average position.
- **Sitemap report** — sitemap submission status and any parsing errors.
- **Core Web Vitals report** — real-user performance metrics for your pages.
- **Enhancements** — structured data validation, mobile usability, AMP if applicable.
- **Manual actions** — if Google ever penalizes you, this is where you'd see it.

Setup for `dylanherthoge.com`:

1. Go to [search.google.com/search-console](https://search.google.com/search-console).
2. Add **Domain property** for `dylanherthoge.com` (covers all subdomains and protocols — better than URL-prefix property).
3. Verify via DNS TXT record. Cloudflare DNS makes this a 30-second task — copy the TXT value, paste into Cloudflare DNS, click verify.
4. Submit your sitemap: `https://dylanherthoge.com/sitemap-index.xml`.
5. Wait. Initial data takes a few days; queries data takes 2–4 weeks to populate.

### Bing Webmaster Tools

Also free. Why it matters: Bing's index feeds Microsoft Copilot, ChatGPT search, and DuckDuckGo. As of 2026 Bing-derived traffic is ~10–15% of organic on most sites but punches above its weight on AI-driven referrals.

Setup:

1. [bing.com/webmasters](https://www.bing.com/webmasters).
2. Add site, verify via DNS or upload XML file, or just **"Import from Google Search Console"** (one-click, no separate verification).
3. Submit your sitemap.
4. Generate an **IndexNow** key, host it at `/<key>.txt` on your domain. Bing then notifies its index immediately on any URL change.

### IndexNow

A push-based indexing protocol. Instead of waiting for a crawler, you POST a URL to Bing/Yandex when you publish or update a page. They re-crawl within minutes.

For a personal site updated occasionally, you don't need to automate this — submit the URL manually via Bing Webmaster Tools when you publish a new post. For client sites with frequent updates, integrate it into the publish pipeline.

### Monitoring rank and visibility

For your name as a query, the test is "do I appear on page 1?". Google your name in an incognito window monthly. If your site doesn't appear on page 1 within 3 months of launch, something is wrong (probably indexing).

For tracking competitive keyword positions, paid tools (Semrush, Ahrefs, Mangools) are useful for client work. For a personal site, Search Console's Performance report is enough.

### Monitoring AI citation

This is a new and immature space. A few options:

- **Manually**: search your topic in ChatGPT, Perplexity, Google AI Overviews, Bing Copilot. Note when you appear.
- **Tools**: Otterly.ai, Brand Armor, AI Visibility Score (Ahrefs). Useful at scale for clients, overkill for a personal site.

---

## Astro-specific recipes

Astro is uniquely well-positioned for SEO out of the box: static HTML generation, zero JS by default, first-class image optimization, content collections with typed frontmatter, sitemap integration. The framework gets you 80% of the way.

The remaining 20% is configuration. Here's what to do for each.

### Site URL

`astro.config.mjs` must declare `site`. Already done:

```js
export default defineConfig({
  site: 'https://dylanherthoge.com',
  // ...
});
```

Without this, the sitemap integration can't generate absolute URLs and canonical tags fall back to relative.

### Sitemap

`@astrojs/sitemap` is already installed. It runs at build time and emits `sitemap-index.xml` and `sitemap-0.xml` into `dist/`. Astro's static routes are picked up automatically.

Add it to `<head>` (already done in your `BaseHead.astro`):

```astro
<link rel="sitemap" href="/sitemap-index.xml" />
```

If you want to **exclude** pages (e.g., a `/draft/...` route during development), use `filter`:

```js
sitemap({
  filter: (page) => !page.includes('/draft/'),
})
```

### robots.txt

Add a `public/robots.txt` with the content discussed above. Astro serves anything in `public/` at the root path unchanged.

Or, for dynamic generation (so it stays in sync with `Astro.site`), create `src/pages/robots.txt.ts`:

```ts
import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: URL) => `User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);
  return new Response(getRobotsTxt(sitemapURL), {
    headers: { 'Content-Type': 'text/plain' },
  });
};
```

### JSON-LD schema

Add to your `BaseHead.astro` (or a dedicated component). For a single-page site, the easiest move is to inline the structured data directly:

```astro
---
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
// ...
const personSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${Astro.site}#website`,
      "url": Astro.site?.href,
      "name": SITE_TITLE,
      "description": SITE_DESCRIPTION,
      "inLanguage": "en-US"
    },
    {
      "@type": "ProfilePage",
      "@id": `${Astro.site}#profile`,
      "url": Astro.site?.href,
      "name": SITE_TITLE,
      "mainEntity": { "@id": `${Astro.site}#person` }
    },
    {
      "@type": "Person",
      "@id": `${Astro.site}#person`,
      "name": "Dylan Herthoge",
      "givenName": "Dylan",
      "familyName": "Herthoge",
      "url": Astro.site?.href,
      "jobTitle": "Full-Stack Developer II",
      "worksFor": {
        "@type": "Organization",
        "name": "Tire Rack",
        "url": "https://www.tirerack.com"
      },
      "description": SITE_DESCRIPTION,
      "knowsAbout": [
        "Software engineering",
        "Conversational AI",
        "E-commerce",
        "Full-stack web development",
        "TypeScript",
        "Astro"
      ],
      "homeLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "South Bend",
          "addressRegion": "IN",
          "addressCountry": "US"
        }
      },
      "sameAs": [
        "https://github.com/dherthoge",
        "https://www.linkedin.com/in/dylanherthoge"
      ]
    }
  ]
};
---

<script type="application/ld+json" set:html={JSON.stringify(personSchema)} />
```

Note `set:html={JSON.stringify(...)}` — Astro escapes by default, but we want raw JSON inside the script tag.

### Open Graph image

Right now `BaseHead.astro` falls back to `blog-placeholder-1.jpg` which is generic. Replace with a custom 1200×630 image for your site:

- 1200×630 is the universal recommended size (1.91:1) and works for Facebook, LinkedIn, Discord, Slack, iMessage, Telegram.
- For X/Twitter, 1200×675 (16:9) is slightly preferred but 1200×630 crops cleanly.
- Keep it under 5MB. PNG for text, JPG for photos.
- Store at `src/assets/og-default.png` (or `.jpg`) and update `BaseHead.astro` to use it as the fallback.

The OG image is what shows when someone shares your URL on social. It's worth investing 30 minutes in a good one.

### Performance: things to verify

- **Image dimensions are explicit.** Astro's `<Image>` enforces this; the SVG burst in `index.astro` already has `width` and `height` attributes — good.
- **Fonts have `font-display: swap`** or similar to prevent invisible text during font load. Your local Atkinson font is configured with `display: swap` already.
- **Don't load both Google Fonts and a local font.** Currently `BaseHead.astro` preconnects to `fonts.googleapis.com` *and* loads local Atkinson via Astro's Font component. The Google Fonts link loads `EB Garamond` and `Inter Tight`. If you're using all three (Atkinson + EB Garamond + Inter Tight), that's three font families × multiple weights = significant LCP cost. Consider either (a) self-hosting EB Garamond and Inter Tight too, via the same `fontProviders.local()` pattern, or (b) dropping one of them if you're not using it.
- **Cloudflare cache headers**: by default static assets get `Cache-Control: public, max-age=0, must-revalidate`. For Astro's fingerprinted bundles, you want `Cache-Control: public, max-age=31536000, immutable`. Cloudflare's [`_headers` file](https://developers.cloudflare.com/workers/static-assets/headers/) (place at `public/_headers`) controls this:

  ```
  /_astro/*
    Cache-Control: public, max-age=31536000, immutable
  ```

### Cloudflare specifics

- **Make sure AI Crawl Control isn't blocking everything.** Check the dashboard.
- **HTTPS is automatic.** Don't disable.
- **Page Rules / Rulesets** can do redirects at the edge — useful for `www → apex` redirects. Faster than doing it in your Worker code.

---

## Common mistakes and dark patterns to avoid

Things that range from "doesn't help" to "actively penalized":

- **Keyword stuffing.** Repeating a phrase to game ranking. Google's been good at detecting this since 2011.
- **Cloaking.** Serving different content to search engines than to users. Triggers fast de-indexing.
- **Doorway pages.** Multiple near-identical pages targeting tiny keyword variations, all funneling to one destination. Penalized in core updates.
- **Hidden text.** Same color as background, off-screen positioning, `display: none` for SEO-only content. Detected, penalized.
- **Paid links.** Sites buying or selling do-follow links. Google's SpamBrain detects link patterns; manual actions follow.
- **PBNs.** Networks of sites that exist only to link to a target. Same outcome as paid links.
- **AI-generated content at scale without editorial value.** Google's March 2024 update specifically targeted "scaled content abuse." Generating 1000 thin AI articles on a topic gets the whole site demoted.
- **Reciprocal link schemes.** "Link to me and I'll link to you" arrangements at scale.
- **Duplicate / near-duplicate content across sites.** Syndication is fine if canonical tags point home; copy-paste isn't.
- **Soft 404s.** Returning 200 OK on a page that says "this page is empty" or redirecting everything to `/`. Wastes crawl budget and gets flagged.
- **Stale legacy redirects.** Old `301 chains` that go A→B→C→D. Collapse to direct redirects.
- **Buying expired domains for their backlink profile.** "Expired domain abuse" is now a formal Google spam category as of March 2024.

If you're ever tempted by an "SEO agency" offering "guaranteed page-1 rankings in 30 days" or "1000 high-DA backlinks," walk away. They'll get a client penalized.

---

## For dylanherthoge.com — prioritized action plan

This is the checklist version. Everything above is the *why*; this is the *what*.

### P0 — do today (before launching publicly)

| # | Task | File |
|---|------|------|
| 1 | **Verify Google Search Console** via DNS TXT record on the Cloudflare zone. Submit `https://dylanherthoge.com/sitemap-index.xml`. | Cloudflare DNS + GSC dashboard |
| 2 | **Verify Bing Webmaster Tools** via "Import from Google Search Console" (one-click after step 1). Submit the sitemap. | Bing Webmaster Tools |
| 3 | **Add a `robots.txt`** that allows crawlers and points at the sitemap. Use a `public/robots.txt` static file. Decide on AI training crawler policy (recommendation: allow them — you want to be cited by future LLMs). | `public/robots.txt` (new) |
| 4 | **Add Person + WebSite + ProfilePage JSON-LD** to the homepage. Put it in `BaseHead.astro` (or a new `SchemaPerson.astro` component) using the block from the [Astro-specific recipes](#astro-specific-recipes) section. | `src/components/BaseHead.astro` |
| 5 | **Update `consts.ts` SITE_TITLE and SITE_DESCRIPTION** for SEO clarity. Current title "Dylan Herthoge" is fine for the homepage `<title>`, but the meta description could be tightened to ~150 chars and emphasize the role + project. Example: `Dylan Herthoge — Full-Stack Developer at Tire Rack, building AI Assist for conversational tire shopping. Notes on software, AI, and e-commerce.` | `src/consts.ts` |
| 6 | **Replace the generic `blog-placeholder-1.jpg` OG fallback** with a custom 1200×630 image at `src/assets/og-default.png`. Even a simple one with your name and a tagline beats the random photo. Update `BaseHead.astro` to import it. | `src/assets/og-default.png` (new), `src/components/BaseHead.astro` |
| 7 | **Check Cloudflare AI Crawl Control settings.** If new-zone defaults are blocking AI bots, decide your stance and configure explicitly. Test by curling with `User-Agent: GPTBot` and confirming a 200. | Cloudflare dashboard |
| 8 | **Pick canonical domain (apex vs www).** Set a Cloudflare redirect from the non-canonical to the canonical. Apex (`dylanherthoge.com`) is recommended. | Cloudflare Rules |

### P1 — do this week

| # | Task | File |
|---|------|------|
| 9 | **Audit fonts.** Decide if you need EB Garamond + Inter Tight + Atkinson, or just Atkinson + one other. Self-host the ones you keep. Remove the Google Fonts `<link rel=stylesheet>` if you can — it's 2 external requests on every page. | `src/components/BaseHead.astro`, `astro.config.mjs` |
| 10 | **Run PageSpeed Insights** on `dylanherthoge.com`. Note the field data for LCP / INP / CLS. Anything not green, fix. | n/a |
| 11 | **Add a `public/_headers` file** for Cloudflare so `/_astro/*` gets `Cache-Control: public, max-age=31536000, immutable`. | `public/_headers` (new) |
| 12 | **Use the Rich Results Test** on your homepage. Confirm Person + ProfilePage + WebSite all validate. Iterate until clean. | https://search.google.com/test/rich-results |
| 13 | **Update `<html lang>`** — already correct as `en` but consider `en-US` for slightly better signal. Low impact. | `src/pages/index.astro` |
| 14 | **Add `<meta name="author" content="Dylan Herthoge">`** to BaseHead. Small entity signal. | `src/components/BaseHead.astro` |
| 15 | **Audit social profiles.** Make sure GitHub, LinkedIn, X (if you use it), Mastodon, etc. all link back to `dylanherthoge.com`. Reciprocal links between *your* properties = entity reinforcement. | Off-site |

### P2 — nice to have / when you have time

| # | Task | File |
|---|------|------|
| 16 | **First blog post.** Frequency of new high-quality posts is the single biggest content-side ranking lever. Even one substantive post per quarter beats zero. | `src/content/blog/<slug>.md` (new) |
| 17 | **Add an /about page** with photo, bio, role, experience, sameAs links visible to humans (mirror what's in the JSON-LD). Both feed E-E-A-T. Use the existing redirect tear-down approach in `astro.config.mjs`. | `src/pages/about.astro` (new) |
| 18 | **Generate per-page OG images.** When you have a blog post titled X, an OG image with the title rendered on it beats the generic site OG. Astro + Satori or a build-time OG generator handles this. | Add new component + integration |
| 19 | **Add BreadcrumbList JSON-LD on deep pages.** When you have a `/blog/post-slug`, declare breadcrumbs: Home > Blog > Post Title. | Blog layout component |
| 20 | **Add Article + Person (author) JSON-LD on each blog post.** Each post should declare its author = the same `@id` as the homepage Person. This unifies the entity graph across the site. | `src/layouts/BlogPost.astro` |
| 21 | **Submit your URL to IndexNow on publish.** Either manually via Bing Webmaster Tools, or automate via a build hook. | Build pipeline |
| 22 | **Set up Google Alerts** for "Dylan Herthoge" so you see new mentions. Use Talkwalker Alerts as the fallback (Google Alerts is unreliable). | Off-site |
| 23 | **Consider a `humans.txt`** at `/humans.txt`. Pure novelty, no SEO impact, but it's a developer tradition. | `public/humans.txt` (optional) |
| 24 | **Consider `llms.txt`.** Skip for now unless major vendors adopt it. Revisit Q4 2026. | Defer |

---

## Authoritative resources to bookmark

A curated short list. These are the ones I'd actually open when I had a question. Skip the SEO-industry blogs that exist mainly to rank for "best SEO tool" — they're optimizing themselves, not teaching you.

- **[Google Search Central](https://developers.google.com/search) and the [Search Central blog](https://developers.google.com/search/blog)** — Google's first-party docs and announcements. The single highest-signal source. Every recommendation here is grounded in this docset.
- **[web.dev](https://web.dev/)** — Google's developer docs on the modern web platform. Definitive source on Core Web Vitals, performance, accessibility. Less marketing, more engineering.
- **[Schema.org](https://schema.org/)** — the canonical vocabulary reference. When you want to know what properties a type has, this is where you look.
- **[MDN Web Docs](https://developer.mozilla.org/)** — the open standard reference for HTML, CSS, JavaScript, HTTP headers (including `X-Robots-Tag`, robots meta tag, etc.). Authored by Mozilla with contributions from Google and others.
- **[Microsoft Bing Webmaster Blog](https://blogs.bing.com/webmaster)** — Bing's official guidance. Relevant for IndexNow, Bing-specific behaviors, and the surfaces (ChatGPT search, DuckDuckGo) that use Bing's index.
- **[Search Engine Land](https://searchengineland.com/)** — the news site of record. Covers algorithm updates, Search Central announcements, and industry trends. Generally reliable on facts; their op-eds vary.
- **[Search Engine Roundtable](https://www.seroundtable.com/)** — Barry Schwartz's daily roundup of what Google and Bing said and did. Best source for "did Google just push an update?" The signal-to-noise on daily SERP volatility coverage is high.
- **[Google Search Central Help on YouTube](https://www.youtube.com/@GoogleSearchCentral)** — John Mueller's office-hours videos and short explainers from Google. Direct from the search team.
- **[Ahrefs Blog](https://ahrefs.com/blog/)** — yes, it's a tool vendor, but Ahrefs' research-driven posts on backlink data, click-through patterns, and SERP analysis are well-sourced. Read for the data; skip the product pitches.
- **[NN/g (Nielsen Norman Group)](https://www.nngroup.com/)** — usability research. Not strictly SEO, but search engines optimize for user behavior, and NN/g is the authoritative source on what users actually do. Helpful for the *why* behind page-experience signals.

---

## Closing notes

A few things worth internalizing:

1. **SEO compounds slowly.** Most of the work you do this month shows up 3–9 months from now. Don't expect overnight movement. If you're patient, the work pays off; if you're chasing fast results you'll end up doing dumb things.
2. **The best SEO is being worth searching for.** Build things. Write about them. Be a real person with a real point of view. The algorithm is tuned to find that.
3. **Your name is the easiest keyword you'll ever rank for.** Within 6 months of launching this site, with the action plan above, `dylanherthoge.com` should be result #1 for "Dylan Herthoge" by a wide margin. After that, the interesting work is ranking for *topics*, not your name.
4. **Don't chase tools.** A free Search Console account + this document covers 95% of what you need. Paid SEO tools shine at competitive analysis and scale — useful for client work, overkill for a personal site.
5. **The AI shift is real but the fundamentals haven't moved.** Good content, fast pages, clear semantics, real authority. AI Overviews and Perplexity haven't changed those — they've just raised the bar on doing them well.
