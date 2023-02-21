---
title: 学了半年 Java 和前端基础，我能写出什么来
date: "2022-04-01 15:17:21"
tags: [Notes]
categories: [Blog]
---

## 学习路线

> 2021 年 10 月 ~ 2022 年 04 月

一开始在总监的指导下看了 **一个多月** 的《Java核心技术卷Ⅰ》，一步一个脚印地敲着上面的案例代码做笔记，Swing 那个就敲不下去而且也没有学习的必要。之后就是步入 JavaEE 的学习，从 Servlet/JSP（看的《HeadFirst》系列的书，很受益） -> JDBC -> 前端基础（HTML/CSS/JavaScript）（跟着 B 站最高点击黑马 pink 老师学的，不过没有学完），前面打基础的时候走得真的很慢很慢，原因就是每次学完一个阶段感觉差不多就和总监汇报，总监每次的回复总是 **『不要学太快，慢下来把基础打好，不要赶进度......』**。 MySQL -> Mybatis -> Spring -> SpringMVC，后面框架这块学得飞快，原因就是没做什么项目，因此我反复刷了三四遍教程，看了尚硅谷，黑马，动力节点这部分的教程，还有《Spring In Action》还有一些乱七八糟的关于 SSM 和 Spring 的书。这期间也在前端的视频带动下学了 Vue 框架（看的 CodeWhy 老师的 Vue3 课程，真的是每天晚上回去刷一节两小时的课，现在想起来都觉得自己牛批），因此在 12 月份开始写了这个 **博客系统**（使用的 SpringBoot + Vue 目前还没写完善，只有简单的展示功能）写了 **一个多月** 才有的目前的雏形。Spring 源码学了 **一个月**，先是跟着 mini spring 走了一遍，然后就是尚学堂的 Spring 源码视频看了一遍，能力有限没有完全吸收，不过也还算受益匪浅（主要就是依赖注入，AOP 的理解更加深入了还有设计模式的使用）最后 **一个月** 做了一个 **后台权限管理系统**。

期间学习了 nginx，docker，CS61B（伯克利数据结构相关课），redis，JDK 集合源码......，当然都没学得怎么深入，不过学习永不停止，总有一天我会掌握^.^

## 学习成果

### 博客系统 + 后台管理系统

> 链接地址：https://blog.reajason.top/

技术栈：SpringBoot + Vue

简简单单贴一张首页的图片，后台管理界面目前就简单的 CRUD，界面交互没有做完善，就不展示了（目前还有点小丑，不过之后我会尽力让它看起来漂亮无比）

![博客首页](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/WhatCouldIDoWhenLearningHalfYearJavaAndHtml/博客首页.png)

### 后台管理系统

> 链接地址：https://blog.reajason.top/oa/admin/index

技术栈：SpringBoot + JSP + JQuery，关于主要写了哪些，可以进网站首页简介查看

- 主页多级菜单栏 + tab 栏基于 iframe 子页面的菜单切换
- 分页器的实现，简单的判断条件，生成不同的样式
- 树形数据结构的渲染，除了递归还是递归

![首页](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/WhatCouldIDoWhenLearningHalfYearJavaAndHtml/后台首页.png)



![用户管理](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/WhatCouldIDoWhenLearningHalfYearJavaAndHtml/用户管理.png)



![角色管理](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/WhatCouldIDoWhenLearningHalfYearJavaAndHtml/角色管理.png)



![角色编辑](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/WhatCouldIDoWhenLearningHalfYearJavaAndHtml/角色编辑.png)



![菜单管理](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/WhatCouldIDoWhenLearningHalfYearJavaAndHtml/菜单管理.png)



![部门管理](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/WhatCouldIDoWhenLearningHalfYearJavaAndHtml/部门管理.png)



![新增需求](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/WhatCouldIDoWhenLearningHalfYearJavaAndHtml/新增需求.png)



![需求查看](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/WhatCouldIDoWhenLearningHalfYearJavaAndHtml/需求查看.png)



![需求编辑](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/WhatCouldIDoWhenLearningHalfYearJavaAndHtml/需求编辑.png)

## 总结与展望

### 总结

1. 自学了这么久，也自己给自己总结了一些学习经验。学习技术的时候不要死磕一个一直学，这个学累就来点别的，比如 Spring 一直看代码看累了，写点前端给自己眼睛舒服舒服。
2. 学习要有输入也要有输出，同时要保持思考的习惯。不要害怕程序报错，往往报错给了你最有力的证明你的错误在哪里。学习会遗忘，因此多看几遍，总会学会，前端我学了三四遍，MySQL 我同样学了三四遍，学 Spring 的时候我也是看了两三家培训机构的视频还有一些书，知识点都抄几遍就记住的，实践的时候脑子里面有东西做起来就快了。
3. 无论做什么不要老是空想，想做什么就去做什么，做成什么样就看你做的时候了，你不做就永远不知道会是什么样，对自己要有信心，之前一段时间玩 LOL 就一直摆烂，最近学习也是增加了自己的信心，我游戏里面走位也越来越自信，心情一下就好了。
4. 学习真的会累，学累了就停下来思考思考学点其他的或者回顾之前的学习的知识或者做点其他感兴趣的事情，这一段时间的思考并不会阻碍你学习的脚步，反而会让你之后的学习的脚步越来越快。就拿我学 Spring 框架那段时间，一直就是框架框架框架的，我感觉学习不到什么真正的技术（框架都封装好了，就学怎么用就完事了），因此我就跑去看了重构，看了Java基础的『八股文』，看了前端如何布局等等。就是回归基础的东西，让自己不那么『基础不牢地动山摇』，自己心里也不好受。

### 展望

1. 希望自己不要停下学习的脚步，一步一个脚印
2. 坚信自己一定会成功（网上总有负面的那种表述和调侃，诸如绝大多数都是普通的人要认命之类的，我认为我们确实要认命，但是我们不能不努力，都是成年人了，自己的命运能掌握的那一块请好好掌握住）
3. 飞机遇难也引发了很多思考，希望大家都身体健康，快快乐乐（保护自己的人身安全和财产安全）

