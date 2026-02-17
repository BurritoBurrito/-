// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

import sitemap from '@astrojs/sitemap';

import Compress from 'astro-compress';

import compress from 'vite-plugin-compression';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  site: 'https://burritoedition.com',
  integrations: [
    vue(),
    sitemap(),
    Compress()
  ],
  vite: {
    plugins: [
      compress({
        algorithm: 'brotliCompress',
        threshold: 10240,
      }),
    ],
  },
});