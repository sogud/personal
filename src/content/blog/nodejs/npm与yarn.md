---
title: "npm 与 yarn 完全指南：包管理工具详解"
description: "深入讲解 npm 和 yarn 的使用、区别、加速配置以及企业级项目中的最佳实践"
pubDate: "2018-01-13T16:07:32"
tags: ["npm", "yarn", "Node.js", "前端工程化"]
---

# npm 与 yarn 完全指南

在前端开发中，包管理工具是必不可少的基础设施。本文详细讲解 npm 和 yarn 的使用、区别以及企业级实践。

## npm vs yarn 对比

| 特性 | npm | yarn |
|------|-----|------|
| 安装速度 | 较慢 | 快（并行下载） |
| 锁文件 | package-lock.json | yarn.lock |
| 缓存 | 无 | 有全局缓存 |
| 离线安装 | 不支持 | 支持 |
| 确定性 | 较低 | 高 |

## nrm 和 yrm：快速切换镜像源

```bash
# 全局安装
npm install nrm -g
npm install yrm -g

# 查看可用源
nrm ls
yrm ls

# 切换到淘宝源
nrm use cnpm
yrm use cnpm
```

### 国内常用镜像源

- 官方：https://registry.npmjs.org/
- 淘宝：https://registry.npmmirror.com/
- 腾讯云：https://mirrors.cloud.tencent.com/npm/

## npm 进阶使用

### 1. package.json 详解

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "项目描述",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "^18.2.0",
    "vue": "3.3.4"
  },
  "devDependencies": {
    "vite": "^4.4.0",
    "eslint": "^8.45.0"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  },
  "sideEffects": ["*.css"]
}
```

### 2. 依赖版本语义化

```
^1.2.3  // 兼容版本，最小版本 1.2.3，可以升级到 2.0.0 以下的版本
~1.2.3  // 补丁版本，允许升级补丁版本
1.2.3   // 精确版本
latest   // 最新版本
*       // 任意版本（不推荐）
```

### 3. npm scripts 技巧

```json
{
  "scripts": {
    "dev": "vite --open",
    "build": "vite build",
    "build:prod": "vite build --mode production",
    "preview": "vite preview",
    "lint": "eslint src --fix",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "prepare": "husky install",
    "postinstall": "echo '安装完成'"
  }
}
```

## yarn 进阶使用

### 1. yarn workspaces

适合 monorepo 项目，多个 package 共用 node_modules：

```json
{
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

### 2. yarn 常用命令

```bash
# 安装依赖
yarn install
yarn add package    # 生产依赖
yarn add -D package # 开发依赖

# 运行脚本
yarn dev
yarn build

# 查看信息
yarn info package
yarn list

# 清理缓存
yarn cache clean
```

## 锁定依赖版本

### npm 的 package-lock.json

```bash
# 生成 lock 文件
npm install --package-lock-only

# 从 lock 文件安装
npm ci  # 更快，适合 CI/CD
```

### yarn 的 yarn.lock

```bash
# 生成 lock 文件
yarn

# 从 lock 文件安装
yarn --frozen-lockfile  # 严格模式
```

## 私有 npm 仓库

### 1. 使用 Verdaccio 搭建私有仓库

```bash
# 全局安装
npm install -g verdaccio

# 启动
verdaccio

# 配置
# 编辑 ~/.config/verdaccio/config.yml
```

### 2. 企业级方案

- **Nexus Repository**: 支持多种仓库类型
- **Artifactory**: 功能强大的企业级仓库
- **GitHub Packages**: GitHub 官方私有包

## 加速 npm 安装

### 1. 使用 cnpm 镜像

```bash
npm install -g cnpm --registry=https://registry.npmmirror.com
```

### 2. 配置 npm 镜像

```bash
# 永久配置
npm config set registry https://registry.npmmirror.com

# 查看配置
npm config get registry
```

### 3. 使用 pnpm

```bash
# 安装 pnpm
npm install -g pnpm

# 使用 pnpm
pnpm install
pnpm add package
```

pnpm 优势：
- 磁盘空间利用率高（硬链接）
- 安装速度快
- 更严格的依赖管理

## 最佳实践

### 1. 项目初始化

```bash
# 创建项目
mkdir my-project && cd my-project
npm init -y

# 或使用脚手架
npm create vite@latest my-app -- --template vue
npm create react-app my-app
yarn create vite my-app --template vue
```

### 2. 版本控制

```bash
# 添加 .gitignore
node_modules/
dist/
.DS_Store
*.log
.env.local
```

### 3. 锁定 PHP/Ruby 版本（项目级）

```json
{
  "engines": {
    "node": ">=16.0.0"
  },
  "volta": {
    "node": "16.20.0"
  }
}
```

## 常见问题解决

### 1. 删除 node_modules

```bash
# Windows
rmdir /s /node_modules

# macOS/Linux
rm -rf node_modules

# 使用 rimraf
npx rimraf node_modules
```

### 2. 解决依赖冲突

```bash
# 查看依赖树
npm ls
yarn list

# 使用 npm-check-updates 检查更新
npx npm-check-updates -u
```

### 3. 清理 npm 缓存

```bash
npm cache clean --force
yarn cache clean
```

## CI/CD 中的使用

### GitHub Actions

```yaml
- name: Install dependencies
  run: npm ci

# 或
- name: Install dependencies
  run: yarn install --frozen-lockfile
```

## 总结

| 场景 | 推荐 |
|------|------|
| 个人项目 | npm/pnpm |
| 企业项目 | yarn + 私有仓库 |
| monorepo | yarn workspaces / pnpm |
| CI/CD | npm ci / yarn --frozen-lockfile |