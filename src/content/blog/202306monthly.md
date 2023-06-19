---
title: 月报
date: '2023-06-19 23:31:27'
categories: [Weekly]
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/2023AnnualWishes_index_img.png
description: '入职的一个月'
---

> time does seem to fly by quickly, especially when we're busy or enjoying ourselves

## Recent Life Status

- 早上六点四十起床做饭（时刻为程序员下岗再就业开饭店做准备），晚上十一点多睡觉 💤（真是美好的作息时间）
- 每天通勤四个小时，上班两小时，下班两小时（等搬家就好了，北京房租就是贵啦）-> [Tweet](https://twitter.com/ReaJason_/status/1660427494330339328)
- 周一追《鬼灭之刃》，周二追《跃动青春》，周天看《天国大魔境》《地狱乐》 -> [Website](https://www.dqsj.top/)
- 入职一个月来基本没怎么打游戏了（公司发的 MacBook Pro 有点爱不释手了）
- 最近听的博客： [《不明白博客》一起探寻真理与答案](https://www.bumingbai.net)


## Work Fine

- 做了一键发版的网页程序
- 为靶场写了 gitlab cd 自动化构建容器镜像
- 为靶场提取了 common 库，方便移植到各个框架
- 使用 Python 脚本为靶场生成 Postman 测试 API
- 写了交付文档靶场测试截图以及攻击流程
- 编写常用的反序列化漏洞框架 Hook 点检测

## Learn Well

- IDEA Remote Debug（远程调试应用程序）
- 了解基于 Java Agent 的 [RASP](https://en.wikipedia.org/wiki/Runtime_application_self-protection) 解决方案
- [Arthas](https://arthas.aliyun.com/doc/) 基本使用（查看运行时类信息）
- JNDI 注入，使用 LDAP，RMI 注入危险类
- Socket 连接（nc）
- 使用 ysoserial 构造常见的 payload


## Struggle With

OSGi 类加载架构下，同接口，不同实现间，因所处类加载器不同导致的 ClassCastException（暂时还没解决）,有时间一定得把类加载器这块狠狠拿下

## Recent Goals

- [ ] 想想办法充分利用一下上下班时间
- [ ] 又有比较长的一段时间没有静下心来看看书了，得看看

## Summary

有大佬的点拨真是一件美事，之前一直纠结于反序列化漏洞攻击防御的实现方案，头头给我详细介绍了目前实现的两种防御手段，一听就懂。最近一直苦于网上的资料不够基础看不懂，头头就给了我一个网上很厉害的大佬博客。

RASP 一种前沿的应用程序保护方案，基于 Java Agent 能做到无侵入式（运行时挂载和卸载）的保护，市场竞品很少，且基本都处于前期拓荒阶段，因此做完善的话完全是一款有市场竞争力的产品。


