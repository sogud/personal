# Sogud.me

个人网站与博客的唯一维护项目。保留 Bamboo OS 桌面首页、媒体文件夹和 BYOK Terminal，文章统一在 `/blog/` 阅读。

## 路由

- `/`：Bamboo OS 桌面，提供 Blog 入口和最近文章。
- `/blog/`：文章列表，支持按标题、摘要和标签搜索。
- `/blog/<slug>/`：文章阅读页，包含目录、阅读进度和返回列表入口。
- `/rss.xml`：公开文章订阅。
- `/folders/<slug>/`：媒体文件夹。
- `/apps/terminal/`：BYOK Terminal。

## 写文章

唯一内容目录为 `src/content/blog/`，使用 Markdown。例如 `src/content/blog/my-post.md` 对应 `/blog/my-post/`：

```yaml
---
title: 文章标题
description: 一句话摘要
pubDate: 2026-09-12
tags: [技术]
author: Sogud
draft: false
---
```

正文从 `##` 开始，页面会显示 frontmatter 中的标题。`draft: true` 的文章不会生成阅读页，也不进入列表、RSS 或 sitemap。

`projects/blog` 的两篇文章已转为 Markdown 迁入这里，原文与日期保留；其中 Next.js 部署说明记录的是旧站实现。原仓库只保留历史参考，不再作为写作或部署入口。

## 开发与部署

```bash
npm install
npm run dev
npm run build
npm run preview
```

技术栈：Astro、MDX、React、Tailwind CSS。生产站点 `https://sogud.me` 使用 Cloudflare Workers 服务 `personal`，配置在 `wrangler.toml`，入口为 `src/worker.ts`，静态资源来自 `dist/`。

明确准备发布时，先构建，再执行 `npm run deploy`。此项目不使用 Cloudflare Pages。Terminal 只接受用户自己的 API key。

旧域名 `blog.sogud.me` 的跳转需在其现有托管配置中另行设置：`/` 到 `https://sogud.me/blog/`，文章路径到 `https://sogud.me/blog/<slug>/`，RSS 到 `https://sogud.me/rss.xml`。本次代码合并不会更改线上域名或部署。
