---
title: "Git SSH 免密登录配置指南"
description: "详细讲解如何配置 SSH 密钥实现 Git 免密登录，包括多种解决方案和最佳实践"
pubDate: "2018-01-13T16:07:32"
tags: ["Git", "SSH", "GitHub", "GitLab"]
---

# Git SSH 免密登录配置指南

使用 Git 时每次都输入密码非常麻烦，本文提供多种解决方案实现 SSH 免密登录。

## 方案一：重新生成无密码 SSH 密钥（推荐）

### 1. 备份现有密钥

```bash
# 备份现有密钥
mkdir ~/.ssh/backup
cp ~/.ssh/id_rsa* ~/.ssh/backup/
```

### 2. 生成新密钥

```bash
# 进入 SSH 目录
cd ~/.ssh

# 生成 Ed25519 密钥（推荐，更安全）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 或生成 RSA 密钥
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

### 3. 关键步骤：设置空密码

```
Generating public/private ed25519 key pair.
Enter file in which to save the key (/Users/username/.ssh/id_ed25519): # 直接回车
Enter passphrase (empty for no passphrase): # **直接回车，不要输入密码**
Enter same passphrase again: # **直接回车**

Your identification has been saved in /Users/username/.ssh/id_ed25519
Your public key has been saved in /Users/username/.ssh/id_ed25519.pub
```

### 4. 添加到 SSH Agent

```bash
# 启动 SSH Agent
eval "$(ssh-agent -s)"

# 添加私钥
ssh-add ~/.ssh/id_ed25519
```

### 5. 添加公钥到 GitHub

```bash
# 复制公钥
cat ~/.ssh/id_ed25519.pub
# 或
pbcopy < ~/.ssh/id_ed25519.pub
```

然后在 GitHub 中：
- Settings → SSH and GPG keys → New SSH key
- 粘贴公钥，命名并保存

## 方案二：修改现有密钥密码

### 方法1：使用 ssh-keygen -p

```bash
ssh-keygen -p

# 交互过程：
# Enter file in which the key is (/Users/you/.ssh/id_rsa): # 直接回车
# Enter old passphrase: # 输入当前密码
# Key has comment 'your_email@example.com'
# Enter new passphrase (empty for no passphrase): # 直接回车
# Enter same passphrase again: # 直接回车
```

### 方法2：移除密码

```bash
# 复制密钥
cp ~/.ssh/id_rsa ~/.ssh/id_rsa_old

# 移除密码
openssl rsa -in ~/.ssh/id_rsa_old -out ~/.ssh/id_rsa

# 设置正确权限
chmod 600 ~/.ssh/id_rsa
```

## 方案三：使用 SSH Config 持久化配置

### 1. 编辑 SSH 配置

```bash
vim ~/.ssh/config
```

### 2. 添加配置

```bash
# GitHub
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    AddKeysToAgent yes

# GitLab
Host gitlab.com
    HostName gitlab.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    AddKeysToAgent yes

# 公司 GitLab
Host gitlab.company.com
    HostName gitlab.company.com
    User git
    IdentityFile ~/.ssh/id_ed25519_company
    AddKeysToAgent yes
```

### 3. 修改 Git 远程 URL

```bash
# 查看当前远程
git remote -v

# 修改为 SSH 方式
git remote set-url origin git@github.com:username/repo.git
```

## 方案四：使用 HTTPS + 凭证存储

如果不想使用 SSH，可以配置凭证存储：

### macOS 钥匙串

```bash
# 启用凭证存储
git config --global credential.helper osxkeychain

# 首次输入后，密码会存储在 macOS 钥匙串中
```

### Windows 凭证管理器

```bash
git config --global credential.helper manager
```

### Linux

```bash
# 使用 cache 模式（15分钟有效）
git config --global credential.helper cache

# 或者使用 store 模式（长期存储）
git config --global credential.helper store
```

## 验证配置

```bash
# 测试 SSH 连接
ssh -T git@github.com
# 成功会返回：Hi username! You've successfully authenticated...

ssh -T git@gitlab.com
# 成功会返回：Welcome to GitLab, @username!
```

## 常见问题

### 1. 仍然提示输入密码

```bash
# 检查远程 URL 类型
git remote -v

# 如果是 HTTPS，改为 SSH
git remote set-url origin git@github.com:username/repository.git
```

### 2. 权限问题

```bash
# 修正权限
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

### 3. SSH 不工作

```bash
# 调试模式
ssh -vT git@github.com

# 检查密钥是否加载
ssh-add -l
```

## 总结

| 方案 | 优点 | 缺点 |
|------|------|------|
| Ed25519 密钥 | 安全、现代 | 需要重新配置 |
| SSH Config | 一劳永逸 | 需要配置多个 Host |
| HTTPS + 凭证 | 无需配置 | 需要每次输入一次 |
| 修改现有密钥 | 保留历史密钥 | 需要处理现有配置 |

**推荐**：使用方案一（Ed25519 密钥）+ 方案三（SSH Config），既安全又方便。