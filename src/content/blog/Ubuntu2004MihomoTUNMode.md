---
title: Mihomo TUN Mode in Ubuntu20.04
tags: [Notes]
categories: [Blog]
date: "2024-10-25 00:00:00"
description: "Optimize DX(Developer Experience) with Mihomo"
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/Ubuntu2004MihomoTUNMode_index_img.png
---

## Docker Pull Timeout

Unfortunately, docker hub has been banned in mainland China due to some [reasons](https://www.v2ex.com/t/941538#reply11). So many docker register proxy website were stopped, and the docker pull command output is here, when you use docker pull.

```bash
$ sudo docker run hello-world
Unable to find image 'hello-world:latest' locally
docker: Error response from daemon: Get "https://registry-1.docker.io/v2/": net/http: request canceled while waiting
 for connection (Client.Timeout exceeded while awaiting headers).
See 'docker run --help'.
```

I try to use the LAN proxy, it doesn't work, so i think the best way is to deploy mihomo in **TUN** mode on my development machine, maybe use [Docker Images Proxy](https://duckduckgo.com/?q=docker+%E9%95%9C%E5%83%8F%E4%BB%A3%E7%90%86&t=brave&ia=web), but i don't want to use it.

## Simple Usage

Download the latest Mihomo release package using [Github Proxy](https://github.akams.cn/) and move it to `/usr/local/bin/mihomo`.

```bash
curl -O -L https://gh.llkk.cc/https://github.com/MetaCubeX/mihomo/releases/download/v1.18.9/mihomo-linux-arm64-v1.18.9.gz
gunzip mihomo-linux-arm64-v1.18.9.gz
sudo mv mihomo-linux-arm64-v1.18.9 /usr/local/bin/mihomo
sudo chmod +x /usr/local/bin/mihomo
```

Download your Mihomo configuration to `/etc/mihomo/config.yaml`.

```bash
sudo mkdir -p /etc/mihomo
sudo curl -o /etc/mihomo/config.yaml https://sub.reajason.eu.org/clash.yaml
```

Create a systemd configuration file `/etc/systemd/system/mihomo.service`.

```bash
sudo vim /etc/systemd/system/mihomo.service
```

```text
[Unit]
Description=mihomo Daemon, Another Clash Kernel.
After=network.target NetworkManager.service systemd-networkd.service iwd.service

[Service]
Type=simple
LimitNPROC=500
LimitNOFILE=1000000
CapabilityBoundingSet=CAP_NET_ADMIN CAP_NET_RAW CAP_NET_BIND_SERVICE CAP_SYS_TIME CAP_SYS_PTRACE CAP_DAC_READ_SEARCH CAP_DAC_OVERRIDE
AmbientCapabilities=CAP_NET_ADMIN CAP_NET_RAW CAP_NET_BIND_SERVICE CAP_SYS_TIME CAP_SYS_PTRACE CAP_DAC_READ_SEARCH CAP_DAC_OVERRIDE
Restart=always
ExecStartPre=/usr/bin/sleep 1s
ExecStart=/usr/local/bin/mihomo -d /etc/mihomo
ExecReload=/bin/kill -HUP $MAINPID

[Install]
WantedBy=multi-user.target
```

Start the mihomo service using systemctl.

```bash
sudo systemctl daemon-reload # Reload systemd
sudo systemctl enable mihomo # Start when start up
sudo systemctl start mihomo # Start Mihomo

# Other systemctl command
# If you change the config.yaml, use this command to reload config
sudo systemctl reload mihomo
# Show the status of Mihomo
sudo systemctl status mihomo
# Show the running logs of Mihomo
sudo journalctl -u mihomo -o cat -f
```

Edit `/etc/sysctl.conf` to allow ipv4 and ipv6 forward, and open the following switch.

```bash
sudo vim /etc/sysctl.conf
```

```text
# Uncomment the next line to enable packet forwarding for IPv4
net.ipv4.ip_forward=1

# Uncomment the next line to enable packet forwarding for IPv6
#  Enabling this option disables Stateless Address Autoconfiguration
#  based on Router Advertisements for this host
net.ipv6.conf.all.forwarding=1
```

If the edit was successful, use the `reboot` command to reboot your system.

Then use curl to check the mihomo proxy. (if you run `systemctl enable mihomo`, the computer will start mihomo on startup)

```bash
curl -v https://www.google.com
```

```bash
sudo docker pull hello-world
```

![result.png](https://raw.githubusercontent.com/ReaJason/blog_imgs/master/Ubuntu2004MihomoTUNMode_img/result.png)

## Tips

### TUN

System proxy does not work for `docker pull`, but tun mode does, here is my tun mode config. Check the [sub link](https://sub.reajason.eu.org/clash.yaml) for my entir mihomo configuration.

```yaml
tun:
  enable: true
  stack: mixed
  strict_route: true
  auto-route: true
  auto-redirect: true
  auto-detect-interface: true
  dns-hijack:
    - any:53
    - tcp://any:53
dns:
  enable: true
  prefer-h3: true
  ipv6: true
  listen: 0.0.0.0:53
  fake-ip-range: 198.18.0.1/16
  enhanced-mode: fake-ip
  fake-ip-filter: [ 'rule-set:fakeip-filter,private,cn' ]
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
```

### External Control

Maybe you can consider using metacube to control your mihomo runtime config. Open the external control by adding follow config to your mihomo config.

The entrypoint is `http://127.0.0.1:9090/ui`.

```yaml
external-controller: 127.0.0.1:9090
external-ui: ui
external-ui-url: https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip
```

If you want to use public ip, use follow config, make sure to use **secret** to protect your mihomo.

The entrypoint is `http://publicip:9090/ui`.

```yaml
external-controller: 0.0.0.0:9090
secret: "generateLZQ*HRSP$kC4Nlpu"
external-ui: ui
external-ui-url: https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip
```

See the [official tutorial docs](https://wiki.metacubex.one/config/general/#api) for other config of external control configurations.

### Diagnostic

It's possible that your mihomo service is not running as expected or maybe your proxy is not working, set the log level to debug and check the running logs.

```yaml
log-level: debug
```

Reload and check the runing log.

```bash
sudo systemctl reload mihomo
sudo jornalctl -u mihomo -o cat -f
```

## Thanks

1. [创建运行服务 - 虚空终端 Docs](https://wiki.metacubex.one/startup/service/)
2. [Linux 搭建 mihomo(2024.8.11)](https://nanodesu.net/archives/47/)
3. [Linux 系统 mihomo 安装教程](https://github.com/axcsz/Collect/wiki/Linux-%E7%B3%BB%E7%BB%9F-mihomo-%E5%AE%89%E8%A3%85%E6%95%99%E7%A8%8B)
4. [搭载 mihomo 内核进行 DNS 分流教程-ruleset 方案](https://proxy-tutorials.dustinwin.top/posts/dnsbypass-mihomo-ruleset/)
5. [Clash-Butler - 节点测速合并](https://github.com/ReaJason/Clash-Butler)
