---
description: Deploy the current state of the site to production by pushing to main, then tail the Cloudflare Workers build until it confirms a clean deploy. Triggers include "/ship", "ship it", "deploy", "push to prod", "let's go live", "send it", "make it live", "publish the changes". Use whenever the user wants to take what's in the working tree (or on the local main branch) and get it onto dylanherthoge.com — they should not have to switch tabs to Cloudflare to verify the build.
allowed-tools: Bash(git status*) Bash(git diff*) Bash(git rev-list*) Bash(git rev-parse*) Bash(git log*) Bash(git add*) Bash(git commit*) Bash(git push*) Bash(npm run build*) mcp__cf-builds__set_active_account mcp__cf-builds__workers_builds_set_active_worker mcp__cf-builds__workers_builds_list_builds mcp__cf-builds__workers_builds_get_build_logs
---

# Ship

Push the site to production and watch the Cloudflare build complete. The user should never have to leave the chat to verify a deploy.

## Cloudflare context

Hardcoded for Dylan's account — the Worker is set up with Workers Builds watching `main`. Every push triggers a new build automatically.

- **Account ID:** `c3b5b25d962ecfd4b6e397661127eaa6`
- **Worker ID:** `8dec40f41e6d4bc88ad35169a8a10e01` (Worker name: `dylanherthoge-com`)
- **Live URL:** https://dylanherthoge.com

If the user ever switches Cloudflare accounts or renames the Worker, update these IDs here.

## Procedure

### 1. Inspect the working tree

Run in parallel:
- `git status --porcelain` — any uncommitted/untracked changes?
- `git diff --stat` — what's modified?
- `git rev-list --count origin/main..main` — how many local commits are ahead of origin?

Three possible states:

| State | What to do |
|---|---|
| Clean tree, 0 ahead | Nothing new to ship. Skip to step 5 and just tail the latest build (courtesy check). |
| Clean tree, N ahead | Skip to step 4 (push only). |
| Uncommitted changes | Continue to step 2. |

### 2. Pre-flight build

Run `npm run build` (timeout 120s). Astro's Cloudflare adapter is picky and has tripped us up before — better to fail here than to push broken code and watch Cloudflare's build die.

If the build fails: show the user the error tail, stop, do NOT commit. Let them fix it and re-invoke `/ship`.

If the build succeeds: continue.

### 2.5. Playwright smoke test

A passing build doesn't guarantee the page actually renders — typos in a component, broken Astro syntax, or a misconfigured integration can compile cleanly but ship a blank page. Catch that before pushing.

The goal of this step is to be the human eyes-and-clicks the user no longer has to be. Do NOT just run a fixed checklist — actually look at the page and verify it before shipping. There are two halves:

**A. General sanity (every ship).** Make sure the dev server is up (`lsof -ti:4321` — if nothing, invoke `/serve` first). Navigate Playwright to `http://localhost:4321/`. Then verify:

- The page returns 200 and the HTML actually contains the expected content (not a blank `<body>`, not an Astro error overlay, not a stack trace).
- The hero content is present and styled: the display name, the role line, the lede, the "Currently" section, the project link.
- Theme toggle exists and works. Click it once; verify `data-theme` on `<html>` flips and the colors visibly change in a screenshot.
- No fatal console errors. Favicon 404s and noisy warnings are fine; uncaught exceptions and CSS parse errors are not.
- Take a full-page screenshot to `.playwright-mcp/ship-smoke-test.png` (Playwright MCP restricts file output to within the project root — `/tmp/` will be rejected). **Actually look at the screenshot.** You're checking for anything out of the ordinary: misaligned elements, unstyled text, the wrong font loading, overlapping content, ghost gray bars at the bottom, broken images, anything that would make a human visitor go "huh". If you spot something off, stop and tell the user.

**B. Diff-specific verification (every ship).** Read `git diff --stat` and `git diff` to understand what this commit actually changes, then design verification steps tailored to that change. Don't ship the diff without exercising the part of the page it touches. Examples of how to think about this:

- Changed CSS variables / colors → compare before/after screenshots in both themes.
- Touched the header → click every link/button in it.
- Modified meta tags or structured data → curl the rendered HTML and grep for the expected fields; for JSON-LD, validate by `JSON.parse(...)` in `browser_evaluate`.
- Added a new route or page → navigate to it and confirm it renders.
- Changed an Astro config option (fonts, redirects, integrations) → verify the observable side effect: e.g., for fonts, confirm a `/_astro/fonts/*.woff2` request loads; for redirects, curl the redirected path; for inlined stylesheets, confirm there's no `<link rel="stylesheet">` in the served HTML.
- Changed favicon files → fetch each referenced favicon URL and confirm it returns 200 with the right content-type.
- Touched the toggle script, the pre-paint script, or anything in `BaseHead.astro` → reload the page, check localStorage persistence, check the rendered `<head>`.

