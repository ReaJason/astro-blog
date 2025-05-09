---
title: 记第一次技术面
date: "2023-05-14 19:41:36"
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/FirstTechnicalInterview_index_img.png
tags: [Notes]
categories: [Summary]
description: "小红书吐槽文，大佬捞我，全新的网安赛道，我要抓住机会，一往直前"
---

## Lucky

这是一家做网络安全方向的创业公司，面试机会来源于我在小红书发的一个当前工资太低的吐槽文章，捞我的是公司的研发负责人也是二面的面试官之一（真的非常感谢给我一个机会🥰）。一面的时间是 2023-04-27，二面的时间是 2023-05-11（一面结束，我以为没机会了，因为问了分布式锁还有微服务相关的，我都说不知道）。

## 二面

二面技术面主要是两个大佬，一个捞我的研发负责人 A，另一个经询问是湖南湘潭的 B，因为 A 临时有事再加上时间紧张，先由 B 面试官对我进行面试。

开篇自我介绍，我主要介绍了我自学编程的经历，以及工作之余看的计算机相关书籍如代码整洁之道，代码大全，重构等，最后着重讲了所做的两个 GitHub 项目，一个是完美校园打卡（使用 XP Hook，安卓逆向等工具，用 Python 构建自动化打卡流程），另一个是个人博客项目。针对我的自我介绍，B 面试官主要问了以下问题：

1. 在做 XP Hook 时有没有遇到比较棘手的问题，以及怎么解决的？
   - XP API 在构建项目时不能直接打包进 APK，否则无法正常安装
2. 当发现 App 有壳的时候是如何查看到源码的？
   - 通过 App 历史版本
3. 有没有使用过什么反混淆工具？
   - 只是用过 jadx（这只是反编译工具）
4. 平常是如何翻墙的，ChatGPT 是如何注册的？
   - 使用 v2ray，通过 sms-activate 接码平台
5. 浏览器输入链接发生了什么，详细说说其中的东西？
   - 这一块答得很不好，脑子里面有很多东西还是没能串起来
6. 追问了 DNS 根域名服务器如果当前没有保存二级域名，整个查询链路是如何产生的？
   - 递归/迭代查询，询问其他域名服务器是否知道当前域名（面试官提示了 NS）
7. 浏览器得到 IP 地址后是如何建立链接的？
   - TCP 握手，然后就那三次

面试了一会儿，A 面试官到了，于是就由两个面试官一起提问。

1. 当时正好在说网络相关的知识，面试官 A 就先就此问了一个简单的问题，TCP 和 IP 分别属于哪一层，HTTP 是哪一层
2. 面试官 B 结束了这个话题，问到有没有了解 JavaAgent 技术？
   - 了解了一下是通过字节码增强技术，通过程序启动前指定 --javaagent:jar 来实现 aop 似的拦截指定方法以及类的技术
3. 如果要你设计 AOP 你会如何设计用户层面 API？
   - 我说了 SpringAOP 的接口，@PointCut，@Before，@After， @Around，以及 BeanPostProcessor，将 bean 进行织入实现 AOP
4. OA 项目平常有没有遇到什么漏洞以及是怎么处理的？
   - 后来沟通得知，我做的只是内部系统，没接触到这个
5. 平时学习是上班的时候学习还是上班之余学习？
   - 上班之余，上班的时候会先把安排的任务完成
6. 技术方面有什么打算？
   - 这个问题对于现阶段的我来说太难了，我只说了现阶段希望加入一个更好的团队（回答不是很令人满意），我又说希望之后做一款自己的产品，然后巴啦巴啦了一些项目管理相关的东西

面试结束我问了如下两个问题：

1. 平时工作历程，有没有 Code Review？
   - 有，不过还是被教育了 Code Review 不是必需的，且有时候会浪费 Reviewer 的时间。
2. 公司有没有电脑分配？
   - Mac 和 Windows 都有，建议 Mac

## 三面

二面结束紧接着就是三面，我二面面完，已经面红耳赤了，一个人在会议室走来走去，然后深呼吸，过了一会儿公司老板和 HR 就进来了。

我又开始自我介绍，本来想直接用二面的个人介绍，不过由于太过紧张（第一次公司老板面试），说到一半哑巴了，说不出来了（也有可能是太渴了，二面接近一个多小时没喝水）。老板主要问了我如下问题：

1. 讲一讲博客系统为什么使用 Redis？
   - JWT token，通过 Redis 强制 JWT 失效（后来才知道应该说查询缓存）
2. 操作系统怎么学的，以及学了哪些知识？
   - 看的书是 **Operating Systems: Three Easy Pieces**，主要讲了虚拟化，并发以及持久化。
3. 死锁是如何产生的？
   - 给自己挖坑，死锁产生有四个条件，我只回答了两个出来

HR 问了我如下问题：

- 实习公司在哪里，为什么离职？
  - 在医院外包，平时任务偏运维无法学到知识
- 为什么从现在这家公司离职？
  - 工作中组长没做我们的项目，也没有 Code Review，难以从大佬那儿学到东西
- 现在薪资，多少薪，介不介意加班，期望薪资？

面试结束，问 HR 要了一瓶水，嘎嘎猛喝溜了。
