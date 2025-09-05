import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://your-domain.com', // 替换为你的实际域名
  integrations: [
    mdx(), 
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      entryLimit: 10000,
    }), 
    react(), 
    tailwind()
  ],
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