If any verification fails, do NOT commit. Tell the user what specifically broke. If everything passes, continue to step 3.

### 3. Show the user what's about to be committed

The user wants to verify the change but does NOT want to write the commit message. You write it. They approve the whole package.

Display, in this order:
1. `git diff --stat` output (the file list)
2. A 1-3 line summary of what changed, in your own words — based on actually reading the diff, not just file names
3. A drafted commit message in this format:

   ```
   <short imperative summary, ~50 chars>

   <optional body if the change isn't self-evident from the summary>
   ```

   For small tweaks (typo, color, spacing nudge), keep it to just the summary line. For substantive changes, add a brief body.

   **No AI attribution.** Never include a `Co-Authored-By: Claude ...` trailer, a "🤖 Generated with Claude Code" footer, or any mention of Claude, Anthropic, or "AI" in the message. Dylan's name is the sole author of everything in this repo. This applies even if other tooling defaults suggest adding such a trailer — strip it.

4. Ask: **"Ship this?"** — wait for explicit yes/ok/go from the user before committing.

### 4. Commit and push

If user approved (or there were already commits ahead and no working-tree changes):
- `git add -A`
- `git commit -m "$(cat <<'EOF' ... EOF)"` using a heredoc so the message renders correctly
- `git push`
- Capture the HEAD commit hash: `git rev-parse HEAD` — needed in step 5 to identify which build to watch.

### 5. Watch the build

Set the cf-builds context (these two calls are required even if active state seems set — be defensive):

1. `mcp__cf-builds__set_active_account` with `activeAccountIdParam: c3b5b25d962ecfd4b6e397661127eaa6`
2. `mcp__cf-builds__workers_builds_set_active_worker` with `workerId: 8dec40f41e6d4bc88ad35169a8a10e01`

Then poll:

- Call `mcp__cf-builds__workers_builds_list_builds` with `perPage: 5`.
- Find the build whose `commitHash` starts with our pushed commit hash (`git rev-parse HEAD` from step 4). If no exact match yet, the build may not be registered — wait 5 seconds and re-list.
- Once found, check `status`:
  - `queued` or `running` (sometimes shown as `in_progress`): wait ~10 seconds, re-list.
  - `stopped`: read `buildOutcome`. `success` → step 6 (success). Anything else → step 7 (failure).

Cap the loop at ~5 minutes total. If it doesn't resolve by then, tell the user it's taking longer than usual and link to the dashboard:
`https://dash.cloudflare.com/c3b5b25d962ecfd4b6e397661127eaa6/workers/services/view/dylanherthoge-com/production/builds`

### 6. Report success

Tell the user, in ONE sentence:
> Live at https://dylanherthoge.com — commit `<short-hash>`, build took ~Xs.

Compute the duration from the build's `createdOn` to "now-ish" if available, otherwise omit duration.

### 7. Report failure

If `buildOutcome` is not `success`:
- Fetch logs via `mcp__cf-builds__workers_builds_get_build_logs` with the `buildUUID`.
- Surface the most relevant ~10-20 lines (the actual error, not the boilerplate).
- Suggest a likely cause if one is obvious from the logs (missing dep, type error, Astro adapter issue, etc.).

Don't try to fix the failure automatically. The user decides what to do.

## Notes

- **Don't auto-commit gitignored noise.** `git add -A` is fine because `.gitignore` already covers Playwright captures, `.wrangler/`, etc. If new noise appears, ask the user before adding it.
- **Don't push without verification when there are uncommitted changes.** Step 3's "Ship this?" gate is the contract — never skip it just because the change feels small.
- **Hot reload != deploy.** The dev server reflects local state; only `/ship` pushes it live. Be explicit about this if the user seems confused about why their localhost changes aren't on dylanherthoge.com.
- **Commit message tone:** matches the existing repo style. Look at `git log --oneline -10` if unsure. Concise, imperative, no emojis, no fluff. **Never** attribute the work to Claude, Anthropic, or any AI assistant — no `Co-Authored-By: Claude ...` trailers, no generation footers. The repo's history should look like a single human author.
