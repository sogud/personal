---
title: Markdown Examples
pubDate: 2021-03-19
description: View examples of common Markdown and MDX formatting in the new blog system.
tags:
  - web development
author: Sogud
---

## Headings

Use headings to create a readable outline. The page title comes from frontmatter,
so posts should normally begin at `##`.

### A smaller heading

This is a paragraph under a smaller heading.

## Emphasis

**This is bold text.**

_This is italic text._

~~This is struck through.~~

## Blockquotes

> Good writing is a debugging tool for your own thinking.

## Lists

Unordered:

- Read the source.
- Find the real boundary.
- Make the change small enough to reason about.

Ordered:

1. Write the draft.
2. Run the site locally.
3. Ship the static export.

## Code

Inline code works like `getAllPosts()`.

```tsx
export default function Example() {
  return <p>MDX is rendered at build time.</p>
}
```

## Tables

| Option | Description |
| --- | --- |
| MDX | Local files with React components when needed. |
| RSS | Generated from the same post metadata. |
| Static export | Easy to deploy to Cloudflare Pages. |

## Links

- [Next.js](https://nextjs.org)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [GitHub](https://github.com/sogud/blog)
