---
title: TCP 可靠传输协议
date: "2022-12-29 20:50:41"
tags: [TCP]
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/TCPReliableDataTransferProtocol_index_img.jpg
description: "reliable data transfer protocol"
---
## rdt1.0

### 假设前提

1. 底层信道是完全可靠的
2. 发送速率等于接受速率，发送方发多少，接收方就能收多少

### 发送端

等待接收上层的数据（上层使用 `rdt_send(data)` 函数调用给下层发送数据），收到上层数据之后，将数据打包成分组（使用 `make_pkt(data)` ），将分组发送到信道上（`udt_send (packet)`）。

### 接收端

从下层信道接收分组（通过 `rdt_rcv(packet)` 事件），从分组中取出数据（`extract(packet, data)`），并将数据传送给上层（ `deliver_data(data)` ）。

## rdt2.0

真实网络传输中分组中可能比特会出现差错，因此引入控制报文，**肯定确认**（positive acknowledgment）和 **否定确认**（negative acknowledgment）。这两个控制报文使得接收方让发送方知道哪些分组被正确接收，哪些分组有误需要重发。基于这种重传机制的 rdt 称为 **自动重传请求（Automatic Repeat reQuest，ARQ）协议**。

ARQ 协议中使用三个协议功能来处理比特差错：

- 差错检测。需要一种机制使接收方检测何时出现了比特差错。添加额外的比特，校验和（checksum）来检测并可能纠正分组比特的错误。
- 接收方反馈。发送方要了解接收方情况的唯一途径就是让接收方提供明确的反馈信息给发送方。使用 ACK 和 NAK 。
- 重传。接收方收到有差错的分组，发送方重传该分组

### 发送端

等待接收上层数据（ `rdt_send(data)` ），收到数据时，将数据和校验和打包成分组（`nake_pkt(data,checksum)`），然后将分组发送到信道上。

如果收到 ACK 报文（`rdt_rcv(rcvpkt) && isNAK(rcvpkt)`），则回到等待上层调用的状态，继续监听上层数据的到来。

如果收到 NAK 报文（`rdt_rcv(rcvpkt) && isACK(rcvpkt)`），则重发当前分组，并继续等待。

这种等待接收方反馈的方式，称为 **停等（stop-and-wait）协议**。

### 接收端

收到的分组如果是损坏的，则发送 NAK 报文。

收到的分组如果是完好的，则发送 ACK 报文并将数据解包移交给上层处理。

### 缺陷

NAK 和 ACK 在传输过程中也有分组受损的可能性。

解决办法是将数据分组进行编号，将 ACK 也添加校验和字段。

## rdt3.0

底层信道除了比特差错外还会出现丢包情况。

发送方设置一个时间值，来判断是否发生了丢包，如果这一段时间没有收到 ACK 即重发分组。虽然导致了 **冗余数据分组**（duplicate data packet）的可能性，但分组编号机制能识别这种问题。
