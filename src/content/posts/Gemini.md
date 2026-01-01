---
title: GeminiCLI:Google 开源的命令行神器
published: 2025-08-31
description: 'GeminiCLI教程'
tags: [Gemini,教程]
category: '教程'
draft: false
lang: ''
---
最近这两天刷技术圈，发现大佬们都在推一个新玩意儿 —— **Gemini CLI**。
简单说，它就是 Google 官方推出的一个 **基于 Gemini 2.5 Pro 模型** 的开源命令行工具，体验上和 Claude Code CLI 很像，但重点是：**它开源 + 免费额度史上最豪横**（？

GitHub 地址在这 👉 [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)
（截至 2025-06-25 晚）数据如下：

* ⭐ 25.1K
* Issue：377
* Fork：1.7K
* PR：77
  活跃度直接拉满，许可证是 **Apache 2.0**，放心用。

---

## 为啥这两天都在疯狂安利 Gemini CLI？

核心原因两个：

1. **背靠大哥 Gemini 2.5 Pro**
   支持 **100 万 Token 的上下文窗口**，而且是多模态。
   这意味着啥？简单点说，你丢一个完整的大型代码库、文档、项目文件树进去，它都能分析。复杂点说，你可以直接让它帮你做大规模代码迁移、文档转换，甚至玩点多步骤链式推理（Chain-of-Thought）也没问题。

2. **史上最慷慨免费额度**

   * 个人用户用 Google 账号一登：

     * 每分钟 60 次请求
     * 每天 1000 次请求
     * 100 万 Token 窗口
       （免费还送这么多额度，Claude 用户看了流泪，OpenAI 用户看了沉默（笑

更多花里胡哨的功能介绍，各大公众号都写烂了，这里不展开，直接放官方博客：[Introducing Gemini CLI](https://blog.google/technology/developers/introducing-gemini-cli-open-source-ai-agent)

---

## 上车准备：Node.js & npm 安装

Gemini CLI 是用 TypeScript 写的，需要 Node.js 环境（>= v18）。
先搞定 Node.js + npm，不然 gemini 命令敲不出来。

### Node.js 简介

* Node.js：一个跑在服务端的 JavaScript 运行环境（Chrome V8 引擎做底子）
* npm：Node 的包管理器，用来装各种依赖（理解成 Node 的“应用商店”就行）

中文官网 👉 [https://nodejs.org/zh-cn](https://nodejs.org/zh-cn)

---

### 安装 Node.js & npm

两种方式：

#### 方式 1：apt-get 安装（Debian/Ubuntu 用户）

```bash
sudo apt-get update
sudo apt-get install nodejs npm -y
```

#### 方式 2：手动安装

```bash
wget https://nodejs.org/dist/v18.12.1/node-v18.12.1-linux-x64.tar.xz
tar xvf node-v18.12.1-linux-x64.tar.xz
sudo mkdir -p /usr/local/node
sudo mv node-v18.12.1-linux-x64/* /usr/local/node

# 建立软链接
sudo ln -s /usr/local/node/bin/node /usr/bin/node
sudo ln -s /usr/local/node/bin/npm /usr/bin/npm
```

安装完成后检查版本：

```bash
node -v
npm -v
```

---

### Node.js 更新神器：`n`

apt 装的 Node.js 可能不是最新的，推荐用 `n` 来升级（注意：`n` 不支持 Windows）。

安装：

```bash
sudo npm install -g n
sudo ln -s /usr/local/node/bin/n /usr/bin/n
n -V
```

常用操作：

```bash
sudo n latest    # 最新版
sudo n stable    # 稳定版
sudo n lts       # LTS 版本
sudo n 18.12.1   # 指定版本
```

确认更新：

```bash
node -v
```

（我这边更新后是 `v24.3.0`）

---

## 安装 Gemini CLI

Node 搞定后，直接用 npm 安装：

```bash
npm install -g @google/gemini-cli
```

如果报权限错误，加个 `sudo` 就完事。
升级同理，再跑一遍安装命令即可。

---

## 登录 & 初始化体验

安装好后，直接运行：

```bash
gemini
```

会出现一个欢迎界面，并让你选个主题色（强迫症狂喜（？
后续可以随时用 `/theme` 改。

### 登录方式

首次运行必须登录，三种方式：

* Google 账号登录（推荐）
* Gemini API Key
* Vertex AI

⚠️ 大坑提醒：

* 一定要在 **有桌面环境的终端** 运行 `gemini`，否则登录会无限失败。
* 如果你用 SSH 登录，只会收到一个迷惑提示：
  `Authentication timed out. Please try again.` + 一个 TOS 链接。

### Workspace 账号问题

如果你绑定了 Google Cloud，可能会被误判成 Workspace 账号，报错：
`Login Failed: Ensure your Google account is not a Workspace account`

解决方案：

1. 换个没绑 Google Cloud 的账号
2. 或者设置环境变量：

   ```bash
   export GOOGLE_CLOUD_PROJECT="你的项目编号"
   ```

   （写到 `~/.bashrc` 或 `~/.zshrc` 里永久生效）

---

## 命令宝典

Gemini CLI 的命令分三类：

### 1. `/ 命令` —— 控制 & 会话管理

* `/help` 或 `/?`：显示帮助
* `/chat save`：保存对话历史
* `/chat resume`：恢复某个历史对话
* `/compress`：压缩上下文（省 Token 的神器）
* `/memory show` / `/memory refresh`：管理记忆
* `/stats`：查看会话统计
* `/clear`：清屏
* `/quit`：退出

### 2. `@ 命令` —— 注入文件 & 目录

* `@README.md` → 把指定文件注入 Prompt
* `@src/` → 注入整个目录（会自动忽略 `.gitignore` 里的文件）

### 3. `! 命令` —— Shell 交互

* `!ls -la` → 在 CLI 里直接跑 Shell
* 单独输一个 `!` → 进入 Shell 模式（再次输入 `!` 退出）

快捷键：

* `Shift+Enter` → 换行
* `Ctrl+L` → 清屏
* `Alt+←/→` → 光标跳单词
* `Ctrl+C` → 强制退出

---

## 使用体验：Claude Code vs Gemini CLI

我简单玩了下，主观感受如下：

* **Claude Code CLI**

  * 优点：快，逻辑清晰，任务拆解精准（比如写一堆 TODO 列表然后逐项完成）
  * 缺点：贵！Pro 版本几个对话就提示额度用完，下次请等 xx 点再用

* **Gemini CLI**

  * 优点：免费，Token 大，能全自动跑，适合开个窗口后台跑任务
  * 缺点：复杂逻辑上思路不如 Claude 顺，可能会卡很久

总结一句：**Claude 适合精准快活干大活，Gemini CLI 更适合佛系白嫖党（就是我.jpg）**

---

## 小技巧

* `Shift+Tab`：切换“自动修改模式”和“手动确认模式”
* `/compress`：长对话必备，防止 Token 爆炸
* 多开窗口：IDE 干活 + Gemini CLI 自动跑

