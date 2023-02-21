---
title: 完美校园自动打卡
tags: [Script]
categories: [Python]
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17wanxiaoCheckInSCF_index_img.jpg
date: "2021-03-19 23:00:00"
description: "今天你打卡了吗？"
---
> 项目地址：https://github.com/ReaJason/17wanxiaoCheckin

## 🌈使用方法

### 1、新建云函数

![](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17wanxiaoCheckInSCF/搜索云函数.png)

![](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17wanxiaoCheckInSCF/新建云函数1.png)

### 2、上传 SCF 包

本地上传 zip 包（17wanxiaoCheckin-SCF v\*.\*.zip：[蓝奏云](https://lingsiki.lanzoui.com/b0ekhmcxe)，密码：2333）

![](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17wanxiaoCheckInSCF/新建云函数2.png)



### 3、触发器配置

自定义创建 — 触发周期：自定义触发 — Cron 表达式：0 0 6,14 * * * * — 完成 — 立即跳转

![](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17wanxiaoCheckInSCF/设置触发器.png)



### 4、超时设置

函数管理 — 函数配置 — 编辑 — 执行超时时间：900 — 保存

![](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17wanxiaoCheckInSCF/编辑云函数.png)

![](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17wanxiaoCheckInSCF/编辑云函数2.png)



### 5、配置文件

- 整个 json 文件使用一个 `[]` 列表用来存储打卡用户数据，每一个用户占据了一个 `{}`键值对，初次修改务必填写的数据为：`phone`、`password`、`device_id`（获取方法：[蓝奏云](https://lingsiki.lanzoui.com/iQamDmt165i)，下载解压使用）、健康打卡的开关（根据截图判断自己属于哪一类[【1】](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17wanxiaoCheckInSCF/one.png)、[【2】](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17wanxiaoCheckInSCF/two.png)），校内打卡开关（有则开），推送设置 `push`。
- 关于 `post_json`，如若打卡推送数据中无错误，则不用管，若有 null，或其他获取不到的情况，则酌情修改即可，和推送是一一对应的。
- 如果多人打卡，则复制单个用户完整的 `{}`，紧接在上个用户其后即可。

- 【第一次使用推荐 QQ 邮箱推送，数据推送全面】

![](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17wanxiaoCheckInSCF/配置文件编写.png)



### 6、测试部署

若弹框【检测到您的函数未部署......】选是 — 查看执行日志以及推送信息（执行失败请带上执行日志完整截图反馈）

![](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17wanxiaoCheckInSCF/测试代码.png)



### 7、检测成功

- 第一类健康打卡成功结果：`{'msg': '成功', 'code': '10000', 'data': 1}`，显示打卡频繁也算
- 第二类健康打卡成功结果：`{'code': 0, 'msg': '成功'}`
- 校内打卡成功结果：`{'msg': '成功', 'code': '10000', 'data': 1}`
- 仔细查看打卡的数据，如果有值为 null 的，可能是因为打卡数据无法自动填写，请在配置文件中添加该项的赋值
- 由于前面使用软件获取了 device_id，所以请使用支付宝小程序查看打卡结果是否记录上去，以免手机登录使用的 device_id 失效

### 8、表格数据 None

- 找到并记住自己值为 None 的选项，并记住此 propertyname，我们需要修改 value 为我们所填写的信息，有多少就修改多少

![](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17wanxiaoCheckInSCF/查看表格.png)

- 打开第一行推送数据，找到与之对应的推送数据

![](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17wanxiaoCheckInSCF/查看推送.png)

- 在第二行中查找推送数据，propertyname 下的 checkValue 为我们所能填写的值

![](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17wanxiaoCheckInSCF/获取值.png)

- 最后修改配置文件，第一类健康打卡则在 one_check 下的 post_json 下修改，校内即校内下面的

![](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17wanxiaoCheckInSCF/修改配置.png)



## 📜FQA

- 如果有问题，这边请 [GitHub](https://github.com/ReaJason/17wanxiaoCheckin#fqa)，或进群反馈 [交流群](https://github.com/ReaJason/17wanxiaoCheckin-Actions/issues/30)
