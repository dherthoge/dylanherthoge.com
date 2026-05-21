// Render the editorial-style 1200x630 OG image to src/assets/og-default.png.
// Uses Playwright + a real Chromium so EB Garamond loads correctly from
// Google Fonts. Run via `node scripts/generate-og-image.mjs`.

import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500&family=Inter+Tight:wght@500;600&display=swap" rel="stylesheet">
<style>
	*, *::before, *::after { box-sizing: border-box; }
	html, body { margin: 0; padding: 0; width: 1200px; height: 630px; }
	body {
		background: #faf7f2;
		color: #1a1814;
		font-family: 'Inter Tight', sans-serif;
		padding: 80px 96px 64px;
		position: relative;
	}
	.burst {
		position: absolute;
		top: 80px;
		right: 96px;
		width: 56px;
		height: 56px;
	}
	.role {
		font-family: 'Inter Tight', sans-serif;
		font-size: 22px;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #8a8378;
		margin-bottom: 30px;
	}
	.name {
		font-family: 'EB Garamond', serif;
		font-size: 152px;
		font-weight: 500;
		line-height: 0.95;
		letter-spacing: -0.02em;
		color: #1a1814;
		margin: 0 0 30px;
	}
	.rule {
		width: 96px;
		height: 4px;
		background: #1a1814;
		margin: 0 0 28px;
		border: 0;
	}
	.tagline {
		font-family: 'EB Garamond', serif;
		font-size: 36px;
		line-height: 1.3;
		color: #1a1814;
		max-width: 720px;
		margin: 0;
	}
</style>
</head>
<body>
	<svg class="burst" viewBox="0 0 24 24" aria-hidden="true">
		<g fill="#b54b2a">
			<path d="M 12,1.6 Q 12.7,5.0 13.0,7.2 Q 12.6,8.2 12.3,9.2 L 11.7,9.2 Q 11.4,8.2 11.0,7.2 Q 11.3,5.0 12,1.6 Z" transform="rotate(2 12 12)"/>
			<path d="M 12,2.0 Q 12.5,4.8 12.9,7.5 Q 12.5,8.4 12.25,9.4 L 11.75,9.4 Q 11.5,8.4 11.1,7.5 Q 11.5,4.8 12,2.0 Z" transform="rotate(37 12 12)"/>
			<path d="M 12,1.4 Q 12.8,5.2 13.1,7.0 Q 12.65,8.0 12.35,9.0 L 11.65,9.0 Q 11.35,8.0 10.9,7.0 Q 11.2,5.2 12,1.4 Z" transform="rotate(73 12 12)"/>
			<path d="M 12,1.8 Q 12.6,4.6 13.0,7.4 Q 12.55,8.3 12.3,9.3 L 11.7,9.3 Q 11.45,8.3 11.0,7.4 Q 11.4,4.6 12,1.8 Z" transform="rotate(109 12 12)"/>
			<path d="M 12,2.1 Q 12.55,5.0 12.85,7.1 Q 12.5,8.1 12.25,9.1 L 11.75,9.1 Q 11.5,8.1 11.15,7.1 Q 11.45,5.0 12,2.1 Z" transform="rotate(143 12 12)"/>
			<path d="M 12,1.5 Q 12.75,5.3 13.05,7.3 Q 12.6,8.3 12.3,9.3 L 11.7,9.3 Q 11.4,8.3 10.95,7.3 Q 11.25,5.3 12,1.5 Z" transform="rotate(181 12 12)"/>
			<path d="M 12,2.0 Q 12.6,4.9 12.95,7.4 Q 12.55,8.4 12.3,9.4 L 11.7,9.4 Q 11.45,8.4 11.05,7.4 Q 11.4,4.9 12,2.0 Z" transform="rotate(216 12 12)"/>
			<path d="M 12,1.7 Q 12.7,5.1 13.0,7.2 Q 12.6,8.2 12.3,9.2 L 11.7,9.2 Q 11.4,8.2 11.0,7.2 Q 11.3,5.1 12,1.7 Z" transform="rotate(254 12 12)"/>
			<path d="M 12,1.9 Q 12.55,4.7 12.9,7.5 Q 12.5,8.5 12.25,9.5 L 11.75,9.5 Q 11.5,8.5 11.1,7.5 Q 11.45,4.7 12,1.9 Z" transform="rotate(289 12 12)"/>
			<path d="M 12,1.6 Q 12.65,5.2 13.05,7.0 Q 12.6,8.0 12.3,9.0 L 11.7,9.0 Q 11.4,8.0 10.95,7.0 Q 11.35,5.2 12,1.6 Z" transform="rotate(323 12 12)"/>
		</g>
	</svg>
	<div class="role">Full-Stack Developer II</div>
	<h1 class="name">Dylan<br>Herthoge.</h1>
	<hr class="rule">
	<p class="tagline">Building AI Assist at Tire Rack — conversational shopping in the spirit of "alexa for shopping."</p>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.waitForLoadState('networkidle');
// Give web fonts an extra moment to settle.
await page.waitForTimeout(1000);
const buf = await page.screenshot({ omitBackground: false, type: 'png' });
await browser.close();
writeFileSync('src/assets/og-default.png', buf);
console.log('wrote src/assets/og-default.png');
