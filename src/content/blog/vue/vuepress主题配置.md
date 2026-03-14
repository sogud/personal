---
title: "VuePress 主题配置完全指南"
description: "深入讲解 VuePress 的安装、配置、自定义主题开发以及常用插件集成"
pubDate: "2018-01-13T16:07:32"
tags: ["VuePress", "Vue", "静态网站", "文档"]
---

# VuePress 主题配置完全指南

VuePress 是 Vue 官方推出的静态网站生成器，特别适合构建文档网站。

## 1. 快速开始

### 安装

```bash
npm install -D vuepress@next
# 或
yarn add -D vuepress@next
```

### 创建项目

```bash
mkdir my-docs && cd my-docs
npm init -y
```

### 创建文档

```
.
├─ docs
│  ├─ .vuepress
│  │  └─ config.js
│  └─ README.md
└─ package.json
```

## 2. 基础配置

```javascript
// docs/.vuepress/config.js
module.exports = {
  title: '我的文档',
  description: '这是我的第一个 VuePress 站点',

  // 主题配置
  theme: '@vuepress/default',

  // 头部导航
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'GitHub', link: 'https://github.com' }
    ],

    // 侧边栏
    sidebar: {
      '/guide/': [
        {
          title: '指南',
          children: ['/guide/getting-started.md', '/guide/config.md']
        }
      ]
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vuepress' }
    ],

    // 页脚
    footer: 'MIT Licensed | Copyright © 2023-present'
  }
}
```

## 3. Front Matter

```yaml
---
title: 文章标题
description: 文章描述
date: 2023-01-01
tags:
  - Vue
  - JavaScript
---

# 内容
```

## 4. 常用插件

### 1. 自动生成侧边栏

```bash
npm install -D @vuepress/plugin-sidebar
```

### 2. 代码高亮主题

```javascript
// config.js
module.exports = {
  themeConfig: {
    prism: {
      theme: 'github-dark'
    }
  }
}
```

### 3. 搜索功能

```bash
npm install -D @vuepress/plugin-search
```

### 4. 评论功能

```bash
npm install -D @vssue/vuepress-plugin-vssue
```

## 5. 自定义主题

### 主题目录结构

```
.vuepress
├── components/
│   └── MyComponent.vue
├── layouts/
│   └── Layout.vue
├── styles/
│   ├── index.styl
│   └── palette.styl
├── index.js
└── enhanceApp.js
```

### 布局组件

```vue
<!-- layouts/Layout.vue -->
<template>
  <div class="theme-layout">
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script>
export default {
  name: 'Layout'
}
</script>
```

## 6. 部署

### GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: 16

      - name: Deploy
        run: |
          npm install
          npm run docs:build
          cp -r docs/.vuepress/dist ./dist || true
          git checkout -b gh-pages
          cp -r docs/.vuepress/dist/* .
```

## 7. 最佳实践

### 文章目录结构

```
docs
├── .vuepress
│   ├── config.js
│   └── public
│       └── images
├── guide
│   ├── getting-started.md
│   └── configuration.md
├── api
│   └── README.md
├── posts
│   ├── 2023-01-01-hello.md
│   └── 2023-01-02-world.md
└── README.md
```

### 导航配置

```javascript
module.exports = {
  themeConfig: {
    nav: [
      {
        text: '指南',
        items: [
          { text: '快速开始', link: '/guide/' },
          { text: '配置', link: '/guide/config' },
          { text: 'Markdown', link: '/guide/markdown' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          title: '指南',
          children: [
            '/guide/README.md',
            '/guide/getting-started.md',
            '/guide/config.md'
          ]
        }
      ]
    }
  }
}
```

## 总结

VuePress 是构建文档网站的理想选择：
- **开箱即用**：默认主题功能完善
- **Vue 支持**：可以使用 Vue 组件
- **Markdown 增强**：支持 Vue in Markdown
- **高性能**：静态生成，加载快速