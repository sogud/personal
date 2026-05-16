import { getCollection } from 'astro:content';

export async function get(context) {
  let posts = [];
  try {
    posts = await getCollection('blog', ({ data }) => {
      return !data.draft;
    });
  } catch (error) {
    posts = [];
  }

  const staticPages = [
    '',
    '/about',
    '/apps/terminal',
    '/blog',
    '/folders/writing',
    '/folders/images',
    '/folders/videos',
    '/folders/music',
  ];

  const urls = [
    // 静态页面
    ...staticPages.map(page => ({
      url: `${context.site}${page}`,
      changefreq: 'weekly',
      priority: page === '' ? 1.0 : 0.8,
      lastmod: new Date().toISOString(),
    })),
    // 博客文章
    ...posts.map(post => ({
      url: `${context.site}blog/${post.slug}/`,
      changefreq: 'monthly',
      priority: 0.6,
      lastmod: post.data.updatedDate?.toISOString() || post.data.pubDate.toISOString(),
    }))
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, changefreq, priority, lastmod }) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
