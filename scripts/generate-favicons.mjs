// Render the SVG favicon to transparent PNGs via Playwright (real Chromium
// so the system serif fallback works for the "DH" glyphs).
// Run: node scripts/generate-favicons.mjs

import { chromium } from 'playwright';
import sharp from 'sharp';
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';

const svg = readFileSync('public/favicon.svg', 'utf8');
const html = `<!doctype html>
<html><head><meta charset="utf-8">
<style>html, body { margin: 0; padding: 0; background: transparent; }
#icon { display: block; width: 512px; height: 512px; }</style>
</head>
<body>${svg.replace('<svg ', '<svg id="icon" width="512" height="512" ')}</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 512, height: 512 } });
await page.setContent(html);
await page.waitForLoadState('networkidle');

// omitBackground: true → screenshot has alpha rather than the default white viewport.
const buf = await page.locator('#icon').screenshot({ omitBackground: true });
await browser.close();

writeFileSync('public/_tmp-favicon-512.png', buf);

for (const size of [48, 96, 192]) {
  await sharp('public/_tmp-favicon-512.png')
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(`public/favicon-${size}.png`);
  console.log(`wrote public/favicon-${size}.png`);
}

await sharp('public/_tmp-favicon-512.png')
  .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile('public/favicon.ico');
console.log('wrote public/favicon.ico');

unlinkSync('public/_tmp-favicon-512.png');
console.log('done.');
