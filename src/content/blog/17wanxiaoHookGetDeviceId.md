---
title: Xposed Hook 完美校园获取本机 DeviceId
date: "2021-04-18 23:43:45"
tags: [Notes, Xposed]
categories: [Android]
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17WanXiaoHookGetDeviceId_index_img.jpg
descripion: "简单记录一下完美校园 app 逆向 + Hook 获取 deviceId 生成的方法"
---
> 完美校园自动打卡项目：https://github.com/ReaJason/17wanxiaoCheckin
> 本文使用的所有资源包括成品链接：https://lingsiki.lanzoui.com/b0eklg2ih 密码：2333

## 🤝静态分析

### 🔍查壳

> 查壳工具：[ApkScan-PKID](http://www.legendsec.org/1888.html) 查看 app 是否加固（需要 Java 环境）

如果 app 加固的话需要脱壳才能看到源码，没有加固则最好，在豌豆荚下载了完美校园历史版本发现，5.0.2 版本没有加固，而最新的 5.3.6 版本使用了 360 加固，其他版本有阿里和腾讯加固的都有，不知道他们为什么换这么多壳......，因此本文采取的思路是在 5.0.2 版本中找到 deviceId 的获取方法，然后使用 xp hook 绕壳去 hook 5.3.6 版本的相关代码，也很幸运 5.3.6 版本生成 deviceId 的代码虽然修改了位置，但是还是找到了 hook 出来的办法。

![5.0.2](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17WanXiaoHookGetDeviceId_img/5.0.2.png)

![5.3.6](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17WanXiaoHookGetDeviceId_img/5.3.6.png)



### 🤔分析源码



> 源码查看工具：[jadx](https://github.com/skylot/jadx)
> 把使用方法为打开 bin 目录下的 jadx-gui.bat，然后选择 apk

1. 在搜索文本工具中搜索 `/loginnew`，即可查看有一个匹配值，双击进去，然后右键查看该值 `i` 的用例，也就是哪里用了这个值，也刚好发现一个 `c.i`，双击进入即可发现登录报表的所有参数，基本都在这里出现了

   ![search_loginnew](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17WanXiaoHookGetDeviceId_img/loginnew.png)

   ![find_i](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17WanXiaoHookGetDeviceId_img/loginnew_example.png)

   ![loginreqdata](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17WanXiaoHookGetDeviceId_img/loginreqdata.png)

   ![logindata](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17WanXiaoHookGetDeviceId_img/logindata.png)

2. 我们可以看到这个 `private String deviceId = AppUtils.f(SystemApplication.e());` 这行代码说明了 deviceId 生成的来源，选中 `f` ，右键跳到声明，即可查看对应源码

   ![deviceId_f](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17WanXiaoHookGetDeviceId_img/deviceid_f.png)

   ![deviceid_func](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17WanXiaoHookGetDeviceId_img/deviceid_func.png)

3. 可以看到该类有许多的 get 方法，我们可以通过 hook 这些方法，来获取对应值（不过还得看登录方式是否使用了对应值）

   ![hook_point](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17WanXiaoHookGetDeviceId_img/hook_point.png)

4. 使用 jadx 找到 5.3.6 版本 360 加固后的 app 入口

   ![classloader](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17WanXiaoHookGetDeviceId_img/360.png)



## 🪂Xp Hook



> 环境搭建以及入门：[ [超级详细]Frida Hook和Xposed Hook 再搞Crackme](https://www.52pojie.cn/forum.php?mod=viewthread&tid=1315865&highlight=frida%2Bhook)
> 网上 Xp Hook 的教程还是有一点点可以学习的，可自行搜索学习相应知识

1. 新建项目，打开左侧资源管理设置为 Project，将 api-82 的两个文件放到 app/libs 下

2. 在 app/bulid.gradle 下面的 dependencies 中加入以下代码，然后点击右上角的 Sync

   ```xml
   compileOnly 'de.robv.android.xposed:api:82'
   compileOnly 'de.robv.android.xposed:api:82:sources'
   ```
   
   ![xphook_set1](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17WanXiaoHookGetDeviceId_img/xphook_set1.png)
   
3. 在 AndroidManifest.xml 中加入一下代码

   ```xml
   <meta-data
              android:name="xposedmodule"
              android:value="true" />
   <meta-data
              android:name="xposeddescription"
              android:value="hook 5.3.6 版本完美校园登录参数，包括 deviceId" />
   <meta-data
              android:name="xposedminversion"
              android:value="54" />
   ```
   ![xphook_set2](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17WanXiaoHookGetDeviceId_img/xphook_set2.png)

4. 在 main 文件下创建 assets 文件夹，在其下创建 xposed_init 文件，文件中写 xposed 的入口即 `com.wanxiao.xp_hook.MainHook`（包名 + 类名）

   ![xphook_set3](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17WanXiaoHookGetDeviceId_img/xphook_set3.png)

5. 在 MainActivity 同级目录下创建 MainHook 的 Java class 文件

6. 编写 Hook 代码，当前代码为 Hook 5.3.6 版本的代码，因为需要绕过 360 加固 Hook

   ```java
   // Hook 完美校园
   if (!loadPackageParam.packageName.equals("com.newcapec.mobile.ncp")) {
       return;
   }
   XposedBridge.log("已 HOOK 到完美校园");
   
   // Hook 360加固
   findAndHookMethod("com.stub.StubApp", 
                     loadPackageParam.classLoader,
                     "attachBaseContext", 
                     Context.class, 
                     new XC_MethodHook() {
                         @Override
                         protected void afterHookedMethod(MethodHookParam param) throws Throwable {
                             super.afterHookedMethod(param);
                             //获取到Context对象，通过这个对象来获取classloader
                             Context context = (Context) param.args[0];
                             //获取classloader，之后hook加固后的就使用这个classloader
                             ClassLoader classLoader = context.getClassLoader();
                             hook_param(classLoader, "getAppCode", "appCode: ");
                             hook_param(classLoader, "getDeviceId", "deviceId: ");
                             hook_param(classLoader, "getNetWork", "netWork: ");
                             hook_param(classLoader, "getPassword", "password: ");
                             hook_param(classLoader, "getQudao", "qudao: ");
                             hook_param(classLoader, "getRequestMethod", "requestMethod: ");
                             hook_param(classLoader, "getSms", "sms: ");
                             hook_param(classLoader, "getShebeixinghao", "shebeixinghao: ");
                             hook_param(classLoader, "getSystemType", "systemType: ");
                             hook_param(classLoader, "getTelephoneInfo", "telephoneInfo: ");
                             hook_param(classLoader, "getTelephoneModel", "telephoneModel: ");
                             hook_param(classLoader, "getToken", "token: ");
                             hook_param(classLoader, "getType", "type: ");
                             hook_param(classLoader, "getUnionid", "unionid: ");
                             hook_param(classLoader, "getUserId", "userId: ");
                             hook_param(classLoader, "getUserName", "userName: ");
                             hook_param(classLoader, "getWanxiaoVersion", "wanxiaoVersion: ");
                             hook_param(classLoader, "getYunyingshang", "yunyingshang: ");
                             hook_param(classLoader, "toJsonString", "当前登录方式请求参数: ");
                         }
                     });
   
   
   }
   
   public void hook_param(ClassLoader classLoader, String methodName, String resultName){
       findAndHookMethod(
           "com.wanxiao.rest.entities.login.LoginReqData", classLoader, methodName,
           new XC_MethodHook() {
               @Override
               protected void afterHookedMethod(MethodHookParam param) throws Throwable {
                   String msg = resultName + param.getResult();
                   XposedBridge.log(msg);
                   Log.i("[ 17wanxiaoHook ]", msg);
               }
           }
       );
   
   };
   ```

7. 结果展示

   ![result](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17WanXiaoHookGetDeviceId_img/result.jpg)



## ❄总结

安卓逆向这方面我只是个小小新手，Xp Hook 真的很牛皮，更强大的功能目前还用不上，Frida Hook 测试只能 Hook 5.0.2 版本，5.3.6 版本死活显示多进程，Frida Hook 不到，有机会接触这方面的再继续学习，目前也就这样了。



> 本文仅供交流学习，请勿用于违法用途
