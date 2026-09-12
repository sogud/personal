---
title: Next.js Static Blog
pubDate: 2021-03-18
description: The old Nextra starter has been replaced by a small content-first static blog.
tags:
  - web development
author: Sogud
---

This site is now a static Next.js blog. It keeps the useful part of a framework:
file-based routing, build-time rendering, metadata, and feeds. It avoids the
parts that make a personal blog feel like a product template.

## How posts work

Each post lives in its own folder:

```txt
content/posts/my-post/index.mdx
```

The folder name becomes the URL slug. For example,
`content/posts/my-post/index.mdx` becomes `/my-post/`.

## Frontmatter

Every post starts with metadata:

```yaml
---
title: My Post
date: 2026-05-10
spoiler: A short sentence for the homepage and feed.
tags:
  - notes
author: Sogud
---
```

The homepage, article page, RSS feed, Atom feed, sitemap, and Open Graph metadata
all read from that same block.

## Deployment shape

The build uses `output: "export"`, so `next build` produces static files in
`out/`. Cloudflare Pages can publish that folder directly after connecting the
GitHub repository.
