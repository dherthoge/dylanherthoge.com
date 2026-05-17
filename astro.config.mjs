// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

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

  adapter: cloudflare(),
});