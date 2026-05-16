import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://sogud.me',
  integrations: [
    mdx(), 
    react(), 
    tailwind()
  ],
  experimental: {
    viewTransitions: true
  },
  markdown: {
    shikiConfig: {
      theme: 'dark-plus',
      wrap: true,
      langs: [
        'javascript',
        'typescript',
        'html',
        'css',
        'json',
        'markdown',
        'bash',
        'yaml',
        'jsx',
        'tsx'
      ]
    }
  }
});
