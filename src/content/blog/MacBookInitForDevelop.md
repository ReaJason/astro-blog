---
title: MacBook Usage
date: "2023-11-21 23:00:00"
tags: [Skill]
categories: [Blog]
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/AndroidFlashRom_index_img.png
description: "Make your MacBook work like a charm"
---

## 常用软件推荐

## 文件备份

1. ssh 密钥备份

    ```bash
    # 权限设置
    chmod 600 ~/.ssh/id_rsa*
    ```

2. 代码 push

    ```bash
    git add .
    git commit -m "temp"
    git push
    ```

3. 备份 2FA 相关的 recovery code

## 常用软件

### 找书

一直在下载书的路上，https://zh.annas-archive.org/

### [Brave Browser](https://brave.com/)

浏览器，方便同步书签和扩展插件还有密码管理。

### [Raycast](https://www.raycast.com/)

目前主要使用的是剪贴板，配合自定义快捷键，还有很多功能待发现。

### CleanShot_X_4.5

截图软件。[🔗](https://lingsiki.lanzouw.com/if8YZ1fk850f)

### [Spotify](https://open.spotify.com/download)

听歌，听播客，配合 [SpotX-Mac](https://github.com/Nuzair46/SpotX-Mac) 去广告。

偶尔会在 [这儿](https://slider.kz/) 找找歌听。

### [Telegram](https://macos.telegram.org/)

节点白嫖据点 -> https://t.me/vpnhat ，偶尔能找到好资源。

### [ClashX.Meta](https://github.com/MetaCubeX/ClashX.Meta)

我不知道没了这个软件怎么活。自制节点白嫖链接：https://sub.reajason.eu.org/clash.yaml

### [IINA](https://iina.io/)

暂时用这个看视频。

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

```bash
# 设置 alacritty 为默认终端
defaults write com.apple.terminal Shell -string "/opt/homebrew/bin/alacritty"
```
