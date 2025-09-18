# GitHub Actions 自动部署配置指南

## 概述

本指南将帮助您配置 GitHub Actions 自动部署到 Cloudflare Pages。当您推送代码到 main 分支时，GitHub Actions 会自动构建并部署您的 Astro 博客。

## 前置条件

1. GitHub 仓库已创建
2. Cloudflare 账户已注册
3. 项目已推送到 GitHub

## 步骤 1: 获取 Cloudflare API Token

### 1.1 创建 API Token

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. 点击 "Create Token"
3. 选择 "Custom token" 模板
4. 配置权限：
   - **Account**: `Cloudflare Pages:Edit`
   - **Zone**: `Zone:Read` (如果需要自定义域名)
5. 配置资源：
   - **Account Resources**: `Include - All accounts`
   - **Zone Resources**: `Include - All zones` (如果需要自定义域名)
6. 点击 "Continue to summary" 然后 "Create Token"
7. **重要**: 复制并保存生成的 API Token

### 1.2 获取 Account ID

1. 在 Cloudflare Dashboard 右侧边栏找到 "Account ID"
2. 复制 Account ID

## 步骤 2: 配置 GitHub Secrets

### 2.1 添加 Secrets

1. 进入您的 GitHub 仓库
2. 点击 "Settings" 标签
3. 在左侧菜单中找到 "Secrets and variables" > "Actions"
4. 点击 "New repository secret"

### 2.2 添加以下 Secrets

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `CLOUDFLARE_API_TOKEN` | 您的 API Token | 从步骤 1.1 获取 |
| `CLOUDFLARE_ACCOUNT_ID` | 您的 Account ID | 从步骤 1.2 获取 |

### 2.3 添加步骤

1. 点击 "New repository secret"
2. 输入 Name: `CLOUDFLARE_API_TOKEN`
3. 输入 Secret: 您的 API Token
4. 点击 "Add secret"
5. 重复上述步骤添加 `CLOUDFLARE_ACCOUNT_ID`

## 步骤 3: 创建 Cloudflare Pages 项目

### 3.1 手动创建项目（推荐）

1. 访问 [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. 点击 "Create a project"
3. 选择 "Connect to Git"
4. 选择您的 GitHub 仓库
5. 配置项目设置：
   - **Project name**: `blue-binary` (或您喜欢的名称)
   - **Production branch**: `main`
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. 点击 "Save and Deploy"

### 3.2 环境变量配置（可选）

如果您的项目需要环境变量（如 Resend API Key）：

1. 在 Cloudflare Pages 项目设置中
2. 进入 "Settings" > "Environment variables"
3. 添加变量：
   - **Variable name**: `RESEND_API_KEY`
   - **Value**: 您的 Resend API Key
   - **Environment**: `Production` (或根据需要选择)

## 步骤 4: 测试部署

### 4.1 推送代码

```bash
git add .
git commit -m "Add GitHub Actions deployment"
git push origin main
```

### 4.2 检查部署状态

1. 在 GitHub 仓库中点击 "Actions" 标签
2. 查看 "Deploy to Cloudflare Pages" 工作流
3. 点击最新的运行记录查看详细日志

### 4.3 验证部署

1. 访问您的 Cloudflare Pages 项目
2. 检查部署状态是否为 "Success"
3. 点击预览链接验证网站是否正常工作

## 工作流说明

### 触发条件

- 推送到 `main` 或 `master` 分支
- 创建 Pull Request 到 `main` 或 `master` 分支

### 工作流步骤

1. **Checkout**: 检出代码
2. **Setup Node.js**: 设置 Node.js 18 环境
3. **Install dependencies**: 安装项目依赖
4. **Build project**: 构建 Astro 项目
5. **Deploy**: 部署到 Cloudflare Pages

## 故障排除

### 常见问题

1. **API Token 权限不足**
   - 确保 Token 有 `Cloudflare Pages:Edit` 权限
   - 检查 Account ID 是否正确

2. **项目名称不匹配**
   - 确保 GitHub Actions 中的 `projectName` 与 Cloudflare Pages 项目名称一致
   - 默认项目名称为 `blue-binary`

3. **构建失败**
   - 检查 `package.json` 中的构建脚本
   - 确保所有依赖都已正确安装

4. **环境变量问题**
   - 在 Cloudflare Pages 项目设置中配置环境变量
   - 确保变量名称和值正确

### 调试步骤

1. 查看 GitHub Actions 日志
2. 检查 Cloudflare Pages 部署日志
3. 验证本地构建是否成功：
   ```bash
   npm run build
   npm run preview
   ```

## 自定义配置

### 修改项目名称

如果您想使用不同的项目名称：

1. 修改 `.github/workflows/deploy.yml` 中的 `projectName`
2. 在 Cloudflare Pages 中创建对应名称的项目

### 添加更多环境变量

在 Cloudflare Pages 项目设置中添加环境变量，然后在代码中使用：

```typescript
const apiKey = import.meta.env.RESEND_API_KEY;
```

### 自定义构建命令

如果需要自定义构建过程，可以修改工作流中的构建步骤：

```yaml
- name: Build project
  run: |
    npm ci
    npm run build
    # 添加其他构建步骤
```

## 安全注意事项

1. **不要将 API Token 提交到代码仓库**
2. **定期轮换 API Token**
3. **使用最小权限原则配置 Token 权限**
4. **监控部署日志，及时发现异常**

## 下一步

配置完成后，您的博客将实现：
- ✅ 自动部署到 Cloudflare Pages
- ✅ 全球 CDN 加速
- ✅ 自动 HTTPS 证书
- ✅ 自定义域名支持
- ✅ 环境变量管理
