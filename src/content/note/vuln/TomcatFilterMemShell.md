---
title: "Filter 内存马注入"
type: "vuln"
date: "2023-06-11 12:16:51"
description: "以 Tomcat8 为例注入 Filter 内存马"
---

## 内存马简介

> 这个啊，这个就是传说中的「大佬，教教我黑网站」，把内存马打进去就真是黑网站了

内存马是区别于 WebShell 的一种无需文件落地即可控制目标站点的木马后门。

## Filter 简介

Filter 是 JavaEE 中一个重要的 Web 组件，用于在请求到达 Servlet 前进行过滤操作，通过一个一个 Filter 组合成 FilterChain 链式执行。由于其 doFilter 函数能获取到请求对象和响应对象，因此可用于编写后门代码。

```java
public interface Filter {
    void init(FilterConfig config) throws ServletException;

    void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException;

    void destroy();
}
```

## 内存马注入实战

第一步当然是找 RCE 漏洞，可以是文件上传打 WebShell，或者表达式注入、模板注入、反序列化、JNDI 等。（为方便演示，假设咱能直接传 jsp 文件上去）

## 
