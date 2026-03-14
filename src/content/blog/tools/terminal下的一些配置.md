---
title: "Mac Terminal 完全配置指南"
description: "深入讲解 Mac 终端配置、Git 使用、SSH 密钥管理、VS Code 集成以及效率提升技巧"
pubDate: "2018-01-13T16:07:32"
tags: ["Mac", "Terminal", "Git", "SSH", "效率"]
---

# Mac Terminal 完全配置指南

本文详细介绍 Mac 终端的高效配置方法，帮助开发者提升工作效率。

## 1. 修改 hosts 文件

```bash
# 使用 vim 编辑
sudo vim /private/etc/hosts

# 输入密码后进入 vim
# 按 i 进入编辑模式
# 修改完成后按 Esc 退出编辑模式
# 输入 :wq 保存并退出

# 常用 hosts 配置示例
# 127.0.0.1 localhost
# 255.255.255.255 broadcasthost
# ::1             localhost
```

## 2. Homebrew 使用指南

### 安装 Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 常用命令

```bash
# 安装软件
brew install node
brew install git
brew install python@3.11

# 卸载软件
brew uninstall node

# 查看已安装
brew list
brew list node    # 查看特定软件安装位置

# 搜索软件
brew search python

# 更新软件
brew update       # 更新 brew 本身
brew upgrade      # 更新所有软件
brew upgrade node # 更新指定软件

# 清理缓存
brew cleanup
```

## 3. Git 配置

### 初始配置

```bash
# 设置用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 查看配置
git config --list
git config user.name
git config user.email
```

### 常用 Git 配置

```bash
# 设置默认分支名
git config --global init.defaultBranch main

# 设置拉取策略
git config --global pull.rebase false

# 设置合并策略
git config --global merge.tool vimdiff

# 启用颜色输出
git config --global color.ui auto

# 设置别名
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.last 'log -1 HEAD'

# 设置拉取代码简化
git config --global fetch.prune true
```

### .gitignore 全局配置

```bash
# 创建全局 gitignore
git config --global core.excludesFile ~/.gitignore_global

# ~/.gitignore_global 内容
.DS_Store
node_modules/
dist/
build/
*.log
.env
.env.local
.vscode/
.idea/
*.swp
*.swo
```

## 4. SSH 密钥配置

### 生成 SSH 密钥

```bash
# 进入 SSH 目录
cd ~/.ssh

# 生成密钥（推荐使用 Ed25519）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 或者使用 RSA（较旧但兼容性好）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

### 添加到 SSH Agent

```bash
# 启动 SSH Agent
eval "$(ssh-agent -s)"

# 添加私钥
ssh-add ~/.ssh/id_ed25519
```

### 添加到 GitHub/GitLab

```bash
# 复制公钥
cat ~/.ssh/id_ed25519.pub
# 或
pbcopy < ~/.ssh/id_ed25519.pub

# 在 GitHub 设置中添加公钥
# Settings -> SSH and GPG keys -> New SSH key
```

### SSH 配置文件

```bash
# ~/.ssh/config
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    AddKeysToAgent yes

Host gitlab.com
    HostName gitlab.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    AddKeysToAgent yes

# 公司 GitLab
Host gitlab.company.com
    HostName gitlab.company.com
    User git
    IdentityFile ~/.ssh/id_rsa_company
    AddKeysToAgent yes
```

## 5. VS Code 终端集成

### 启动 VS Code

```bash
# 在当前目录打开
code .

# 指定文件
code filename.js

# 新窗口打开
code -n .

# 差异比较
code -d file1.js file2.js
```

### 安装 code 命令

```bash
# 打开 Command Palette (Cmd+Shift+P)
# 输入 "Shell Command: Install 'code' command in PATH"
```

## 6. iTerm2 配置

### 安装 iTerm2

```bash
brew install --cask iterm2
```

### 常用快捷键

- `Cmd + T`: 新建标签
- `Cmd + W`: 关闭标签
- `Cmd + 数字`: 切换标签
- `Cmd + D`: 垂直分屏
- `Cmd + Shift + D`: 水平分屏
- `Cmd + ;`: 自动补全历史
- `Cmd + Shift + E`: 查看目录历史
- `Ctrl + R`: 历史命令搜索

### 主题配置

```bash
# 安装 Oh My Zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# 安装 Powerlevel10k 主题
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

# 编辑 ~/.zshrc
ZSH_THEME="powerlevel10k/powerlevel10k"
```

## 7. 环境变量配置

### PATH 变量

```bash
# 查看 PATH
echo $PATH

# 临时添加（当前会话有效）
export PATH=$PATH:/usr/local/mysql/bin

# 永久添加（添加到 ~/.zshrc）
echo 'export PATH=$PATH:/usr/local/mysql/bin' >> ~/.zshrc
source ~/.zshrc
```

### alias 配置

```bash
# ~/.zshrc 中添加
alias ll='ls -la'
alias la='ls -a'
alias l='ls -lah'
alias gs='git status'
alias ga='git add .'
alias gc='git commit -m'
alias gp='git push'
alias gl='git pull'
alias gco='git checkout'
alias gb='git branch'
alias gst='git stash'
alias gsp='git stash pop'

# 带参数的别名
alias npmd='npm run dev'
alias npmb='npm run build'
```

## 8. 全局 npm 包管理

```bash
# 查看全局安装的包
npm list -g --depth 0

# 全局安装包
npm install -g yarn
npm install -g pnpm
npm install -g typescript
npm install -g prettier

# 卸载全局包
npm uninstall -g yarn

# 查看全局包位置
npm root -g
```

## 9. 效率提升技巧

### 历史命令搜索

```bash
# 快速搜索历史命令
Ctrl + R

# 继续搜索
Ctrl + R (多次)

# 执行历史命令
# 搜索到后按 Enter
```

### 目录跳转

```bash
# 安装 zoxide（比 cd 更智能）
brew install zoxide

# 在 ~/.zshrc 中添加
eval "$(zoxide init zsh)"

# 使用
z project   # 跳转到常用目录
```

### 命令行工具

```bash
# 安装 fzf（模糊搜索）
brew install fzf

# 安装 fd（更快的 find）
brew install fd

# 安装 rg（更快的 grep）
brew install ripgrep

# 安装 exa（更好的 ls）
brew install exa

# 使用 exa
alias ls='exa --icons'
alias ll='exa -l --icons --git'
```

## 10. 终端美化

```bash
# 安装 Starship 提示符
brew install starship

# 在 ~/.zshrc 中添加
eval "$(starship init zsh)"
```

## 总结

高效的开发环境能显著提升工作效率：
- **iTerm2 + Oh My Zsh**: 强大的终端体验
- **SSH 密钥**: 安全便捷的认证方式
- **VS Code 集成**: 编辑器与终端无缝衔接
- **别名和快捷键**: 减少重复操作