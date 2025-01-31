---
title: 固定IPにするとネットワークに繋がらない問題
date: 2023/08/12
tags:
  - 2023
  - ubuntu
  - network
---

## はじめに

Ubuntuで固定IPを設定するとネットワークに繋がらなくなる問題が発生したので、調査と解決方法をまとめた

## 問題が発生した経緯

自宅サーバの運用を行っていて、元々Wi-Fiを利用していたが、速度的な面で不安定なことがあるので、有線をつなぎネットワークを利用することにした

また自宅サーバとして運用するので、固定IPにすることで利便性を高めることにした

下記の固定IPの設定を行った結果、有線経由でのネットワークが繋がらなくなった

```bash
# 固定IPの設定
$ cat /etc/netplan/100-enp5s0-fixed.yaml
network:
   version: 2
   renderer: networkd
   ethernets:
      enp5s0:
         addresses: [192.168.210.73/24]
         nameservers:
            addresses: [8.8.8.8]
         routes:
            - to: default
              via: 192.168.0.1

# ネットワークの再起動
$ sudo netplan apply
```

## 解決までの流れ

結論としては、デフォルトゲートウェイの設定が間違っていたことが原因だった

Wi-Fiはネットに繋がるので、デフォルトゲートウェイのIPアドレスを確認後、設定に反映させた

```bash
# デフォルトゲートウェイの確認
$ ip r
default via 192.168.210.254 dev wlp6s0 proto dhcp metric 600
169.254.0.0/16 dev wlp6s0 scope link metric 1000
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1 linkdown
192.168.210.0/24 dev enp5s0 proto kernel scope link src 192.168.210.73
192.168.210.0/24 dev wlp6s0 proto kernel scope link src 192.168.210.58 metric 600
```

Wi-Fiが接続しているデフォルトゲートウェイのIPアドレスを固定IPの設定に反映

```bash
$ cat /etc/netplan/100-enp5s0-fixed.yaml
network:
   version: 2
   renderer: networkd
   ethernets:
      enp5s0:
         addresses: [192.168.210.73/24]
         nameservers:
            addresses: [8.8.8.8]
         routes:
            - to: default
              via: 192.168.210.254 # 自分の環境におけるデフォルトゲートウェイのIPアドレス
```

上記の内容を反映させて、ネットワークを再起動すると、有線経由でのネットワークが繋がるようになった

```bash
# ネットワークの再起動
$ sudo netplan apply

# デフォルトゲートウェイの確認
$ ip r
default via 192.168.210.254 dev enp5s0 proto static
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1 linkdown
192.168.210.0/24 dev enp5s0 proto kernel scope link src 192.168.210.73$
```

上記のように有線(enp5s0)のデフォルトゲートウェイが設定されていることが確認できる

結果有線を用いて外部と通信を行うことに成功した！

- メモ
  - https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q1455342259
  - https://www.n-study.com/tcp-ip/linux-tcpip-configuration/#%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E3%82%B2%E3%83%BC%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A4%E3%81%AE%E7%A2%BA%E8%AA%8D
