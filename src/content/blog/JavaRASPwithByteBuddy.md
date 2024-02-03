---
title: 使用 Byte Buddy 实现 Java RASP
date: "2024-01-21 19:55:55"
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JavaRASPwithByteBuddy_index_img.png
tags: [Notions]
categories: [Blog]
description: "为什么 Java Agent 的项目很多，网上学习资源却很少"
---

## TL;DR

1. RASP 在代码执行层面进行攻击检测，提供了比 WAF 更准确的攻击检测。
2. Java Agent 拥有修改类字节码的能力以及获取 JVM 中许多信息的能力。
3. 通过下文 RASP 代码实现，你可以使用 Byte Buddy（一个成熟的字节码修改框架）编写几行代码就能实现字节码修改
4. 网上 Java Agent 资源不是特别多，因此我编写了一个 [项目](#总结) 希望能分享相关知识方便学习者快速入门
5. 推荐使用成熟的 [靖云甲 RASP](https://www.boundaryx.com/category/product/adr)  产品加固应用安全

## RASP

RASP 是 [Runtime application self-protection](https://en.wikipedia.org/wiki/Runtime_application_self-protection)（运行时应用自我保护）的缩写，是一种应用程序安全技术。RASP 技术能够在应用程序运行时检测并阻止应用级别的攻击。随着云计算和大数据的发展，应用程序安全越来越受到重视。RASP 技术作为一种新型的安全防护手段，正在逐渐被业界接受并广泛应用。Java RASP 注入到应用程序中可采集到流量信息、堆栈信息、方法参数、对象实例等信息进行攻击检测，误报率比起 [web application firewall (WAF)](https://en.wikipedia.org/wiki/Web_application_firewall) 更低。

在刚一接触这个概念的时候，我就想到了计算机网络中的 [Software-defined networking (SDN)](https://en.wikipedia.org/wiki/Software-defined_networking) 软件定义网络，通过添加新的一层控制层，管理路由器网络流量的转发。RASP 也同理，在 Java 代码中添加一层，管控代码的执行。好比设计模式中的代理模式，也同理于 JavaEE 中 Servlet Filter 设计，Spring Interceptor 设计，属于 AOP 的范畴，只不过 RASP 是基于 Java Agent 实现的 AOP 更加底层，在 Java 应用程序中更具有通用性，可以是 Web 应用也可以是 Desktop 应用。

## Java Agent

Java Agent 拥有在 class 文件加载到 JVM 中拦截修改字节码，也可在运行时对已加载类的字节码做变更，能够获取 JVM 中所有已加载的类，能够获取对象的大小，能将 jar 包使用 BootstrapClassloader 加载等等能力。简而言之，可以让我们在程序运行期间打补丁，可修复程序逻辑 bug，可用于组件升级，可用于漏洞安全补丁等等。

JVMTI 全称 JVM Tool Interface，是 JVM 暴露出来的一些供用户扩展的接口集合。JVMTI 是基于事件驱动的，JVM 每执行到一定的逻辑就会调用一些事件的回调接口（如果有的话），这些接口可以供开发者扩展自己的逻辑。其中就封装了 Java Instrumentation API。Java Agent 是通过 Java Instrumentation API 支持 premain（启动时加载） 和 agentmain（运行时加载）两种方式注入对 JVM 字节码进行修改。

许多开源项目，例如 [SkyWalking(APM 性能监控)](https://github.com/apache/skywalking-java)、[async-profiler(性能分析)](https://github.com/async-profiler/async-profiler)、[Arthas(诊断工具)](https://github.com/alibaba/arthas)、[BTrace(链路追踪工具)](https://github.com/btraceio/btrace) 等等都是使用的 Java Agent 技术，我们可能会有使用到的时候，但是理解其中的实现原理有利于我们更好地使用这些工具。

学习 Java Agent 我们最关心的是如何在指定类方法插入我们的代码，[ASM](https://asm.ow2.io/) 对于字节码的修改提供了完全的支持，不过使用它需要我们对字节码足够了解。[Byte Buddy](https://bytebuddy.net/#/) 对 ASM 进行了封装，为我们屏蔽了字节码的修改相关细节，正符合我们 Java 初学者的胃口。

## RASP 实现

> JDK8 + IDEA + Gradle + Byte Buddy

前面简单介绍了一下相关技术，以下 RASP 实现我会面向一个 Java 初学者来编写（我也才刚学两年的 Java），因此它需要你：

1. 使用过 Java 编写过程序，Hello World 行，不过最好是 Web 应用
2. 使用过 IDEA 编写过 Java 项目（开发环境统一，好查问题）
3. 处在良好的网络环境下（编程开发往往最劝退的地方正是由于网络环境的问题导致一直卡在搭建开发环境）
4. **不必**拥有网络安全相关的知识

此 RASP 实现的主要实现如下一个功能：

1. 支持本地命令执行的获取和检测

### 项目初始化

1. 打开 IDEA，使用如下仓库进行初始化 `https://github.com/JAgentSphere/bytebuddy-agent-demo.git`

    ![idea_init](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JavaRASPwithByteBuddy_img/idea_init.png)

2. 等待 IDEA 初始化完成，设置项目使用 JDK8，然后打开 Gradle 面板，执行 jar 命令打包程序

    ![project_set](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JavaRASPwithByteBuddy_img/project_set.png)

    ![project_build](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JavaRASPwithByteBuddy_img/project_build.png)

3. 打开命令行，前往 test 目录下执行如下命令即可看到预期结果，可知 Java Agent 启动时间是在应用之前的

    ![project_run](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JavaRASPwithByteBuddy_img/project_run.png)

4. 访问 `http://localhost:8080/index/shell?cmd=whoami` 即可回显当前登录电脑登录用户名
    ![localhostcmd](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JavaRASPwithByteBuddy_img/localhostcmd.png)

### 添加本地命令执行检测

我们在 SpringBoot 的 demo 程序中实现了一个命令执行的用例

![cmd_impl](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JavaRASPwithByteBuddy_img/cmd_impl.png)

如果需要对其检测，那么我们需要对 `java.lang.Runtime#exec(java.lang.String)` 进行拦截。我们回到 Main 入口类，添加如下代码：

![cmd_entry](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JavaRASPwithByteBuddy_img/cmd_entry.png)

这段代码的含意就是，hook 类名称等于 `java.lang.Runtime` 并且方法名为 `exec` 且参数个数为 1 个，对其执行 `RuntimeExecInterceptor` 的拦截器字节码修改逻辑（即在方法执行前添加一个输出）。

```java
agentBuilder.type(ElementMatchers.named("java.lang.Runtime"))
    .transform(((builder, typeDescription, classLoader, module, protectionDomain) ->
            builder.visit(
                    Advice.to(RuntimeExecInterceptor.class)
                            .on(ElementMatchers.named("exec")
                                    .and(ElementMatchers.takesArguments(1)))
            ))).installOn(inst);
```

执行 Gradle 面板的 jar 命令进行代码编译和打包，然后继续前往 test 目录下执行 `java -jar -javaagent:agent.jar demo.jar`

此时每一次访问 `http://localhost:8080/index/shell?cmd=whoami`，在控制台都会打印一句话。

![method_invoke](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JavaRASPwithByteBuddy_img/method_invoke.png)

查看 test/weaving 目录下，可查看字节码修改后的类，可知符合修改预期，本来这个方法是没有这一句的，我们使用 Java Agent 将这个语句打印给成功注入进去了，之后我们就需要考虑到如何获取到执行的这个参数了，Byte Buddy 已经为我们做好了这件事情了~

![dump_class](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JavaRASPwithByteBuddy_img/dump_class.png)

这个 `@Advice.AllArguments` 注解放在这里，Byte Buddy 会把方法的参数都放入到 args 里面，有方法签名可知，args[0] 就是我们需要的命令参数，编译之后执行，即可看到命令参数的打印。

![cmd_args](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JavaRASPwithByteBuddy_img/cmd_args.png)

![pring_args](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/JavaRASPwithByteBuddy_img/print_args.png)

拿到参数我们就能执行一些我们的检测算法了

```java
private static class RuntimeExecInterceptor {
    @Advice.OnMethodEnter
    public static void interceptor(@Advice.AllArguments Object[] args) {
        System.out.println("Runtime.exec is invoked");
        String command = (String) args[0];
        System.out.println("Runtime.exec arg is " + command);

        // 方法参数的判断, 执行 whoami 会在这儿抛出异常
        if ("whoami".equals(command)) {
            throw new SecurityException("the command whoami is prohibited in this env");
        }

        // 获取堆栈执行上下文进行特定的判断
        List<String> stackTraces = Arrays.stream(new Throwable().getStackTrace()).limit(100)
                .map(StackTraceElement::toString).collect(Collectors.toList());

        // 所有的命令都会被阻断，因为堆栈中包含了这个
        for (String stackTrace : stackTraces) {
            if (stackTrace.contains("com.jas.web.demo.IndexController.cmd")) {
                throw new SecurityException("exec command with dangerous stack");
            }
        }
    }
}
```

## 总结

Java RASP 因为其拥有比 WAF 更实时和准确的检测能力和支持内存马清除的特性，目前越来越被人熟知。其实其他现在很多语言也有了对应的 RASP 实现。

当前简易的 Demo 只适合用来测试，例如此 Demo 不允许在 interceptor 中引用自定义的类，代码执行过程中会报 `ClassNotFoundException`，对于一个成熟的 Java Agent 目前还是不够的，如果想深入学习可以前往 [bytebuddy-agent-quickstart](https://github.com/JAgentSphere/bytebuddy-agent-quickstart)，在这里我会分享一个工程化 Agent 需要的所有东西（我所知道的，我也目前在学习中，hhh），例如代码的设计封装原理细节、日志系统、插件系统、更新机制、自我观测（指标采集）等等，可能偶尔分享一些特定场景下的漏洞攻击检测。

## 延伸阅读

- [从 CVE-2023-49070 看 RASP 的 0Day 防御（去年写的 RASP 相关文章）](https://mp.weixin.qq.com/s/yfrz9cIsindPZMYRE7Buww)
- [美团 RASP 大规模研发部署实践总结](https://tech.meituan.com/2024/01/19/runtime-application-self-protection-practice-in-meituan.html)
- [JVM 源码分析之 javaagent 原理完全解读](https://www.infoq.cn/article/javaagent-illustrated)
