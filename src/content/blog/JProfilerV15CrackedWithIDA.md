---
title: 记录 JProfiler V15 破解
date: "2025-04-24 01:11:55"
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/RainBowBracketsCracked_index_img.png
tags: [Cracked, IDA]
categories: [Blog]
description: "IDEA 启动！IDA 启动！"
---

## TL;DR

JProfiler V15 永久许可证密钥（姓名/公司随便填）：

```text
S-J15-ReaJason#999999-pb3u8s3ugg83x#5242
```

以前版本的：

```text
// v13
S-NEO_PENG#890808-g4tibemn0jen#37bb9

// v14
S-J14-NEO_PENG#890808-1jqjtz91lywcp9#23624
```

## 前言

最近一直在开发一款策略引擎，因为快到 deadline，所以需要开始测试性能了，于是我打开了尘封已久的 [JProfiler](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/https://www.ej-technologies.com/jprofiler/download)，很久不用的软件我都习惯性地去官网看一下有没有新版顺便更新一下，刚好看到 V15 出来了（之前一直用的 V14，激活码用的是 [zhile.io/jprofiler-license.html](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/https://zhile.io/2022/02/22/jprofiler-license.html) 提供的）。

我更新好了 V15 输入 V14 提供的激活码，可惜并不能用。

![JProfilerUselessV14key.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/JProfilerUselessV14key.png)

之前博客的作者弄了个 LinuxDo 论坛，论坛上搜也没有最新的，搜索引擎上搜也没有最新的，随后去了我之前常住的论坛 52pojie，搜到了一篇看起来特别有实操性的分析文章：[jprofiler 最新版逆向分析](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/https://www.52pojie.cn/forum.php?mod=viewthread&tid=1993300)。于是开启了我的实操之路。

## IDEA 调试

> 由于为了环境问题导致中途放弃，我特意打开我的 Windows 跟了一遍教程（虽然实际上是因为 MacOS 上 IDA 功能不全没法完成，不得不用 Windows）

根据大佬的帖子，部分校验代码在 jprofiler.jar 中，根据我的安装位置：`C:\Program Files\jprofiler15\bin\jprofiler.jar`，打开任意 IDEA 项目，移到项目根目录，并添加到库中，方便之后的调试。

![IDEAAddLibrary.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/IDEAAddLibrary.png)

打开 IDEA，添加一个新的运行配置，找到远程 JVM 调试，复制调试参数：`-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005`，然后点 OK。

![CopyDebugArg.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/CopyDebugArg.png)

打开 JProfiler 添加调试参数的文件，安装位置不同可能会不一样，也就是添加 JVM 参数的地方：`C:\Program Files\jprofiler15\bin\jprofiler.vmoptions`

```text
# For 32-bit JVMs, raise the -Xmx value carefully because otherwise snapshot
# files cannot be memory mapped anymore and all operations slow down.
-Xmx2560m
-Xss2m
-include-options ${USERPROFILE}\.jprofiler15\jprofiler.vmoptions
-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005
```

然后重启 JProfiler，重新到输入许可证的地方，先填好不按确定按钮，根据大佬的分析，按钮的触发事情在 awt 中都是继承自 `java.awt.event.ActionListener`，我们在 `java.awt.event.ActionListener#actionPerformed` 这个接口方法这儿打上断点，并开启调试，然后去按输入许可证那儿的确认按钮。
一开始进入的应该是 AbstractButton 的类里面，一直 step into 就能进入到所调用的真正的 actionPerformed 实现了，可以看到和大佬给出的一模一样我们就是进对了。

![StartDebug.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/StartDebug.png)

往下一直跟进，主要逻辑在 `this.a.validateAndSave()`、`this.a(var3, var4, var2, var1, var5)`，我们可以找到下面这段代码。

![KeyPoint1.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/KeyPoint1.png)

针对第一个 `!a(var2)`，跟进去，可以看到 V15 版本不能用 J14 了，要使用 J15，第一个没过直接寄了，所以我们改一下我们的许可证变为 `S-J15-NEO_PENG#890808-1jqjtz91lywcp9#23624`，我们在 return !a(var2) && (a(var5, var2.a() + var4, 37, 51, 8) || a(var5, var2.a() + var4, 83, 52, 3)) ? var2.e() : this.c(var1); 打上断点，重新输入新的许可证点击确认。

```java
private static boolean a(o var0) {
    String var1 = var0.c();
    if (var1 != null && !var1.isEmpty()) {
        return !var1.contains("-J15-");
    } else {
        return false;
    }
}
```

后面 (a(var5, var2.a() + var4, 37, 51, 8) || a(var5, var2.a() + var4, 83, 52, 3)) 两个调用的同一个函数的两种不同验证，看起来可能许可证分发可能就有两种方式。

![SuffixChecker.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/SuffixChecker.png)

大佬已经给出了计算这个 # 后面的代码，我们直接 copy 使用即可，生成出来 `S-J15-NEO_PENG#890808-1jqjtz91lywcp9#47510`，把断点去掉之后，啪的一下，很快啊，直接就行了，不过我看到 NEO 这种像博客作者 ID 的东西，我就想能不能改成我的，所以我就生成了 `S-J15-ReaJason#999999-1jqjtz91lywcp9#70320` 一样也是可以通过的。

```java
public class Hello {
    public static String encode(String var1){
        // 有两组数字都可以的
        int var2 = 83; // 37
        int var3 = 52; // 51
        int var4 = 3; // 8
        char[] var5 = var1.toCharArray();
        int var6 = 0;
        char[] var7 = var5;
        int var8 = var5.length;
        for(int var9 = 0; var9 < var8; ++var9) {
            char var10 = var7[var9];
            var6 += var10;
        }
        String var10000 = String.valueOf(var6 % var2);
        String var11 = var10000 + var6 % var3 + var6 % var4;
        return var1+"#"+var11;
    }
    public static void main(String[] args) {
        System.out.println(encode("S-J15-ReaJason#999999-1jqjtz91lywcp9"));
    }
}
```

接下来到了重头戏，我们要开始跟着教程分析 dll 里面的代码了，在 IDEA 里面写一个简单的程序运行就行，JProfiler 注入的时候就会挂点，我们就有测试环境了。

```java
public class ForLoop {
    public static void main(String[] args) {
        System.out.println("pid: " + ManagementFactory.getRuntimeMXBean().getName().split("@")[0]);
        while (true) {
            try {
                Thread.sleep(5000);
                System.out.println("Hello World");
            } catch (InterruptedException ignored) {
            }
        }
    }
}
```

![AttachAborting.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/AttachAborting.png)

## IDA 分析与调试

### IDA 安装

> 网上 IDA 版本很多，直接最新的 9.1 就好，当然可能这篇文章写完又有新的了，直接最新的。以下是 9.1 的安装方式。

1. 下载可以直接从 [52pojie](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/https://www.52pojie.cn/forum.php?mod=viewthread&tid=2014013&highlight=ida%2B9.1) 上下，也可以 TG 私信我，我发给你（我在我 TG 群存了一份）。
2. 一直下一步下一步安装完整之后，下载 patch.py 脚本移动到 IDA 的安装目录，我的是 `C:\Program Files\IDA Professional 9.1` 目录，在当前目录下执行 `python patch.py`，会生成 `ida.dll.patch` 和 `ida32.dll.patch`，将 `ida.dll` 和 `ida32.dll` 都加上 `.bak`，然后把 patch 后缀的文件去掉即可生效。

### jprofilerti.dll 分析

打开 IDA，选 GO，然后将 `C:\Program Files\jprofiler15\bin\windows-x64\jprofilerti.dll` 移动到下载目录（因为 C 盘这个目录权限会有问题），并将其直接拖到 IDA 里面去，会弹框直接默认 OK 就行，等待左下角不在变，显示分析完成就可以开始操作了。

![IDAReady.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/IDAReady.png)

先来了解一下简单的操作，这个我当时蒙了蛮久，因为我也第一次打开这个软件，在 IDA View-A 这个视图下按空格可以切换汇编码和 Graph 两种视图，Tab 栏可以看到还有 Hex-View 1 啥的。

接下来根据大佬的指示，Ctrl+F 打开搜索框，框框全选，搜索 Aborting。

![SearchAborting.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/SearchAborting.png)

等待搜索结束，可以看到搜到一些东西，双击第一个 `ERROR: invalid license key. Aboring`，眼前一片明亮，和大佬给出的简直一模一样。

```text
.text:00000001800690A0 loc_1800690A0:                          ; CODE XREF: sub_180068FD0+CE↑j
.text:00000001800690A0                                         ; DATA XREF: sub_180068FD0:jpt_18006909E↓o
.text:00000001800690A0                 mov     rdx, [rdi+28h]  ; jumptable 000000018006909E case 1
.text:00000001800690A4                 lea     r8, [rdi+40h]
.text:00000001800690A8                 mov     rcx, [rdi+38h]
.text:00000001800690AC                 call    sub_180087490
.text:00000001800690B1                 test    al, al
.text:00000001800690B3                 jnz     short loc_1800690C7
.text:00000001800690B5                 lea     rcx, aErrorInvalidLi ; "ERROR: Invalid license key. Aborting."
.text:00000001800690BC                 call    sub_1800930F0
.text:00000001800690C1                 mov     word ptr [rdi+8], 101h
```

但是，下面这一些东西，我找了两三个小时我都没找到它到底在哪里！！！！我几乎快要放弃了，我甚至还全局搜了一下 `aLjavaLangStrin` 和 `strncmp`，我并没有找到一个很像原文的地方。

![Confusing.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/Confusing.png)

我离开了键盘，趴到了床上，打开了我的手机玩了几把手游 QQ 飞车，飞了几把，给我的车神冲了冲分，我顿时感觉神清气爽，我还能再战。

![QQ 飞车.jpg](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/QQ%E9%A3%9E%E8%BD%A6.jpg)

我到处点，捣鼓捣鼓，我还学会了怎么把汇编代码反编译成代码，就是在 IDA View-A 这个 tab 栏中直接按 TAB，就会提示说将会进行反编译代码，但是我还是看不懂，根本看不懂。
当在我双击 strncmp 之后，我发现这儿居然能打断点，我的思路就发生了变化，等程序运行到 call 那个关键函数之后，再在这儿打断点，比对的其中一个就是我要的值，二话不说直接开干。

![strncmp.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/strncmp.png)

### 动态调试

因为是 sub_180087490 这个函数调用使得 Aborting 的，所以直接在这儿打个断点。

![IDADebugPoint1.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/IDADebugPoint1.png)

首先运行我们的测试 ForLoop 代码。

在 IDA 中选中 `Local Windows Debugger` 这个调试器。

![IDALocalDebugger.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/IDALocalDebugger.png)

在 Debugger 中点击 Attach to process.. 选中我们的 ForLoop 打印出来的 PID 程序即可。

![IDAAttach.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/IDAAttach.png)

等待它加载完成之后，会卡在这样一个奇怪的界面，需要我们手动点一下这个绿色按钮，进程才会正常运作下去。

![IDADebugStart.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/IDADebugStart.png)

我们开启 JProfiler 也同样注入到这个进程中去，程序就成功在这个 call 调用这儿停下来了。

![IDADebugCallFunc.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/IDADebugCallFunc.png)

接着我们去 strncmp 函数开头打个断点，方法就是 Ctrl+F 搜索 strncmp，随便点一个进去，双击 `call strncmp` 的 strncmp 就进去了，然后按一下绿色的按钮让程序运行下去。

![IDADebugCmp.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/IDADebugCmp.png)

运气真的很好，第一个 strncmp 的调用居然就是我们要找的，如果有超级多我都不知道会不会中途放弃了。

我们的之前填的激活码是 `S-J15-ReaJason#999999-1jqjtz91lywcp9#70320`，这儿的 rcx 刚好是我们的 `1jqjtz91lywcp9#70320`，因此我们按照原文的替换一下然后再重新生成一下得到我们最终的结果：`S-J15-ReaJason#999999-pb3u8s3ugg83x#5242`

![IDADebugPrint.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/IDADebugPrint.png)

最后我们重新输入新的激活码，JProfiler 终于可以监控程序了。

![JProfilerWork.png](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JProfilerV15CrackedWithIDA/JProfilerWork.png)

## 总结

因为很早以前就知道 IDA 很牛皮，但是一直不知道怎么用，这次也是借着大佬发布的比较详细的笔记分享实操了一波。虽然关于汇编什么的的，加密算法什么的一窍不通，但是最后也还是弄出来了，舒服，这篇也几乎算一篇 step by step 的文章，之后再玩这部分也有个可参考的笔记了。
