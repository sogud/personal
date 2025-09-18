# 部署指南

## Cloudflare Pages 部署

您的项目是一个静态 Astro 站点，应该使用 Cloudflare Pages 进行部署，而不是 Cloudflare Workers。

### 方法一：通过 Cloudflare Pages 控制台部署

1. **登录 Cloudflare 控制台**
   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 选择 "Pages" 服务

2. **连接 GitHub 仓库**
   - 点击 "Create a project"
   - 选择 "Connect to Git"
   - 授权并选择您的 GitHub 仓库

3. **配置构建设置**
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (项目根目录)

4. **环境变量配置**（如果需要）
   - 在 "Settings" > "Environment variables" 中添加：
     - `RESEND_API_KEY`: 您的 Resend API 密钥

5. **部署**
   - 点击 "Save and Deploy"
   - 等待构建完成

### 方法二：使用 Wrangler CLI 部署

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   npx wrangler login
   ```

3. **构建项目**
   ```bash
   npm run build
   ```

4. **部署到 Cloudflare Pages**
   ```bash
   npm run deploy
   ```

### 方法三：GitHub Actions 自动部署

GitHub Actions 配置文件已创建在 `.github/workflows/deploy.yml`。

**详细配置说明请参考：[GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)**

#### 快速配置步骤：

1. **获取 Cloudflare API Token**
   - 访问 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - 创建自定义 Token，权限：`Cloudflare Pages:Edit`

2. **配置 GitHub Secrets**
   - 进入仓库 Settings > Secrets and variables > Actions
   - 添加 `CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID`

3. **创建 Cloudflare Pages 项目**
   - 项目名称：`blue-binary`
   - 构建命令：`npm run build`
   - 输出目录：`dist`

4. **推送代码触发部署**
   ```bash
   git add .
   git commit -m "Add GitHub Actions deployment"
   git push origin main
   ```

## 故障排除

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本（推荐 18+）
   - 确保所有依赖都已安装
   - 检查 `astro.config.mjs` 配置

2. **部署失败**
   - 确保使用 `wrangler pages deploy` 而不是 `wrangler deploy`
   - 检查 `dist` 目录是否存在
   - 验证 Cloudflare 账户权限

3. **环境变量问题**
   - 确保在 Cloudflare Pages 控制台中正确配置环境变量
   - 检查变量名称和值是否正确

### 调试命令

```bash
# 本地构建测试
npm run build
npm run preview

# 检查构建输出
ls -la dist/

# 验证 Wrangler 配置
npx wrangler pages project list
```

## 自定义域名

1. 在 Cloudflare Pages 项目设置中添加自定义域名
2. 配置 DNS 记录指向 Cloudflare
3. 启用 SSL/TLS 加密

## 性能优化

- 启用 Cloudflare 的 CDN 和缓存
- 配置适当的缓存规则
- 使用 Cloudflare 的图片优化功能
