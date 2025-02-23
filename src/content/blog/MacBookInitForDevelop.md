---
title: MacBook Usage
date: "2023-11-21 23:00:00"
tags: [Skill]
categories: [Blog]
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/AndroidFlashRom_index_img.png
description: "Make your MacBook work like a charm"
---

## 系统设置

### 轻点代替点按

[System Settings] -> [Trackpad] -> [Point & Click] 打开 Tap to click。

### 三指拖动

[System Settings] -> [Accessibility] -> [Pointer Control] -> [Trackpad Options...] Dragging style 选择 Three Finger Drag。

### 光标加速

[System Settings] -> [Keyboard] Key repeat rate 拖到最右边，Delay until repeat 拖到最右边。

### Dock 自动隐藏

```bash
# 设置启动坞动画时间设置为 0.5 秒
defaults write com.apple.dock autohide-time-modifier -float 0.5 && killall Dock

# 设置启动坞响应时间最短
defaults write com.apple.dock autohide-delay -int 0 && killall Dock

# 恢复启动坞默认动画时间
defaults delete com.apple.dock autohide-time-modifier && killall Dock

# 恢复默认启动坞响应时间
defaults delete com.apple.Dock autohide-delay && killall Dock
```

## 常用软件

### [Homebrew](https://brew.sh/)

用来下载其他命令行工具，也可以下载字体，下载 APP。

### 找书

一直在下载书的路上，https://zh.annas-archive.org/

### [Brave Browser](https://brave.com/)

防追踪浏览器。

### [Raycast](https://www.raycast.com/)

目前主要使用的是剪贴板，配合自定义快捷键，还有很多功能待发现。

### [Spotify](https://open.spotify.com/download)

听歌，听播客，配合 [SpotX-Mac](https://github.com/Nuzair46/SpotX-Mac) 去广告。

### [Telegram](https://macos.telegram.org/)

节点白嫖据点 -> https://t.me/vpnhat ，偶尔能找到好资源。

### [ClashX.Meta](https://github.com/MetaCubeX/ClashX.Meta)

我不知道没了这个软件怎么活。自制节点白嫖链接：https://sub.reajason.eu.org/clash.yaml

部分节点可能无法使用 22 端口，导致开启代理是 GIT 无法 Push，可以将改 SSH over HTTPS，参考 https://docs.github.com/en/authentication/troubleshooting-ssh/using-ssh-over-the-https-port。

### 其他

飞书、微信、Todesk、腾讯会议

### 对于无法打开的软件

```bash
# 允许任何来源安装，执行命令之后能在隐私看到
sudo spctl --master-disable

# 文件损坏或有害？
sudo xattr -r -d com.apple.quarantine /Applications/<app>

# 打开闪退，错误信息显示签名错误之类的
sudo codesign --sign - --force --deep /Applications/<app>
```

## 开发软件

### JetBrains 全家桶

> https://3.jetbra.in/
> https://zhile.io/

#### [VsCode](https://code.visualstudio.com/download)

GitHub 账号登陆，支持插件同步，设置同步

#### [OrbStack](https://orbstack.dev/)

Docker Desktop 替代，突出一个轻量快速

#### [JProfiler](https://www.ej-technologies.com/download/jprofiler/files)

Java 性能监控工具，有时候 IDEA 的 profiler 就够用

```
// v14 激活码
S-J14-NEO_PENG#890808-1jqjtz91lywcp9#23624
```

#### [Burp Suite](https://portswigger.net/burp/releases/professional/latest)

接口测试必备

#### [Alacritty](https://github.com/alacritty/alacritty)

最近在尝试 Alacritty + Zellij 组合。

## 使用技巧

### Finder

1. 复制文件的绝对路径，在目标文件右键，按下 option 会显示 copy file as pathname
2. 显示隐藏文件，shift + command + .

## 参考博客

1. https://www.rustc.cloud/mac-install
2. https://g4ti0r.github.io/wiki/Mac/system.html
3. https://github.com/macdao/ocds-guide-to-setting-up-mac
4. https://blog.lkwplus.com/posts/macos-dev-setup
