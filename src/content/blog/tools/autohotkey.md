---
title: "AutoHotkey 让 Windows 快捷键与 Mac 一致"
description: "使用 AutoHotkey 将 Windows 快捷键映射为 Mac 风格，大幅提升双系统用户的工作效率"
pubDate: "2018-01-13T16:07:32"
tags: ["AutoHotkey", "Windows", "Mac", "快捷键"]
---

# AutoHotkey 让 Windows 快捷键与 Mac 一致

经常在 Windows 和 macOS 之间切换的用户经常会因为快捷键不同而烦恼。本文介绍如何使用 AutoHotkey 实现快捷键同步。

## AutoHotkey 简介

AutoHotkey 是一款 Windows 自动化脚本工具，可以通过自定义快捷键触发一系列动作。

## 快捷键修饰符

| 符号 | 含义 |
|------|------|
| `!` | Alt |
| `^` | Ctrl |
| `+` | Shift |
| `#` | Win |

## Mac 风格快捷键脚本

### 保存为 .ahk 文件

将以下内容保存为 `MacKeymap.ahk`：

```autohotkey
;=========================================
; Mac 键盘快捷键映射
;=========================================

; 开启键盘钩子
#InstallKeybdHook

; 标题匹配模式
SetTitleMatchMode 2

; 发送模式
SendMode Input

;---------- 功能键 ----------

; 保存 (Cmd+S -> Ctrl+S)
!s::SendInput ^{s}

; 全选 (Cmd+A -> Ctrl+A)
!a::SendInput ^{a}

; 复制 (Cmd+C -> Ctrl+C)
!c::SendInput ^{c}

; 粘贴 (Cmd+V -> Ctrl+V)
!v::SendInput ^{v}

; 剪切 (Cmd+X -> Ctrl+X)
!x::SendInput ^{x}

; 打开 (Cmd+O -> Ctrl+O)
!o::SendInput ^{o}

; 查找 (Cmd+F -> Ctrl+F)
!f::SendInput ^{f}

; 撤销 (Cmd+Z -> Ctrl+Z)
!z::SendInput ^{z}

; 重做 (Cmd+Shift+Z -> Ctrl+Y)
!y::SendInput ^{y}

; 新建标签 (Cmd+T -> Ctrl+T)
!t::SendInput ^{t}

; 关闭标签 (Cmd+W -> Ctrl+W)
!w::SendInput ^{w}

; 新建窗口 (Cmd+N -> Ctrl+N)
!n::SendInput ^{n}

; 刷新 (Cmd+R -> Ctrl+R)
!r::SendInput ^{r}

; 关闭页面 (Cmd+Q -> Alt+F4)
!q::SendInput !{F4}

;---------- 浏览器快捷键 ----------

; 后退 (Cmd+[ -> Alt+Left)
!+[::SendInput !{Left}

; 前进 (Cmd+] -> Alt+Right)
!+]::SendInput !{Right}

; 打开新标签 (Cmd+T -> Ctrl+T)
!t::SendInput ^{t}

; 关闭标签 (Cmd+W -> Ctrl+W)
!w::SendInput ^{w}

; 重新打开关闭的标签 (Cmd+Shift+T -> Ctrl+Shift+T)
!+t::SendInput ^+{t}
```

## 常用增强功能

### 1. 快速搜索

```autohotkey
; 在任意位置按 Win+Space 快速搜索
#Space::
Run, https://www.google.com/search?q=
return
```

### 2. 窗口管理

```autohotkey
; 最大化窗口
#Up::WinMaximize, A

; 最小化窗口
#Down::WinMinimize, A

; 左半屏
#Left::WinMove, A, , 0, 0, A_ScreenWidth/2, A_ScreenHeight

; 右半屏
#Right::WinMove, A, , A_ScreenWidth/2, 0, A_ScreenWidth/2, A_ScreenHeight
```

### 3. 快速启动程序

```autohotkey
; Win+C 打开计算器
#c::Run calc.exe

; Win+E 打开文件资源管理器
#e::Run explorer.exe

; Win+T 打开终端
#t::Run, wt.exe
```

### 4. 文本替换

```autohotkey
; 快速输入邮箱
::@email::yourname@example.com

; 快速输入日期
::/date::
FormatTime, OutputVar, , yyyy-MM-dd
SendInput %OutputVar%
return
```

## 开机自启动

### 方法1：放入启动文件夹

```
C:\Users\你的用户名\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
```

### 方法2：注册表方式

```batch
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v AutoHotkey /t REG_SZ /d "C:\path\to\script.ahk"
```

## 常见问题

### 1. 脚本不生效

- 右键任务栏图标，选择 "Reload Script"
- 或重启 AutoHotkey

### 2. 快捷键冲突

- 避免与常用软件快捷键冲突
- 使用更少见的组合

### 3. 多个脚本

建议合并到一个脚本文件中，或使用 `#Include` 包含多个文件

## 完整版脚本推荐

更多功能可以参考开源项目：
- [MacKeyRemap](https://github.com/stroebjo/autohotkey-macos-scripts)
- [Windows-to-Mac-Keybind](https://github.com/icemountain/Windows-to-Mac-Keybind)

## 总结

AutoHotkey 可以大幅提升跨平台工作效率：
- **Alt+字母** 替代 Cmd+字母
- **保持原有功能** 不影响 Alt 键原本功能
- **完全可定制** 根据自己需求修改