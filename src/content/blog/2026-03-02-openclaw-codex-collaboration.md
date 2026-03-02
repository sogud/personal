---
title: "用 OpenClaw 调用 Codex CLI 写代码"
description: "一套可落地的协作流程：先完成 Codex CLI、tmux、gh 的基础配置，再让 OpenClaw 像技术负责人一样调度长任务与多智能体协作。"
pubDate: "2026-03-02"
tags: ["OpenClaw", "Codex CLI", "tmux", "GitHub CLI", "多智能体协作"]
excerpt: "本文给出一个实用工作流：用 tmux 托管长任务，用自然语言给 OpenClaw 下达目标，再让 Claude Code、Codex、Gemini 分工协作完成编码与验收。"
heroImage: "/placeholder-hero.jpg"
---

在我自己的日常开发里，OpenClaw 最有价值的地方不是“替你打命令”，而是“替你调度流程”。

当任务变长、上下文变复杂、需要多个智能体配合时，单次对话很容易断掉；但如果把 Codex CLI 放进可持续运行的终端环境，再让 OpenClaw 负责协调，就能把一次性问答变成稳定的工程流水线。

## 1. Setup：先把基础环境搭起来

这一部分只做三件事：`Codex CLI`、`tmux`、`gh auth login`。

### 安装并检查 Codex CLI

```bash
npm install -g @openai/codex
codex --version
```

`codex --version` 能正常输出版本号，说明 CLI 已可用。

### 安装并检查 tmux

```bash
# macOS
brew install tmux

# Ubuntu / Debian
sudo apt-get update && sudo apt-get install -y tmux

# 检查版本
tmux -V
```

为什么必须要有 `tmux`：

- 长任务执行时，终端断开、SSH 断线、会话刷新都很常见。
- 进程跑在 `tmux` 会话里，即使你临时离开，任务也不会丢。

### 登录 GitHub CLI（gh auth login）

```bash
gh auth login
gh auth status
```

建议完成一次 `gh auth status` 自检，确认仓库读写权限与账号状态正常。后续让 Codex 跑代码修改、PR 相关操作会更稳定。

## 2. Usage：用 tmux 扛长任务，用“人话”指挥 OpenClaw

### 把 Codex 放进专用 tmux 会话

```bash
# 在项目目录创建会话（后台运行）
tmux new-session -d -s codex-dev -c ~/code/my-project

# 在会话里启动 Codex CLI
tmux send-keys -t codex-dev "codex" Enter

# 需要时再附着查看
tmux attach -t codex-dev
```

不进入会话也能看最近输出：

```bash
tmux capture-pane -t codex-dev -p | tail -n 80
```

这个模式适合任何“10 分钟以上”的任务：重构、批量修复、测试回归、跨文件迁移。

### 和 OpenClaw 说话，尽量像和同事说话

不要把提示词写成僵硬的脚本；直接说清楚目标、边界、汇报频率。

示例：

```text
这是一个长任务，请你用 tmux 中的 Codex CLI 执行。
目标：完成模块重构并补齐测试。
约束：不要改公开 API；每 10 分钟同步一次进度。
异常处理：如果 Codex 进程退出，自动拉起并继续。
完成后：做一次自查，汇总风险点和剩余事项。
```

这种“人话调度”通常比硬编码步骤更稳，因为 OpenClaw 可以根据上下文动态调整执行策略。

## 3. 多智能体协作：Claude Code + Codex + Gemini

一个实用分工如下：

- `Claude Code`：方案拆解、核心实现、复杂逻辑落地
- `Codex CLI`：代码审查、重构建议、测试补强
- `Gemini`：UI/交互验收、浏览器流程检查、体验回归

### 推荐协作回路

1. Claude Code 先给出实现草案并提交首轮改动。
2. Codex 对 diff 做二轮审查，补风险修复与测试。
3. Claude 与 Codex 对冲突意见进行收敛，统一实现口径。
4. Gemini 做端到端体验检查，验证关键交互路径。
5. OpenClaw 汇总结果，输出最终交付清单（已完成/待处理/风险）。

关键点只有一句话：不要让三个智能体做同一件事，而是让它们做“互补”的事。

## 结语

如果你已经在用 OpenClaw，那么把 Codex CLI、tmux、gh 这三件基础设施打通后，就能很自然地把一次“聊天式编程”升级成“可持续执行的工程协作”。

先保证任务不断线，再优化协作分工，效率会比单代理硬跑高很多。
