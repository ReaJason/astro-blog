---
title: Java 远程调试
date: "2024-12-15 19:52:55"
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JavaRASPwithByteBuddy_index_img.png
tags: [Java]
categories: [Blog]
description: "让我看看问题出在了哪里"
---

## 为什么需要调试？

1. 当程序代码变更导致不符合预期的行为，并且通过代码 Diff 并不能找到错误，此时我们需要调试来看一下执行上下文，到底是哪儿发生了什么奇怪的事情。
2. 破解程序的时候，一般都是静态分析 + 动态调试配合做数据流转分析。

## 日志调试

```java
// 看看有没有执行到这儿来
System.out.println("is coming");

// 看看有没有报错误信息
e.printStackTrace();

// 看看当前值是多少
log.info("the value is: {}", value);

// 使用日志系统，打印错误信息和错误堆栈
log.error("failed with error, fuck the world", e);
```

当程序出现非预期且没有任何信息蹦出来的时候，我们可以尝试在部分关键位置加上日志打印或堆栈打印来确定问题所在，有时候错误堆栈就足以帮助我们解决问题，并不需要使用专门的调试工具。

## Java Remote Debug

以前做 Java 开发的时候根本用不到远程调试，基本都是 IDEA 直接点调试运行就行，后来做 Java Agent 开发，因为 Agent 都是应用在其他 JVM 程序上，导致根本没有调试运行的机会，只能通过 Java Remote Debug 来调试目标 JVM 程序，这样子目标 JVM 运行时加载到 Agent 代码就能在 IDEA 里面愉快调试了。

![JavaRemoteConfig](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JavaRemoteDebug_img/JavaRemoteConfig.png)

1. Debugger Mode：分为 Attach 和 Listener 两种模式（你可能只需要 Attach Mode）。
2. Host 和 Port 为目标 JVM 所在的 IP 地址 + 调试端口。
3. Command line：这是需要给目标调试 JVM 添加 JVM 参数的，右边可以选 JDK 版本，有时候并不固定，JDK8 的那条所有都能用，有时候 JDK8 还得用 JDK低版本的那个，说不准。

如果是 Java Application 直接加在启动命令中即可。

```
java -jar -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 springboot.jar
```

如果是镜像（不要忘记暴露调试端口 5005），可能需要知道目标服务吃哪一个 JVM 参数。可能的选项：

1. JAVA_OPTS（常见）
2. JVM_ARGS
3. JAVA_TOOL_OPTIONS（这个所有的 Java 程序都会应用，如果一个环境下多个 Java 跑，使用调试参数会报端口冲突）

如果你需要在应用启动的过程中就需要调试，你可以修改一下参数（我记得我刚开始的时候这边应用启动完，狂在 IDEA 里面点开始调试）

```
-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005

改为

-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=5005
```

还是一样的添加参数的方式，这样当你启动应用的时候，应用就会停住了，他在等你开启 Debug（IDEA 调试参数配置中 Mode 不变，仍然是 Attach Mode）。

## 常见问题

### 1. 连不上？

查看 JVM 调试参数是否添加成功，添加成功，启动的时候一般都会多一条日志，叫作 Listener 5005 啥的。

查看调试端口是否占用，有时候一个调试端口可能会重复使用，当然一般会报端口冲突，无论哪种情况都可以尝试更换一下端口再试。

如果是镜像中使用调试参数，需要你暴露调试端口出来。

### 2. 行号对不上？

首先需要确认目标 JVM 运行的代码版本和你 IDEA 打开的版本是否一致，最开始经常出现调着调着发现分支搞错了。

IDEA 有时会“自作聪明”地选根本不是这个版本的代码让你调试，然后报 warn 说代码行对不上。在 IDEA 设置中，Build - Debugger - Show alternative source switcher，勾选之后调试的时候，如果一个环境中有多个不同版本的包可以指定目标环境的版本（不过测试过程中体验并不是很好，还是有一点点用）。

![ChangeDebugSource](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JavaRemoteDebug_img/ChangeDebugSource.png)

## 实战

添加 Java Tomcat Servlet 内存马时，在 Tomcat 5 和 Tomcat 6 下不行，打日志没辙，只能开启调试。PR 地址 -> https://github.com/ReaJason/MemShellParty/pull/3

<iframe width="560" height="315" src="https://www.youtube.com/embed/DNXVje4iprA?si=5xJT_Qwf93Z3283H" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

在代码编写过程中，添加了大量的调试日志，方便排查问题，因为添加日志的成本远远低于使用调试工具的成本。

1. 时间戳 **30:31** 打印错误堆栈，找到了是哥斯拉内存马代码缺失导致实例化报错。

2. 时间戳 **1:03:52** 通过 find 查找目标应用类所在 Jar 包，并添加 JVM 调试参数调试准备指定类。**1:07:31** 才开启这一次的正式调试。（当把 Jar 包弄出来还不够，如果调试需要 Add to Library 才行）

3. 时间戳 **1:08:21** 通过搜索发现需要判断 tomcat 启动时做了什么事情，因此修改了调试参数为 suspend=y，这样当我启动镜像的时候，只要我没有在 IDEA 里面连接，Tomcat 就不会启动而是等待。

4. 时间戳 **3:24:00** 在调试窗口执行表达式时爆红也是没关系的，能直接执行，调试了大约两个多小时，此时我已经知道为什么不生效了，因为加错地方了。

## 总结

工欲善其事必先利其器，当你在某个上下文中，能足够快地获取更多的信息方便你定位问题或尝试给出答案，你就变大佬了。

不要使用 Listener Mode，直接将 suspend=n 改为 suspend=y 就是你想要的效果。

使用调试工具的成本远远高于日志打印，优先选择日志打印。

之前看过一段时间 jjy 的操作系统课，当出现问题的时候要相信程序永远是对的（我的理解是你只要花时间总能找到出问题的地方）。

没有调试解决不了的问题，请注意时间成本，如果一段时间都没有结果一定要考虑尝试休息一下，去散散步，接杯水，可能回来你的思路又不一样了。
