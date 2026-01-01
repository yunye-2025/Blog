---
title: 假入库后重装steam方法
published: 2024-07-30
description: '假入库后重装steam方法'
tags: [Steam,教程]
category: '教程'
draft: false
lang: ''
---
> 原创文章，未经授权，禁止转载
>

> 其他站链接：[https://www.xiaoheihe.cn/creator/editor/edit/article?id=129394520](https://www.xiaoheihe.cn/creator/editor/edit/article?id=129394520)
>

## 前言

在淘宝中有许多打着正版旗号的商家卖盗版

用假入库的方式骗小白。

假入库后有两种方式，防止被V社红杏

### 替换相关文件

1.在steam根目录下删除hid。dll文件

2.用管理员权限打开powershell，并执行下操作；

输入 Set-ExecutionPolicy -Scope CurrentUser Restricted，

3.然后输入 Y 确定，

4.最后输入 Get-ExecutionPolicy检查是否为Restricted，

如果显示Restricted代表你被改了的powershell已经恢复

### 卸载steam

### 重要事项

以下操作将会移除您计算机里的 Steam 以及所有已经安装的游戏内容。 如果您想在不久的将来重新安装 Steam 和 Steam 游戏，请移动 steamapps 文件夹 (C:\Program Files (x86)\Steam\steamapps) 到 Steam 的安装目录之外，以防您的游戏被删除。 此外，所有的游戏内容都可以创建备份，以重新安装。

### 警告

卸载流程会删除 Steam 的安装文件夹，以确保 Steam 得到完全卸载。 如果您不小心將 Steam 安裝至一个包含其它数据的文件夹中，例如 C:\Program Files (x86)\ 而非 C:\Program Files (x86)\Steam\，

请打住！请勿运行卸载程序，而应仔细遵循以下的“手动移除 Steam”指引，但只需按照第三步操作删除与 Steam 有关的文件即可

### 自动卸载

1.退出 Steam

2.若要保留游戏安装文件，请将 steamapps 文件夹移出 C:\\Program Files (x86)\\Steam

3.点击 Windows 的开始按钮，并点击齿轮图标，进入设置

4.在设置窗口中选择应用

5.在应用列表中搜索并点击 Steam，然后点击随之出现的卸载按钮

6.选择自动选项，然后单击下一步

7.点击完成来卸载 Steam

### 手动卸载

### 警告

在您进行注册表操作时需要格外小心。 不要删除任何您在 Windows 注册表中不确定的东西。 因此，我们建议将此选项作为最后手段。

1.退出 Steam。

2.导航至您的 Steam 目录。 （通常路径为 C:\Program Files (x86)\Steam)

3.如果您想保留您的游戏文件，以便您将来安装 Steam 时使用，请把您的 steamapps 文件夹复制到 Steam 安装目录以外的地方。

4.删除您 Steam 目录中的所有内容。

5.前往开始 > Windows 系统文件夹 > 运行（或按下 Windows 键和“R”键），然后输入

6.regedit

7.点击 是 按钮。 （这将打开您的注册表编辑器

32 位操作系统：

8.在注册表编辑器左侧栏中，找到：

HKEY_LOCAL_MACHINE\SOFTWARE\Valve\

右键单击 Steam 并选择删除。

64 位操作系统：

8.在注册表编辑器左侧栏中，找到：

HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\Valve\

右键单击 Steam 并选择删除。

9.在注册表编辑器的右侧栏，找到：

HKEY_CURRENT_USER\Software\Valve\

右键单击 Steam 并选择删除。

9/10右键单击 SteamService 并选择删除。

11/12关闭注册表编辑器。

### 重新下载steam

卸载完成后，访问s。team重新下载steam

最后请看官老爷们点个关注！
