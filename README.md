# Sogud.me - 技术博客与摄影作品集

这是一个基于 Astro 构建的个人技术博客和摄影作品集网站，部署在 Cloudflare Pages 上。

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 本地预览
npm run preview

# 手动部署到 Cloudflare Pages
npm run deploy
```

## 🏗️ 技术架构

- **框架**: Astro v2.0.9+
- **UI 组件**: React v18.2.0
- **样式**: Tailwind CSS + PostCSS
- **内容格式**: Markdown + MDX
- **部署**: Cloudflare Pages

### 核心特性
- ✅ 双重内容类型：技术博客 + 摄影作品
- ✅ 完整 SEO 优化（Sitemap、RSS、结构化数据）
- ✅ 响应式设计，移动端友好
- ✅ PWA 支持
- ✅ 自动图片优化
- ✅ 性能优先的静态生成

## 📁 项目结构

```
src/
├── content/              # 内容集合
│   ├── blog/            # 博客文章（Markdown）
│   └── photography/     # 摄影作品（Markdown + 元数据）
├── components/          # 可复用组件
├── layouts/             # 页面布局
├── pages/               # 路由页面
├── styles/              # 全局样式
└── consts.ts            # 全局配置
```

## ✍️ 内容管理

### 添加博客文章
在 `src/content/blog/` 目录下创建 Markdown 文件：

```markdown
---
title: "文章标题"
description: "文章描述"
pubDate: 2024-01-15
tags: ["技术", "前端"]
draft: false
---
# 文章内容...
```

### 添加摄影作品
在 `src/content/photography/` 目录下创建 Markdown 文件：

```markdown
---
title: "作品标题"
description: "作品描述"
pubDate: 2024-01-15
images:
  - src: "/photography/image.jpg"
    alt: "图片描述"
    width: 1920
    height: 1080
location: "拍摄地点"
camera: "相机型号"
category: "风景"  # 风景、人像、街拍、建筑、微距、其他
---
# 作品描述...
```

将图片文件放在 `public/photography/` 目录中。

## 🌐 部署配置

### 推荐部署方式：Cloudflare Pages 直接集成
1. 访问 [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. 创建新项目并连接到 GitHub 仓库
3. Cloudflare 会自动检测 Astro 项目并配置构建设置
4. 设置自定义域名 `sogud.me`

### 自动部署流程
- 推送代码到 `main` 分支 → 自动构建 → 自动部署到生产环境
- 创建 Pull Request → 自动生成预览链接

### 构建配置
- **构建命令**: `npm run build`
- **输出目录**: `dist`
- **框架**: Astro (自动检测)

## 🔧 环境配置

### 全局常量 (`src/consts.ts`)
```typescript
export const SITE_TITLE = 'Sogud.me - 技术博客';
export const SITE_DESCRIPTION = '专注于前端开发、全栈技术和编程实践的技术博客';
export const SITE_URL = 'https://sogud.me';
export const AUTHOR_NAME = 'Sogud';
```

### 站点配置 (`astro.config.mjs`)
- 站点 URL: `https://sogud.me`
- Markdown 高亮: Shiki (`dark-plus` 主题)
- 支持语言: JavaScript, TypeScript, HTML, CSS, JSON, Markdown, Bash, YAML, JSX, TSX

## 📈 SEO 与性能

### SEO 特性
- 自动生成 Sitemap (`sitemap.xml`)
- RSS 订阅支持 (`rss.xml`)
- Open Graph 和 Twitter Card 元数据
- 结构化数据 (JSON-LD)
- 规范 URL 设置

### 性能优化
- Astro 零 JavaScript 默认策略
- 图片懒加载和 WebP 支持
- 关键资源预加载
- Tailwind CSS JIT 编译
- Cloudflare CDN 加速

## 🛠️ 故障排除

### 常见问题
1. **构建失败**: 检查 Node.js 版本（推荐 18+）和依赖安装
2. **图片不显示**: 确认图片路径正确且文件存在于 `public/` 目录
3. **部署失败**: 验证 Cloudflare Pages 项目配置和域名设置

### 调试命令
```bash
# 本地构建测试
npm run build
npm run preview

# 检查构建输出
ls -la dist/

# 验证部署
curl -I https://sogud.me
```

## 📊 监控与维护

### 推荐工具
- **Google Search Console**: 监控搜索表现
- **Google PageSpeed Insights**: 性能分析
- **Cloudflare Analytics**: 网站流量和性能监控

### 维护计划
- **每周**: 发布新内容，更新旧文章
- **每月**: 检查 SEO 表现，优化关键词
- **每季度**: 更新依赖包，安全审计

---

**域名**: [https://sogud.me](https://sogud.me)
**作者**: Sogud
**许可证**: MIT