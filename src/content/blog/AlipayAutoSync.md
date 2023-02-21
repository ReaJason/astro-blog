---
title: 支付宝多账号同步
tags: [Script]
categories: [AutoJs]
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/AlipayAutoSync_index_img.jpg
date: "2020-11-7 09:35:00"
description: "主要实现功能为支付宝多账号切换 + 进入运动进行步数同步"
---

本脚本所使用的autojs版本为 —> [Auto.js_4.1.1 Alpha2](https://lingsiki.lanzoui.com/in80Mi4ve3a)
实现原理：利用三星健康管理刷三星健康的步数，然后把三星健康的步数同步到每一个小号上


### 一、基本功能

1. 支付宝刷步数
2. 支付宝账号切换
3. 运动同步以及捐步

### 二、代码实现

#### 1、关闭支付宝

```javascript
/**
 * 关闭支付宝函数
 */
function closeAlipay(){
    appName = app.getPackageName('支付宝')
    app.openAppSetting(appName)
    sleep(1000)
    var obj = text('结束运行').findOne(5000)
    clickCenter(obj)
    var btn = idContains('button1').findOne(1000)
    if (btn){
        btn.click()
    }
    console.log("支付宝关闭成功！\n开启任务")
}
```

#### 2、支付宝刷步数

```javascript
/**
 * 利用三星健康 + 三星健康管理实现支付宝刷步数
 * 环境搭建（Root手机）：
 * 1、下载刷步数三件套（https://lingsiki.lanzoui.com/b0ejfe25a）。
 * 2、edxp激活应用变量模块，并且设置三星健康、支付宝和三星健康管理模拟机型为三星型号手机。
 * 3、进入三星健康设置-关于三星健康点击版本号十次开启开发者模式-然后进入数据权限开启支付宝和三星健康管理的所有权限。
 * 4、进入支付宝的支付宝运动-右上角三点进入设置，开启记录运动数据。
 * 5、保持三星健康在后台，打开三星健康管理增加步数，进入三星健康等一会儿即可同步步数，最后关闭重启支付宝，进入运动查看同步情况
 * 6、若失败可能是机型伪装的问题，也有可能是第一天刷步数可能延迟会有点大，第二天以后一般都是秒同步的
 * @param {步数=count * 12000} count 
 */

function steps(count) {
    launchApp('三星健康');
    sleep(1000);
    sleep(1000);
    app.launch("com.samsung.android.app.health.dataviewer");
    idContains("floatingActionButton").waitFor()
    sleep(1000)
    sleep(1000)
    for (let index = 0; index < count; index++) {
        idContains("floatingActionButton").findOne().click()
        sleep(500)
        click(800, 1750)
        sleep(500)
    }
    launchApp('三星健康');
    text('主页').waitFor();
    var obj = idContains('goal').findOne()
    clickCenter(obj);
    sleep(5000)
    while (1){
        step = idContains('current_steps').findOne().text()
        if (step != '0'){
            console.log("当前刷步数为：" + step)
            return step;
        }
    }

}
```

#### 3、支付宝登录

```javascript
/**
 * 支付宝登录函数
 * @param {账号} accont 
 * @param {密码} key 
 */
function login(accont, key) {
    // 进入支付宝密码登录界面
    app.startActivity(app.intent({
        action: "VIEW",
        data: "alipayqr://platformapi/startapp?appId=20000008",
    }));
    textMatches("换个账号登录").findOne(5000)
    click("换个账号登录")
    sleep(400)
    setText(0, accont);
    textMatches("下一步").findOne(5000)
    click("下一步")
    textContains("换个方式登录").waitFor()
    var obj = textMatches(/短信验证码登录|指纹登录|换个方式登录/).findOne().text()
    if (obj == "短信验证码登录" || obj == "指纹登录") {
        sleep(500)
        textMatches(/换个验证方式|换个方式登录/).findOne()
        clickCenter(text("换个方式登录").findOne(2000))
        clickCenter(text("换个验证方式").findOne(2000))
        text("密码登录").findOne()
        sleep(400)
        while (!click("密码登录")) { }
        sleep(200)
        setText(0, accont);
        sleep(200);
        setText(1, key);
        sleep(200)
        idContains("loginButton").findOne().click()
        console.log(accont, "登录成功")
    } else {
        sleep(400)
        setText(1, key);
        sleep(400)
        idContains("loginButton").findOne().click()
        console.log(accont, "登录成功")
    }
}
```

#### 4、步数同步

```javascript
/**
 * 进入支付宝运动步数同步以及捐步
 */
function go_sports() {
    sleep(2000)
    app.startActivity({
        data: "alipayqr://platformapi/startapp?saId=20000869"
    })
    textContains("走路线").waitFor();
    swipe(device.width / 9 * 8, device.height / 3, device.width / 9 * 8, device.height / 3 * 2, 500)
    sleep(5000)
    var obj1 = text('去捐步').findOne(1000)
    if (obj1 != null){
        clickCenter(text('去捐步').findOne())
        sleep(3000)
        text('立即捐步').findOne()
        sleep(200)
        while (!click("立即捐步")) {}
        console.log('捐步成功')
    }else{
        console.log('已经捐完步数了')
    }
}
```

#### 5、进入蚂蚁森林

```javascript
/**
 * 进入蚂蚁森林
 */
function enterForest(){
    sleep(2000)
    app.startActivity({
        data: "alipayqr://platformapi/startapp?saId=60000002"
    })
    sleep(8000)
}
```

### 三、完整代码

下载链接：[GitHub地址链接](https://github.com/ReaJason/AutoJsScripts/blob/master/%E6%94%AF%E4%BB%98%E5%AE%9D%E5%A4%9A%E8%B4%A6%E5%8F%B7%E5%88%87%E6%8D%A2%E6%AD%A5%E6%95%B0%E5%90%8C%E6%AD%A5%E8%84%9A%E6%9C%AC.js)

### 四、运行效果

<iframe height="400" width="500" src="//player.bilibili.com/player.html?aid=670137563&bvid=BV17a4y1s7nP&cid=253887490&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

### 五、注意事项

1. 安装autojs之后，点击右小角新建文件，将完整代码粘贴进去，开启无障碍模式即可运行
2. 使用时修改小号账号和密码，以及大号账号和密码即可
3. 每一部手机的脚本运行效果可能会不一样，因为软件的局限性
4. 可以根据autojs的文档自己编写脚本 —> [AutoJs-Docs](https://hyb1996.github.io/AutoJs-Docs/#/)

