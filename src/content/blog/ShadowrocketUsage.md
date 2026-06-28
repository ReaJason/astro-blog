---
title: Shadowrocket 小火箭使用指南
date: "2026-06-24 00:57:00"
tags: [Skill]
categories: [macOS, iPhone]
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/ShadowrocketUsage_index_img.png
description: "工欲善其事，必先利其器之保持网络畅通"
---

## 前言

大二的时候在潜心研究怎么玩安卓破解软件的时候，看到别人说什么油管、ins、推特啥的，还有谷歌账号当时就学会了用老王和蓝灯这种手机 VPN 软件，于是注册了谷歌、油管、ins 还有推特账号，而电脑只是用来玩英雄联盟。

后来到了大三，学习编程之后电脑上就有了一些科学上网需求，下载源啥的还是用的镜像源，只是需要用用 Google 搜索搜一些国内搜索引擎不好搜的东西，于是就下载了 [V2rayNG](https://github.com/2dust/v2rayNG) 同时手机上也用上了这个软件，就网上到处找免费的节点用，误打误撞就找到一个 TG 群里面大佬每次都会分享一些机场的订阅节点或者是 VPN 里面提取的节点，超级好用。不过并不知道怎么去配置 V2ray 内核相关的配置，看了一些视频和教程也不太能理解，经常开全局和关闭代理来回切换。最常犯的错误就是不关全局或者代理，就将电脑关机，下一次开机代理那里不会清掉，就会导致电脑无法上网还需要去手动清理一下代理设置。

后面玩起了 AdGuard 这种去广告应用了解到一些分流规则，并且也接触到了 Clash 能直接配置分流规则的代理内核，电脑就用 Clash for Windows，手机就用 Clash for Android，至于大佬分享的节点配置，直接用那种在线的订阅转换工具转成 Clash 订阅用。

毕业的第三年（2023 年），入职了现在的公司，第一次用上 macOS，当时在 macOS 上用的多的 Clash 应用是 ClashX，而手机在赚了第一桶金给女朋友买了 iPhone14 Pro 就顺利继承了她大学时候买的 iPhone12 Pro 一直用到现在，这个时候就学会用网上免费的已购买小火箭的美区 ID 登陆商店下载 iPhone 上的 Shadowrocket 了。

2023 年底 Clash 删库跑路变成了 Mihomo，这段时间我还是没有节点订阅的付费意识，还是在网上淘节点用，在 2024 年初写了 [ReaJason/Clash-Butler](https://github.com/ReaJason/Clash-Butler) 才第一次开始研究 Clash 的分流规则以及一些详细的配置信息。电脑端的代理软件尝试过 [ClashX.Meta](https://github.com/MetaCubeX/ClashX.Meta)、[Sparkle](https://github.com/xishang0128/sparkle)、[sing-box](https://github.com/SagerNet/sing-box)，最后停留在了 [Clash Verge](https://github.com/clash-verge-rev/clash-verge-rev)。

手机上的 Shadoweocket 一直没研究过配置，有时候遇到网络问题就关掉代理，或者换代理模式开全局啥的。直到最近升级了 macOS 27 Beta 版本的系统，Clash Verge 部分界面无法展示并且整个客户端也卡卡的，Clash 之前还有一些奇怪的症状，比如换了配置迟迟没有加载导致网络不可用，测速有时候全是 timeout 过了一会儿才能正常测速像是网络迟迟无法连上，TUN 模式下和 OpenVPN 无法共存，一气之下电脑也换成了 Shadowrocket 配置好了之后就再也没出现过之前 Clash 那些问题了。**有时候花一点点时间研究一下自己使用工具的配置能极大改善日常使用体验，但是还是需要一个契机**。

## 为什么不用 Surge

Surge 不支持 vless 协议，很多网上白嫖的节点有些是 vless 协议会无法使用，即使后面支持了以现在 Shadowrocket 使用现状没有新的需求应该也不会换了。

## Clash 自用规则

可以直接参考我项目中写的配置 [ReaJason/Clash-Butler/conf/clash_release.yaml](https://github.com/ReaJason/Clash-Butler/blob/master/conf/clash_release.yaml)

## 上网需求

1. 全局生效、透明代理：由于编程需要，在终端运行 npm、docker、maven 等各种下载命令时希望直接走代理，因此代理必须是全局生效的，而不是系统代理，仅系统代理是需要每个软件都独立配置的。
2. 去广告、规则分流：全局之后为了规避国内应用或网站由于节点垃圾而访问过慢因此需要分流规则进行直连分流，有了去广告规则再配合 Brave 浏览器访问大多数广告满天飞的网站基本都没啥广告了。

## Shadowrocket 配置

**手机和电脑都是同样的方式进行配置和使用。**

### 下载方式

1. 手机端：在 APP 应用商店（**一定不要在设置中进行登陆**）中登陆网上的免费已购小火箭的美区 ID 下载 Shadowrocket，下载完就切回自己的账号，例如 <https://id.ruyie.de/>，缺点是每次更新都需要卸载旧版本，然后找一个能用的新的账号进行下载重新配置。
2. 电脑端：访问 <https://appstorrent.ru/4563-shadowrocket.html> 直接下载使用即可，无任何缺点，有新版本直接覆盖更新即可。

### 配置文件

General 中是一些基础配置，比如一些内网地址、系统服务不要走代理，dns 服务器配置，哪些 IP 直接使用真实 IP。
Rule 匹配是从上至下，优先看是否是广告网站直接 REJECT 拒绝连接，其次是直连地址，最后兜底使用 GEOIP，FINAL 则是前面所有不匹配走 PROXY 代理连接，走 PROXY 的意思就是在小火箭首页的节点列表选什么节点到时候这些命中 PROXY 的就会用什么节点（网上所有没有用 RULE-SET 而是一大片 RULE 的建议直接忽略，这种不更新成最新的规则列表就是垃圾配置），**因为每个人的上网需求不一样因此规则部分可能会需要单独进行调整**。

```plaintext
# Shadowrocket: 2026-06-28 20:19:49
# 参考官方 TG 群组推荐的懒人配置：https://raw.githubusercontent.com/LOWERTOP/Shadowrocket/main/lazy_group.conf
[General]

# 网络兼容模式。当参数的值设定为 3 时的效果等同于：设置 > 代理 > 代理类型 > None。
compatibility-mode = 3

# 跳过代理。此选项强制这些域名或 IP 的连接范围由 Shadowrocket TUN 接口来处理，而不是 Shadowrocket 代理服务器。此选项用于解决一些应用程序的一些兼容性问题。
skip-proxy = 192.168.0.0/16, 10.0.0.0/8, 172.16.0.0/12, localhost, *.local, captive.apple.com, captive.v.apple.com, e.crashlytics.com, cpd.qq.com

# TUN 旁路路由。Shadowrocket TUN 接口只能处理 TCP 协议。使用此选项可以绕过指定的 IP 范围，让其他协议通过。
tun-excluded-routes = 10.0.0.0/8, 100.64.0.0/10, 127.0.0.0/8, 169.254.0.0/16, 172.16.0.0/12, 192.0.0.0/24, 192.0.2.0/24, 192.88.99.0/24, 192.168.0.0/16, 198.51.100.0/24, 203.0.113.0/24, 224.0.0.0/4, 255.255.255.255/32, 239.255.255.250/32, ff02::fb/128

# DNS 覆写。使用普通 DNS 或加密 DNS（如 DoH、DoQ、DoT 等）覆盖默认的系统 DNS。填 system 表示使用系统 DNS。
dns-server = https://doh.pub/dns-query,https://dns.alidns.com/dns-query,223.5.5.5,119.29.29.29

# 备用 DNS。当覆写 DNS 查询失败或查询时间超过 2 秒，Shadowrocket 会自动回退备用 DNS。如需指定多个 DNS，可用逗号分隔。system 表示回退到系统 DNS。
fallback-dns-server = system

# 启用 IPv6 支持。false 表示不启用，true 表示启用。启用会同时查询 A 记录和 AAAA 记录，优先使用 IPv4 地址解析。
ipv6 = true

# 首选 IPv6。优先向 IPv6 的 DNS 服务器查询 AAAA 记录，优先使用 IPv6 地址解析。false 表示不启用。
prefer-ipv6 = false

# 直连的域名类规则使用系统 DNS 进行查询。false 表示不启用。
dns-direct-system = false

# ping 数据包自动回复。
icmp-auto-reply = true

# 不开启时，「重写的 REJECT 策略」默认只有在配置模式下生效。开启后，可以令该策略在其他全局路由模式下都生效。
always-reject-url-rewrite = false

# 私有 IP 应答。如果不启用此选项，域名解析返回私有 IP，Shadowrocket 会认为该域名被劫持而强制使用代理。
private-ip-answer = true

# 直连域名解析失败后使用代理。false 表示不启用。
dns-direct-fallback-proxy = true

# DNS 劫持。有些设备或软件总是使用硬编码的 DNS 服务器，例如 Netflix 通过 Google DNS(8.8.8.8或8.8.4.4)发送请求，您可以使用此选项来劫持查询。
hijack-dns = 8.8.8.8:53,8.8.4.4:53

# 当 UDP 流量匹配到规则里不支持 UDP 转发的节点策略时重新选择回退行为，可选行为包括 DIRECT、REJECT。DIRECT 表示直连转发 UDP 流量，REJECT 表示拒绝转发 UDP 流量。
udp-policy-not-supported-behaviour = REJECT

# QUIC协议屏蔽策略。支持使用 all-proxy、all、always-allow 对 QUIC 传输层协议进行设置。其中 all-proxy 表示只对“走代理的连接”阻断 QUIC，直连连接（DIRECT）不会被干预；all 表示对所有连接（包括直连与代理）都屏蔽 QUIC，这会完全禁止系统中一切 UDP/443 流量；always-allow 表示始终允许 QUIC，不做任何屏蔽，等同于“关闭 QUIC 屏蔽”。
block-quic = all-proxy

# 总是真实 IP。此选项要求 Shadowrocket 在 TUN 处理 DNS 请求时返回一个真实的 IP 地址而不是假的 IP 地址。
always-real-ip = rule-set:fakeip-filter, private, cn, +.stun.*, +.msftconnecttest.com, +.msftncsi.com, +.time.windows.com, time.apple.com

[Rule]
DOMAIN-SUFFIX,boundaryx.net,DIRECT
DOMAIN-SUFFIX,luufery.net,DIRECT
RULE-SET,https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/reject.txt,REJECT
RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/BiliBili/BiliBili.list,DIRECT
RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Shadowrocket/NetEaseMusic/NetEaseMusic.list,DIRECT
RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Shadowrocket/DouBan/DouBan.list,DIRECT
RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/WeChat/WeChat.list,DIRECT
RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Shadowrocket/Sina/Sina.list,DIRECT
RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Shadowrocket/Zhihu/Zhihu.list,DIRECT
RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Shadowrocket/XiaoHongShu/XiaoHongShu.list,DIRECT
RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/OpenAI/OpenAI.list,PROXY
RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/YouTube/YouTube.list,PROXY
RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Telegram/Telegram.list,PROXY
RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Shadowrocket/Spotify/Spotify.list,PROXY
RULE-SET,https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/apple.txt,DIRECT
RULE-SET,https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/google.txt,DIRECT
RULE-SET,https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/direct.txt,DIRECT
RULE-SET,https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/proxy.txt,PROXY
RULE-SET,https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/telegramcidr.txt,PROXY,no-resolve
RULE-SET,https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/lancidr.txt,DIRECT,no-resolve
RULE-SET,https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/cncidr.txt,DIRECT,no-resolve
GEOIP,LAN,DIRECT,no-resolve
GEOIP,CN,DIRECT,no-resolve
FINAL,PROXY

[Host]
*.apple.com = server:system
*.icloud.com = server:system
localhost = 127.0.0.1

[URL Rewrite]
# Google搜索引擎防跳转的重写。
^https?://(www.)?g.cn https://www.google.com 302
^https?://(www.)?google.cn https://www.google.com 302

[MITM]
# Shadowrocket仅会解密hostname指定的域名的请求，可以使用通配符。也可以使用前缀 - 排除特定主机名，如 -*.example.com。iOS系统和某些应用有严格的安全策略，仅信任某些特定的证书，对这些域名启动解密可能导致问题，如 *.apple.com，*.icloud.com。
# 自版本 2.2.81 (3096) 起支持通过 HTTP/2 协议进行中间人攻击来解密 HTTPS 流量。当在纯文本模式的 [MITM] 字段中使用 h2 = true 命令时表示启用，等同于在 UI 界面开启对应开关

hostname = *.google.cn
```

以上配置链接可直接订阅：<https://sub.reajason.eu.org/reajason.conf>，如果需要订阅节点也是按下面的方式进行订阅下载节点（下载成功节点会在首页能看到，并不需要更改配置）。

![订阅配置](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/ShadowrocketUsage_img/subscribe_config.png)

### 客户端配置

1. 测试连接

测试 url 连通性，地址填 <https://www.google.com/generate_204>，这样能真实反映节点的外网可访问性和网站访问的延迟。

![测速](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/ShadowrocketUsage_img/settings_testmethod.png)

2. 代理配置

设置 TUN 模式，全局流量接管配合分流规则实现透明代理。

![代理](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/ShadowrocketUsage_img/settings_proxy.png)

3. UDP

关闭 STUN，防止网站 WebRTC 泄漏直连真实 IP。

![UDP](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/ShadowrocketUsage_img/settings_udp.png)

4. 订阅设置

sort by ping 按延迟排序，这样每次测试完方便选延迟最低的节点。

展示删除按钮，测试完延迟能将超时节点删除，方便下次测试时节点数量减少测试所花的时间就会减少。

![订阅](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/ShadowrocketUsage_img/settings_subscription.png)

5. GeoLite

第一个自动更新打开，默认一周更新一次。

Country 下载地址填：https://raw.githubusercontent.com/Loyalsoldier/geoip/release/Country.mmdb

ASN 下载地址填：https://github.com/P3TERX/GeoLite.mmdb/raw/download/GeoLite2-ASN.mmdb

![Geolite](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/ShadowrocketUsage_img/settings_geolite.png)

6. 首页使用

全局路由一栏选择 Config 配置即可，这样就能走我们设置好的分流规则，里面的代理就是全局代理，直连就是全局直连。

右上角的 + 基本不用碰，手动输入节点的配置还是太繁琐了，有些节点链接比如 `hysteria2://H7mP2xY9kJ4nQ9wR5tF6vB3z@vpn-jp-004.fastervpn.world:443?peer=vpn-jp-004.fastervpn.world&insecure=1&fingerprint=chrome#JP_Tokyo_Amazon.com,%20Inc._Gemini_Claude` 复制到剪贴板之后，在连通性测试下面会出现一个剪贴的图标点击即可直接添加剪贴板中的节点。

平时的操作一般就是点击连通性测试，删除不可用节点，选延迟最低的节点或者是某些指定区域节点。

![Homepage](https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/ShadowrocketUsage_img/homepage.png)

## 获取节点

1. 写了个 [python 脚本](https://t.me/memshell/7591) 直接爬 [飞梭 VPN](https://fastervpn.world/) 里面的节点
2. 注册 [宝可梦机场](https://web1.52pokemon.cc/dashboard) 订阅，优惠码在 [TG 频道](https://t.me/pokemon_love) 中，每个月 60G 通常够用
3. 使用 [ReaJason/Clash-Butler](https://github.com/ReaJason/Clash-Butler) 过滤聚合一些网上免费节点池中的节点

祝大家网络畅通无阻，*蒙多想去哪就去哪*。