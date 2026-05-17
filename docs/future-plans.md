# Future plans

## Products under subdomains

If Dylan builds products (e.g. the AI stock-analysis tool), they get their own subdomain — `app.dylanherthoge.com`, `stocks.dylanherthoge.com`, etc. — deployed as separate repos.

**Why:** the marketing site stays lean and static on Cloudflare Workers. Products can use a heavier stack (Next.js, SPA, server actions, auth) without bloating the main site.

Default to a subdomain unless there's a strong reason to inline a product into this repo.
