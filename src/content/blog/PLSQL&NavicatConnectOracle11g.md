---
title: PL/SQL 以及 Navicat 连接 Oracle11G
tags: [Tool]
categories: [Notes]
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/PLSQL&NavicatConnectOracle11g_index_img.jpg
date: "2021-08-26 09:35:00"
description: "熟练地使用已有的工具，能有效地提高生产效率"
---
## PL/SQL Developer

### ⌛下载

{% note success%}
[官网下载地址，点击前往](https://www.allroundautomations.com/products/pl-sql-developer/free-trial/)
{% endnote %} 

无脑推荐官网下载，根据自己电脑来就行，32 位就 32 位，64 位就 64 位

### 🔓授权

{% note info%}
授权码来源于网络
{% endnote %} 

**Product Code:** `ke4tv8t5jtxz493kl8s2nn3t6xgngcmgf3`

**Serial Number:** `264452`

**Password:** `xs374ca`

### ⚙配置

{% note warning%}
建议 PLSQL、instantclient 与 服务器 Oracle 版本一致
{% endnote %} 

根据所需要连接的 Oracle 版本来选择自己所需要下载的版本（下载需要账号，注册就行），这是一种不安装客户端的形式，稍微轻便一点，不过有些功能会没有，酌情使用，也可使用高版本的位数相同的客户端下载。

- [32 位 instant-client 下载地址](https://www.oracle.com/database/technologies/instant-client/microsoft-windows-32-downloads.html)
- [64 位 instant-client 下载地址](https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html)

由于我需要连接的服务器安装的是 64 位 Oracle 11g 的版本所以我下载的是 instantclient-basic-windows.x64-11.2.0.4.0.zip

打开 PL/SQL Developer，登录的时候点取消，进入设置，如图配置 Oracle 主目录以及 OCI 库的位置为下载解压的目录路径，应用并重启

![plsql setting](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/PLSQL&NavicatConnectOracle11g_index_img/plsql.png)

### 🎯连接

使用用户名、密码和数据库（ip:port/servername）进行连接（如果连接不上根据报错寻找解决办法，一般情况就是下载的 instant-client 与服务器的版本不匹配，显示未授权的协议）

如果查询的时候乱码则需要配置 Windows 环境变量

```sql
-- 查询数据库版本
select * from v$version;

-- 查询数据库所使用的编码
select userenv('language') from dual;
```

环境变量名：NLS_LANG

环境变量值：查询编码到的编码（我的是：AMERICAN_AMERICA.ZHS16GBK）

重启就不会乱码了🤗

## Navicat Premium 15

### ⌛下载

{% note success%}
[官网下载地址，点击前往](https://www.navicat.com.cn/download/navicat-premium)
{% endnote %} 

无脑推荐官网下载，根据自己电脑来就行，32 位就 32 位，64 位就 64 位

### 🔓授权

教程这边请👉：[Navicat Premium 15安装教程(完整激活版) ](https://cloud.tencent.com/developer/article/1804255)

### ⚙配置

{% note success%} 

我使用 PL/SQL 上面下载用的 OCI 并不可行，找到可行的 [Oracle11g OCI 下载](https://lingsiki.lanzoui.com/iWlWkt9fwdi) 

{% endnote %} 

工具-选项-环境-OCI 环境选择下载解压的 oci.dll 文件重启即可

![navicat setting](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/PLSQL&NavicatConnectOracle11g_index_img/navicat.png)

### 🎯连接

新建 Oracle 连接，主机填写 ip 地址，账号密码，服务名，测试链接
