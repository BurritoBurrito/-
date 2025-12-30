// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

import sitemap from '@astrojs/sitemap';

import Compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  site: 'https://burritoedition.com',
  integrations: [vue(), sitemap(), Compress()]
});