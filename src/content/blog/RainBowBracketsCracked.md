---
title: 记录 Rainbow Brackets 插件破解
date: "2024-03-08 21:55:55"
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/RainBowBracketsCracked_index_img.png
tags: [Cracked, Java Agent]
categories: [Blog]
description: "Java Agent 的一次小小实践"
---

## 心血来潮

用 IDEA 代码写多了，界面看腻了，主题也玩腻了，突然想起来有一个给成对括号加颜色的插件，就是叫作 [Rainbow Brackets](https://plugins.jetbrains.com/plugin/10080-rainbow-brackets)。因为之前一直用 [ja-netfilter](https://zhile.io/2021/11/29/ja-netfilter-javaagent-lib.html) 破解 IDEA，所以 IDEA 里面很多付费插件也能一并破解，我熟练地去 [3.jetbra.in](https://3.jetbra.in/) 找到激活码输进去了，结果显示了下图，说检测到 ja-netfilter 破解 IDE 所以不准用付费功能，其实我并没有多么想使用付费功能，只是想把这个红色提示语变成绿色的，于是就开始了逆向之旅。

![using ja-netfilter](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/RainBowBracketsCracked_img/using-ja-netfilter.png)

## 反编译

由于有了 Java Agent 的经验（Java Agent 可在应用启动前做字节码修改改变程序逻辑），因此在启动前修改这个判断逻辑是一定能做到的。

破解第一步试图拿到源码，查看哪里做了检测，使用 IDEA 丢进去一看，就傻眼了，这混淆姿势我都想学了，Java 代码全部扁平化，直接包名都给干掉了，然后全是这种字符。

![source-code](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/RainBowBracketsCracked_img/source-code.png)

里面很多文件都是有 `Class.forName` 想调用某个类名的方法，我就点进去，恍然大悟，在 `ਧભ.class` 中看到了下面这些加密字符串，这块看起来就特别令人好奇都是些啥。

![decoded-str](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/RainBowBracketsCracked_img/decoded-str.png)

这块也不是特别有必要去逆向字符串加解密，因为我们有伟大的 Remote JVM 调试功能。可参考 [图文并茂教你学会使用 IntelliJ IDEA 进行远程调试](https://zhuanlan.zhihu.com/p/95098721)，配合 ChatGPT 啥的大语言模型学习更迅速哦。由于 IDEA 不能自己调试自己，所以我使用 PyCharm 安装了 Rainbow Brackets 插件并开启了调试。

1. 在 PyCharm 中的 vmoptions 里面加了一行 -agentlib:jdwp=transport=dt_socket,server=n,address=*:5005,suspend=y，记住加了之后如果不执行第二步打开调试是打不开 PyCharm 哦，所以调试完记得去掉。
2. 打开 IDEA，使用 Listen to remote JVM 模式，在 `ਧભ.class` 最下面一个变量打断点，开启 PyCharm 并随便打开一个项目，则可看到下面这些变量

![debug-decoded-str](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/RainBowBracketsCracked_img/debug-decoded-str.png)

因为这个插件混淆程度太强了，在 IDEA 中也无法搜索 Jar 中的代码，因此就需要使用专门用来反编译 Java 代码的利器 —— [jadx](https://github.com/skylot/jadx)。

大约只需要这三个功能我们就足够了，第一个就是全文搜索文本，第二个就是查看当前选中哪儿有引用。第三个就是双击选中跳到声明处。

![jadx-global-text-search](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/RainBowBracketsCracked_img/jadx-global-text-search.png)

![jadx-find-usage](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/RainBowBracketsCracked_img/jadx-find-usage.png)

一层层往上找，最终发现这儿用到了，You are using ja-netfilter to crack the IDE. To activate this plugin pls remove it from your IDE class path 这句话。双击这个 `m1141` 跳转到它的声明。

![m1141](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/RainBowBracketsCracked_img/m1141.png)

## 核心逻辑

### C0507.m83()

判断了是否能调用 `com.janetfilter.core.utils.StringUtils.isEmpty("")`，如果调用成功就为 true。这个就是尝试执行 ja-netfilter 中的代码，看有没有引用 ja-netfilter。

破解方式：让这个方法调用报错才能让其返回 false

### C0437.m470()

调用了 `com.intellij.diagnostic.VMOptions.getUserOptionsFile()` 获取 vmoptions 文件，然后判断文件内容，里面是否包含了 `ja-netfilter`、`netfilter`、`javaagent`、`pojie` 和 `破解` 字符串，只有都不命中才返回 false。

破解方式：改变 `com.intellij.diagnostic.VMOptions.getUserOptionsFile` 的返回值，将其返回默认的文件路径即可，这样实际用的是我们自定义的 vmoptions，在这儿让它去默认的 vmoptions 里面找，当然就找不到这些字符串了。

![m1141-source-code](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/RainBowBracketsCracked_img/m1141-source-code.png)

## 第一次尝试破解

使用我之前做的一个小项目 [bytebuddy-agent-demo](https://github.com/JAgentSphere/bytebuddy-agent-demo)，啪，很快啊，代码写好了，我们赶紧试试吧。

获取默认 vmoptions 配置文件的方法直接借鉴的 `com.intellij.diagnostic.VMOptions.getUserOptionsFile` 源码里面的最后，使用 `PathManager.getCustomOptionsDirectory()` + `getFileName`

```java
@Internal
public static @Nullable Path getUserOptionsFile() {
    String vmOptionsFile = System.getProperty("jb.vmOptionsFile");
    if (vmOptionsFile == null) {
        return null;
    } else {
        Path candidate = Path.of(vmOptionsFile).toAbsolutePath();
        if (!PathManager.isUnderHomeDirectory(candidate)) {
            return candidate;
        } else {
            String location = PathManager.getCustomOptionsDirectory();
            return location == null ? null : Path.of(location, getFileName());
        }
    }
}
```

```java
/**
 * 在 getUserOptionsFile 获取配置文件时返回默认的文件位置
 * <p>
 * 在 StringUtils.isEmpty 方法中，如果不是 com.janetfilter 包下的类调用，则抛出异常
 */
private static void byPassJavaAgent(AgentBuilder agentBuilder, Instrumentation inst) {
    agentBuilder.type(ElementMatchers.named("com.intellij.diagnostic.VMOptions"))
            .transform(((builder, typeDescription, classLoader, module, protectionDomain) ->
                    builder.visit(Advice.to(VMOptionsInterceptor.class).on(ElementMatchers.named("getUserOptionsFile"))))
            ).installOn(inst);

    agentBuilder.type(ElementMatchers.named("com.janetfilter.core.utils.StringUtils"))
            .transform(((builder, typeDescription, classLoader, javaModule, protectionDomain) ->
                    builder.visit(Advice.to(StringUtilsInterceptor.class).on(ElementMatchers.named("isEmpty")))))
            .installOn(inst);
}

public static class StringUtilsInterceptor {
    @Advice.OnMethodEnter
    public static void interceptorBefore(@Advice.AllArguments Object[] args,
                                            @Advice.Origin("#m") String methodName) {
        if ("isEmpty".equals(methodName)) {
            Object arg = args[0];
            if (arg != null && arg.toString().isEmpty()) {
                if (!new Throwable().getStackTrace()[2].getClassName().startsWith("com.janetfilter.")) {
                    throw new RuntimeException("fuck you");
                }
            }
        }
    }
}

public static class VMOptionsInterceptor {
    @Advice.OnMethodExit
    public static void interceptor(@Advice.Return(readOnly = false) Path ret) {
        try {
            if (new Throwable().getStackTrace()[2].getClassName().startsWith("jdk.internal.reflect")) {
                String fileName = (String) Class.forName("com.intellij.diagnostic.VMOptions").getDeclaredMethod("getFileName").invoke(null);
                String location = (String) Class.forName("com.intellij.openapi.application.PathManager").getDeclaredMethod("getCustomOptionsDirectory").invoke(null);
                ret = Paths.get(location, fileName);
            }
        } catch (Exception e) {
            // ignore
        }
    }
}
```

在 vmoptions 中 ja-netfilter **之前** 加入我们的 javaagent，启动，例如下方的 vmoptions 文件节选

```java
-javaagent:/Users/reajason/IdeaProjects/bytebuddy-agent-demo/test/rainbow-brackets-cracked.jar
-javaagent:/Users/reajason/ReaJason/jetbra/ja-netfilter.jar=jetbrains
```

启动之后显示了一个 There is no valid license in your account.

![first-cracked-resutl](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/RainBowBracketsCracked_img/first-cracked-resutl.png)

起初我以为我登了账号所以显示，我就把我 IDE 的账号给退掉了，还是这样，看到这个 license 我就想起来之前有一块代码里面有 license 相关的东西。

![license-source-code-place](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/RainBowBracketsCracked_img/license-source-code-place.png)

![debug-liscense-decoded-str](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/RainBowBracketsCracked_img/debug-liscense-decoded-str.png)

经过不懈的努力，反复调试，我终于找到了华点！它判断了我的过期时间是不是大于 60 天，目前的激活码默认到了 2026 年，肯定是寄了。

![license-source-code](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/RainBowBracketsCracked_img/license-source-code.png)

调试的方法就是傻傻地找个地方打断点然后利用反射 API 看里面值的状态，如下图，查看证书过期时间

```java
Class.forName("com.intellij.ui.LicensingFacade").getDeclaredMethod("getLicenseExpirationDate").invoke(Class.forName("com.intellij.ui.LicensingFacade").getDeclaredMethod("getInstance").invoke(null))
```

![debug](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/RainBowBracketsCracked_img/debug.png)

## 第二次破解

咱暴力一点，直接在调用 `com.intellij.ui.LicensingFacade.getLicenseExpirationDate` 只给它返回当前时间 50 天的时间。

```java
/**
* 设置证书过期时间为 50 天，绕过大于 60 天的检测
*/
private static void byPassLicense(AgentBuilder agentBuilder, Instrumentation inst) {
    agentBuilder.type(ElementMatchers.named("com.intellij.ui.LicensingFacade"))
            .transform((builder, typeDescription, classLoader, javaModule, protectionDomain) ->
                    builder.visit(Advice.to(LicenseExpirationInterceptor.class).on(ElementMatchers.named("getLicenseExpirationDate"))))
            .installOn(inst);
}

public static class LicenseExpirationInterceptor {
    @Advice.OnMethodExit
    public static void exit(@Advice.Return(readOnly = false) Date ret) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_MONTH, 50);
        ret = calendar.getTime();
    }
}
```

在编译后，重启 PyCharm，芜湖行了，付费功能也能用了~（主要是变绿了，hhh）

![second-cracked-result](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/RainBowBracketsCracked_img/second-cracked-result.png)
![paid-feature](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/RainBowBracketsCracked_img/paid-feature.png)

成品代码位于 [bytebuddy-agent-demo/rainbow-brackets-2024.2.1](https://github.com/JAgentSphere/bytebuddy-agent-demo/tree/rainbow-brackets-2024.2.1)

成品位于 [rainbow-brackets-cracked.jar
](https://github.com/JAgentSphere/bytebuddy-agent-demo/releases/tag/rainbow-brackets-2024.2.1)

唯一需要注意的就是这个破解插件必须放在 ja-netfilter 前面，不然就会报下面的错，暂时还没解决以及没弄懂产生的原因

```java
-javaagent:/Users/reajason/ReaJason/jetbra/rainbow-brackets-cracked.jar
-javaagent:/Users/reajason/ReaJason/jetbra/ja-netfilter.jar=jetbrains
```

![transform-fail](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/RainBowBracketsCracked_img/transform-fail.png)

## 总结

逆向成就感始终没有开发的成就感多，开发一个小功能就很快有成就感，不过成就感似乎会随着项目开发周期慢慢递减，目前我的技术逆向全凭运气，没点运气，就卡住，然后不搞了，不过偶尔玩玩逆向还是挺好玩的。

前前后后花费了大概两周的时间吧，中间走了很多弯路，可以说这是第二次做逆向吧，第一次是做小红书逆向的时候，那是玩 JS，这次 Java 中一上来混淆确实吓了一跳。总得来说还不是很熟悉，如果有更好的调试方式和逆向姿势，欢迎一起交流学习。希望有大佬能教教过 CF。
