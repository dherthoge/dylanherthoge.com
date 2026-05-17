---
description: Start the local Astro dev server with hot reload, verify it's reachable, and open it in the browser. Use when the user wants to preview the site, see changes live, or starts a session intending to work on the site. Triggers include "/serve", "spin up the site", "start the dev server", "let me see it", "open the site".
allowed-tools: Bash(npm run dev*) Bash(curl *) Bash(open *) Bash(lsof *)
---

# Serve

Bring up the local Astro dev server and open it in the browser.

## Procedure

1. **Check if it's already running.** Run `lsof -ti:4321` — if it returns a PID, the server is already up. Skip straight to step 4.

2. **Start the dev server in the background.** Run `npm run dev` with `run_in_background: true`. Do NOT block on it. Astro hot-reloads on file changes; once it's up you don't need to restart for code edits.

3. **Verify it's reachable.** Poll until ready:
   ```
   until curl -s -o /dev/null -w "%{http_code}" http://localhost:4321 | grep -q "200\|301\|302"; do sleep 1; done
   ```
   Cap this at ~15 seconds. If it never comes up, read the background process output to see what went wrong (likely a port conflict or a syntax error in the project).

4. **Open the browser.** Run `open http://localhost:4321` (macOS). If the user already had it open, this just focuses the tab.

5. **Tell the user it's up.** One line: "Dev server running at http://localhost:4321 — hot reload is on, just edit and save."

## Notes

- The default port is 4321. If Astro picks a different one (port conflict), read it from the background process output and use that instead.
- Don't kill an existing dev server unless the user asks — they may have it intentionally running.
- Hot reload is automatic in Astro; you do NOT need to tell the user to refresh after every edit.
