---
title: "用 OpenClaw 调用 Codex CLI 写代码：多 Agent 协作实践"
description: "如何使用 OpenClaw 指挥 Codex CLI 完成长时间编码任务，实现多 Agent 协作开发工作流。"
pubDate: "2026-03-02"
tags: ["OpenClaw", "Codex", "AI", "开发工具", "自动化"]
excerpt: "探索如何用 OpenClaw 调用 Codex CLI 进行长时间编码任务，通过 tmux 实现进程隔离，让 AI Agent 自主完成代码编写、Review 和测试。"
heroImage: "/placeholder-hero.jpg"
---

# 用 OpenClaw 调用 Codex CLI 写代码：多 Agent 协作实践

现在的 Coding Agent 可以工作几个小时，但按照 OpenClaw 的设计，如果调用一个应用程序很久没反应，就会超时并杀死进程。那么，如何让 OpenClaw 控制 Codex CLI 完成高强度、长时间的代码任务呢？

答案有两个要点：**说人话** 和 **使用 tmux**。

## 环境准备

### 1. 安装 Codex CLI

```bash
npm install -g @openai/codex
```

确认安装：
```bash
codex --version
```

### 2. 安装 tmux

tmux 是一个终端复用器，可以理解为一个"不会关的虚拟终端房间"。即使 OpenClaw 的 Gateway 重启、exec session 回收，tmux 里的进程都不受影响。

```bash
# macOS
brew install tmux

# 验证安装
tmux -V
```

### 3. GitHub 认证

Codex 需要访问 GitHub 仓库，先完成认证：

```bash
gh auth login
```

按提示选择：
- Where do you use GitHub? → **GitHub.com**
- Preferred protocol? → **HTTPS**
- Authenticate Git? → **Yes**
- How to authenticate? → **Login with a web browser**

复制设备码，打开 https://github.com/login/device 完成授权。

验证：
```bash
gh auth status
```

## 使用方法

### 核心思路

**你怎么安排人类员工干活，就怎么安排 OpenClaw 干活。**

不要问"怎么编排流程"，而是直接告诉它要做什么。

### 首次启用指令

```
我即将给你布置一个需要长时间完成的编程任务。
我的系统中已经安装了 Codex CLI，我已经购买了官方包月会员，你不需要配置 API。
请你使用 tmux 打开 Codex CLI 完成写代码的任务，使用 Codex CLI 里最强的模型、最大的推理力度。在 Codex CLI 里，授予 Full Access 权限。
你还需要做一个日志监控，每 10 分钟给我汇报 Codex CLI 的工作进度。这个任务将会执行特别长的时间，如果期间 Codex CLI 进程死了，你需要重新喊它起来。
写完代码后，你还需要进行 Review，如果发现了代码问题，把你意见发给 Codex CLI 和它讨论，直到你俩达成一致。
```

### 后续简化指令

配置好后，以后只需要说：

```
用 tmux 里的 Codex 写代码
```

### 手动启动 Codex（tmux 模式）

```bash
# 创建 tmux 会话
tmux new-session -d -s codex-dev -c ~/your/project

# 启动 Codex（使用最强模型 + 全自动模式）
tmux send-keys -t codex-dev "codex --model gpt-5.3-codex --full-auto" Enter

#  Attach 到会话
tmux attach-session -t codex-dev

# 查看进度（不 attach）
tmux capture-pane -t codex-dev -p
```

## 实际案例：多 Agent 协作

### 三位大哥分工

可以参考刘小排的架构：

| Agent | 模型 | 职责 |
|-------|------|------|
| **Claude Code** | Opus 4.6 | 写开发计划、写逻辑代码 |
| **Codex CLI** | GPT-5.3-Codex | 审核代码、做单元测试 |
| **Gemini CLI** | Gemini-3.1-Pro | 设计界面、前端代码、browser-use 测试 |

### 协作流程

1. **Claude Code** 先写开发计划和核心逻辑
2. **Codex CLI** Review 代码，提出改进建议
3. 两者讨论达成一致（有时 Codex 能说服 Claude）
4. **Gemini CLI** 设计 UI 并做端到端测试
5. 所有 Agent 确认后提交 PR

### 真实案例

最近开源的项目收到一个 issue 要求增加新功能：

```
用 tmux 里的 Codex 最强模型搞定这个 issue
```

Codex 完成后，OpenClaw（Opus 4.6）进行 Review：
- 第一个建议：Codex 采纳，立即修改
- 第二个建议：Codex 不采纳，但给出了合理理由，两者达成一致

最终新功能上线。查看完整记录：
- Issue 讨论：https://github.com/liuxiaopai-ai/raphael-publish/issues/1
- PR 代码：https://github.com/liuxiaopai-ai/raphael-publish/pull/2

## 总结

**别再问"怎么编排"了，说人话就行。**

tmux 解决了长时间运行的问题，OpenClaw 的对话式交互让你像管理人类员工一样管理 AI Agent。

关键要点：
1. **说人话** — 像安排人类员工一样安排 AI
2. **用 tmux** — 隔离进程生命周期，避免超时被杀
3. **多 Agent 协作** — 让不同 Agent 发挥各自优势

现在，去试试让你的 OpenClaw 指挥 Codex 干活吧！
