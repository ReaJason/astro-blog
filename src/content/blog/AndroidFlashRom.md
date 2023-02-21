---
title: 我的刷机之旅 — Redmi K20 Pro
date: "2021-4-12 23:00:00"
tags: [Skill,Notes]
categories: [Android]
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/AndroidFlashRom_index_img.png
description: "🎉玩机党的快乐！"
---

## 🙋‍♂️前言

大二开始接触手机上的各种破解软件，在类似葫芦侠，各种瞎几把论坛瞎逛找一些好玩的软件或者美化操作，当时拿着荣耀畅玩 5A 、OPPO R9，软件安装限制很大。一个偶然的机会，下载了 [酷安](https://coolapk.com/)，接触到了 ROOT 和 Xposed 模块，并产生了非常浓厚的兴趣（因为可玩性实在是太高了），后来（大三）买了一个 Redmi Note 7 Pro 开始了我的刷机之路（选择红米的手机是因为小米手机官方有解锁工具，类原生适配非常多，红米手机又便宜，学生党只能这个样子了），加群以及在酷安学习了很久之后，写了一个 [刷机教程](https://mp.weixin.qq.com/s/aFvXRVqvBMkPgy3rnaQrFA)，而如今（大四）手持 Redmi K20 Pro 基本养老了，不过 [Magisk](https://github.com/topjohnwu/Magisk) 和 [Lsposed](https://github.com/LSPosed/LSPosed)（后来兴起的用来代替 [EdXposed](https://github.com/ElderDrivers/EdXposed)）也还是必装，毕竟 [yc 调度模块 ](https://github.com/yc9559/uperf/releases)（省电优化）和 [Xposed Edge Pro](https://forum.xda-developers.com/t/xposed-edge-pro.3525566/)（自动化以及手势增强）等等是真的香喷喷。

MIUI12.5 发布了这么久，有些地方优化还是没做好，可能还需要一段时间吧，现在小米疯狂出新手机，对于我这个手机估计离停更也不远了，大家应该都听过类原生流畅丝滑之类的，但是其功能就没有 MIUI 这么多了，因此要用得习惯对于我来说还是很难得，不过对于玩机党来说有时候，在类原生和 MIUI 中间反复横跳是常有的事情，今天有时间就再更新一下之前的刷机教程（适用于所有小米手机，套路都一样），再来演示一波类原生刷机教程以及刷面具。

## 💡XDA 论坛

> XDA 论坛官网：https://forum.xda-developers.com/
> Redmi K20 Pro ：https://forum.xda-developers.com/c/redmi-k20-pro-xiaomi-mi-9t-pro.8953/
> 其他机型自行在论坛官网的右上角搜索即可，加载有点慢，毕竟是国外的网站



> Tips：刷机资源绝大多数都以手机代号来命名，所以需要先知道自己的手机代号。小米手机可以在 [【小米手机代号名称查询】](https://miuiver.com/xiaomi-device-codename/) 查找，例如 Redmi K20 Pro 的手机代号为 raphael



我觉得这个 XDA 是国外玩机党的 HOME，基本类原生全都发布在这里，每个手机板块下都有一个叫 ***ROMs, Kernels, Re，在这个下面就可以找到类原生系统的发布地址，和简单的刷入操作介绍，对于我们来说刷之前可以先去酷安对应手机板块下逛逛，看刷哪个比较好，看别人的刷入体验有哪些特别要注意的地方。



![Redmi_K20_Pro_XDA.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/AndroidFlashRom_img/Redmi_K20_Pro_XDA.png)



## 🔓解 BL 锁



> 解锁小米手机官网：http://www.miui.com/unlock/index.html
> 官方解锁工具：[miflash_unlock](http://miuirom.xiaomi.com/rom/u1106245679/5.5.224.55/miflash_unlock-5.5.224.55.zip)

> Tips:小米解锁手机需要设备和账号绑定一周后才给予解锁服务的，可能可以秒解，解锁是会清除手机所有数据的，所以请务必备份手机的重要数据，等待期间可以学习学习刷机教程



1. 打开开发者选项
   - 进入设置－我的设备－全部参数－MIUI版本－疯狂点几下开启开发者模式
2. 绑定账号与设备
   - 进入设置－更多设置－开发者选项－设备解锁状态－绑定账号和设备
3. 打开解锁工具，登录小米账号，并检测设备是否可解锁，如果可则解锁，不可则慢慢等待相应时间
4. 手机进入 fastboot 模式（即官方教程给出的 Bootloader 模式）（不一定要关机，同时按住开机键和音量下键，一直按着即可进入），手机用数据线连接电脑
5. 点击解锁（会清除所有设备数据，注意备份重要数据）



![unlock_success.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/AndroidFlashRom_img/unlock_success.png)



## ⚙刷入 TWRP

> TWRP 官网：https://twrp.me/Devices/
> Redmi K20 Pro：https://twrp.me/xiaomi/xiaomimi9tpro.html
> OrangeFox：https://archive.orangefox.download/OrangeFox-Stable/



1. 获取 TWRP

   - 在上方的 TWRP 官网中，找到自己的设备页面，在 Download Links 下选择 Primary (Americas)，即可找到最新的 TWRP 镜像文件，因为镜像站点在国外下载可能过慢，下方评论回复有时间可帮下。Redmi K20 Pro twrp-3.5.2_9-0-raphael.img：[蓝奏云](https://lingsiki.lanzoui.com/izQJIo1bxwb)
   - 可在酷安手机板块搜索下载，应该是有人搬运的，或者去刷机群找找

2. 获取 ADB

   - 给出下面两个版本的 adb，Android版本低的建议 32 版本，我使用 41 版本，有时候 adb 无法连接手机或者 TWRP 刷不进去可能是 adb 版本的问题，换一个有可能可以解决
   - [adb version 1.0.32.zip](https://lingsiki.lanzoui.com/iz9Bao1c0na)
   - [adb version 1.0.41.zip](https://lingsiki.lanzoui.com/iy8HBo1c0mj)

3. 连接手机

   - 手机进入 fastboot 模式（因为界面有个兔子也称兔子模式）（不一定要关机，直接同时按住开机键和音量下键，一直按着即可进入）
   - 手机数据线连接电脑

4. 使用命令刷入 TWRP

   - 解压 ADB 压缩包，在资源管理器的地址栏输入 cmd，回车即可在当前目录打开命令行
   - 输入 `fastboot devices -l` 查看是否已连接上
   - 输入 `fastboot flash recovery 将 img 文件拖入此处`，刷入 TWRP
   - 显示 Finished 即完成，在 fastboot 模式下，同时按住开机键和音量上键，一直按着直到手机震动一下松手即可进入 TWRP 界面
   - 官方 TWRP 版本进入会有一个界面选择是否系统分区只读，select language 选择中文，下次不再提醒，滑动修改
   
   该方式是通用的刷入第三方 REC 的方法，那种什么一键刷入的也就用这个命令，因此你也可以以这种方式刷入其他第三方 REC，例如上方给出的 OrangeFox（橙狐），下载对应手机代号最新的压缩包，解压就可以看见 img 镜像文件，也可以在 TWRP 中直接刷入下载下来的 zip 包，重启 TWRP ，REC 就变成了 OrangeFox（橙狐），如果由于某种误操作导致 TWRP 掉了，再以该方式刷入就行了



![open_cmd.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/AndroidFlashRom_img/open_cmd.png)

![fastboot_rec.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/AndroidFlashRom_img/fastboot_rec.png)

![TWRP_first.jpg](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/AndroidFlashRom_img/TWRP_first.jpg)



## 🎨卡刷 ROM

> 卡刷其实就是在 TWRP（第三方 REC） 里面将 zip 包刷入手机，这里以 [EvolutionX_5.6_raphael-11-20210413](https://sourceforge.net/projects/evolution-x/files/raphael/EvolutionX_5.6_raphael-11-20210413-0411-OFFICIAL.zip/download) 为例安装类原生，所需要的固件包版本为 [RAPHAEL-V12.0.6.0](https://downloads.akhilnarang.dev/MIUI/raphael/RAPHAEL-V12.0.6.0.QFKCNXM-10.0-vendor-firmware.zip)，Redmi K20 Pro TWRP 目前无法自动解密，为防止 TWRP 乱码，可刷入 [强制解密补丁](https://lingsiki.lanzoui.com/iLHEeo1l08j) （不知道其他手机是否可用）



1. 电脑端下载指定版本固件包、类原生包、强制解密补丁
2. 手机进入 TWRP，数据线连接电脑，电脑打开手机存储将包全部移到手机内部存储的 TWRP 文件夹
3. 点击 TWRP 主界面的安装，找到 TWRP 文件夹并选择固件包，滑动刷入，安装完成之后以相同方式刷入类原生包和强制解密补丁
4. 点击 TWRP 主界面的清楚，格式化 DATA，yes，重启系统
5. 升级系统
   - 先直接下载新版本的完整包
   - 进入 TWRP 刷入顺序为：完整包 - Magisk 卡刷包（可选） - 强制解密补丁 - 重启系统



![flash_rom.jpg](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/AndroidFlashRom_img/flash_rom.jpg)

![format_data.jpg](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/AndroidFlashRom_img/format_data.jpg)



## 🎭安装 Magisk

> Magisk GitHub：https://github.com/topjohnwu/Magisk

> Tips:Magisk 以前分发的都是卡刷包，刷完桌面就会有 Magisk 管理器，但是 Magisk 在 [22.0](https://github.com/topjohnwu/Magisk/releases/tag/v22.0) 版本之后就没有分发卡刷 zip 包了，只有一个 apk 文件，但是将 apk 文件后缀名改为 zip 即可变成卡刷包。Magisk 在升级系统和刷入内核的时候都会掉，此时只要刷完系统包或者内核之后再刷入 Magisk 的卡刷包即可



1. 下载 [Magisk.apk](https://github.com/topjohnwu/Magisk/releases) 并安装，然后在文件管理将其改为 .zip 格式
2. 同时按住开机键和音量上键，进入 TWRP，安装 - 选择 Magisk.zip - 刷入 - 重启
3. 打开 Magisk app 即可显示安装的版本
4. 卸载的话就下载 [Magisk-uninstall.zip](https://github.com/topjohnwu/Magisk/releases/download/v21.4/Magisk-uninstaller-20210117.zip) 在 TWRP 刷入即可卸载



![magisk.jpg](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/AndroidFlashRom_img/magisk.jpg)



## ✨安装 Lsposed

> Lsposed：https://github.com/LSPosed/LSPosed
> EdXposed：https://github.com/ElderDrivers/EdXposed



1. 在 Magisk app 中先安装 Riru 后安装 Riru-LSPosed 重启即可
2. 重启后，打开 LSPosed app 即可查看 LSPosed 是否安装成功
3. 可以在仓库中安装 xp 模块，然后在模块中启用，并勾选作用域（即该 xp 模块 需要对谁起作用）
4. 如果作用的是单个 app 开启模块后重启 app 即可生效，如果作用域为系统框架那么需要重启生效

![lsp.jpg](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/AndroidFlashRom_img/lsp.jpg)

![xp_module.jpg](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/AndroidFlashRom_img/xp_module.jpg)



## ☂线刷救砖

> 对于刚开始玩刷机的朋友，可能会操作不当会遇到手机突然无法开机，或者等等情况
> 只要同时按住开机键和音量下键能够进入 fastboot 模式，那么你就可以通过线刷的方式开机



> 小米官方线刷教程：http://www.miui.com/shuaji-393.html
> 小米官方通用刷机工具：http://bigota.d.miui.com/tools/MiFlash2018-5-28-0.zip



> Tips:各机型线刷包也是在该链接下载，线刷包是以 tar 格式结尾的包，卡刷包是以 zip 格式结尾的，我当时拿卡刷包去线刷，线刷工具说找不到脚本，折腾半天找不到解决办法，所以这里特别提醒！

1. 下载本机型的线刷包解压，我用 7zip 要解压两次，解压之后文件夹有许多 .bat .sh 文件，下载通用刷机工具解压
2. 打开在刷机工具文件夹中 XiaoMiFlash.exe，安装驱动
3. 手机进入 fastboot 模式（不一定要关机，同时按住开机键和音量下键，一直按着即可进入），用数据线连接电脑
4. 点击加载设备，下面即会显示一行东西意味着手机已连接
5. 点击选择，选择解压之后的线刷包
6. 在右下角有三种模式，一般使用第一个全部删除就可以，最后一个全部删除并 lock 即是回锁，等什么时候你不再刷机了，可以以这种方式回锁设备
7. 用时可能需要一点点时间，如果报错，请自行百度或求助于各大论坛学习解决

![usb_flash.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/AndroidFlashRom_img/usb_flash.png)

> 以上完，如有错误，恳请指正，仅记录一下自己刷机的过程，大家想玩就玩，刷机需谨慎，变砖两行泪
