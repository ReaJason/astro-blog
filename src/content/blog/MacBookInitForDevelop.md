---
title: MacBook 使用总结
date: "2026-06-12 01:22:00"
tags: [Skill]
categories: [macOS]
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
defaults delete com.apple.dock autohide-delay && killall Dock
```

## Finder 使用

1. 复制文件的绝对路径，在目标文件右键，按下 Option 会显示 copy file as pathname，快捷键就是选中文件按 Command（⌘）+ Option（⌥）+ C
2. 显示隐藏文件，Shift（⇧）+ Command（⌘）+ .

## 常用软件

1. [Homebrew](https://brew.sh/)：命令行工具，用来下载其他命令行工具，也可以下载字体，下载 APP
2. [Brave Browser](https://brave.com/)：隐私浏览器
3. [Alfred](https://www.alfredapp.com/)：代替 Spotlight 用于启动软件以及快速打开项目
4. [Spotify](https://open.spotify.com/download)：听歌，听播客，配合 [SpotX-Official/SpotX-Bash](https://github.com/SpotX-Official/SpotX-Bash) 去广告
5. [Telegram](https://macos.telegram.org/)：[@qiuchenlymac](https://t.me/qiuchenlymac) 破解软件大户
6. [CleanShot X](https://cleanshot.com/)：截图软件，颜值不错
7. [Paste](https://pasteapp.io/)：剪贴板，颜值不错
8. [AlDente](https://github.com/AppHouseKitchen/AlDente-Battery_Care_and_Monitoring)：电池管理
9. [Keka](https://www.keka.io)：压缩软件
10. [Fork](https://git-fork.com/)：git 管理
11. [Ghostty](https://ghostty.org/)：终端应用
12. [mise](https://mise.jdx.dev/)：命令行工具，用来管理 node、java、python 等不同版本的环境
13. [IDEA](https://www.jetbrains.com/idea/)：不学 Java 开发不要碰，会让电脑变得不幸，https://3.jetbra.in/
14. [VS Code](https://code.visualstudio.com/download)：写非 Java 项目或者编辑打开文本文件
15. [OrbStack](https://orbstack.dev/)：比 Docker Desktop 轻量
16. [jadx](https://github.com/skylot/jadx)：Java 反编译神器
17. [JProfiler](https://www.ej-technologies.com/jprofiler/download)：分析 heapdump 或实时监控 Java 程序，激活码见 [记录 JProfiler V15 破解](./jprofilerv15crackedwithida)
18. [Burp Suite](https://portswigger.net/burp/releases)：网络安全接口测试必备，loader 可使用 [BurpSuiteLoader](https://github.com/JAgentSphere/bytebuddy-agent-demo/releases/tag/2026) 支持 2026+
19. [Bruno](https://www.usebruno.com/)：Postman 替代品，开发用，方便发送一些简单的 API 调用
20. [Codex](https://developers.openai.com/codex/app)：GUI Coding Agent，没用过 Codex 的开发不是好开发
21. [CC Switch](https://github.com/farion1231/cc-switch)：快速切换 Claude Code、Codex 等 AI Agent 账号
22. [Shadowrocket](#)：macOS/iPhone 统一翻墙工具，手机端：[小火箭苹果 ID 共享](https://id.ruyie.de/)、电脑端：[appstorrent-Shadowrocket](https://appstorrent.ru/4563-shadowrocket.html)，部分节点可能无法使用 22 端口，导致开启代理时 git 无法 Push，可以改用 [SSH over HTTPS](https://docs.github.com/en/authentication/troubleshooting-ssh/using-ssh-over-the-https-port)

## 其他

飞书、微信、Todesk/UU 远程、腾讯会议、QQ

## 常用网站

1. [安娜的档案](https://zh.annas-archive.gl/)：找书
2. [LinuxDo](https://linux.do/)：白嫖节点、白嫖大模型、学习新姿势
3. [appstorrent](https://appstorrent.ru/)：老毛子 macOS 破解软件源头
4. [爱看机器人](https://www1.ikanbot.com/)：追剧看电影看综艺，比如《铁拳教育》、《飞驰人生 3》、《挽救计划》
5. [girigirilove](https://ani.girigirilove.com/)：追番，最近在看《欺诈游戏》
6. [TypingClub](https://www.typingclub.com/sportal/)：打字网站，偶尔上去练练打字
7. [GitHub](https://github.com/)：每天必打开
8. [X](https://x.com/)：每天必刷推特
9. [BiliBili](https://www.bilibili.com/)：看看游戏赛事直播或热门视频

## 对于无法打开的软件

```bash
# 允许任何来源安装，执行命令之后能在设置隐私看到
sudo spctl --master-disable

# 文件损坏或有害？
sudo xattr -r -d com.apple.quarantine /Applications/<app>

# 打开闪退，错误信息显示签名错误之类的
sudo codesign --sign - --force --deep /Applications/<app>
```

## 延伸阅读

1. https://www.rustc.cloud/mac-install
2. https://g4ti0r.github.io/wiki/Mac/system.html
3. https://github.com/macdao/ocds-guide-to-setting-up-mac
4. https://blog.lkwplus.com/posts/macos-dev-setup
