// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://dylanherthoge.com',
  integrations: [mdx(), sitemap()],

  // v1: lock the site to the home page. The blog/about/rss routes
  // are deleted from src/pages but redirects catch any old URLs.
  redirects: {
    '/about': '/',
    '/blog': '/',
    '/rss.xml': '/',
  },

  // Self-host the fonts so they ship from our own origin — kills the
  // render-blocking Google Fonts CSS request that PageSpeed flagged.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'EB Garamond',
      cssVariable: '--font-display',
      weights: [400, 500, 600],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Iowan Old Style', 'Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter Tight',
      cssVariable: '--font-body',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['-apple-system', 'system-ui', 'sans-serif'],
    },
  ],

  adapter: cloudflare(),
});