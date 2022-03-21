---
title: CpawCTFのQ21のリバースエンジニアリング問題を解く
description:
date: 2022/03/21
tags:
- 2022
- CTF
---

問題は下記の通り
https://ctf.cpaw.site/questions.php?qnum=21

```
フラグを出す実行ファイルがあるのだが、プログラム(elfファイル)作成者が出力する関数を書き忘れてしまったらしい…
```

まずは対象のファイルがなんのファイルか確認

```shell
file rev100
rev100: ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, for GNU/Linux 2.6.24, BuildID[sha1]=f94360edd84a940de2b74007d4289705601d618d, not strippe
```

ELFは `Executable and Linking Format` の略称で、WindowsのexeファイルのようにLinuxにおける実行ファイルのこと
https://www.itmedia.co.jp/help/tips/linux/l0448.html

プログラムの作成者が出力する関数を書き忘れたということは、プログラム上に定数等で定義している可能性が高そう

そこでstringsコマンドを用いて、バイナリファイル内に該当の文字列が無いか確認する

stringsコマンドはバイナリファイルにおいて、文字列として読み込むことが可能なもののみを表示するコマンドである
https://atmarkit.itmedia.co.jp/ait/articles/1703/09/news038.html

helpにおける文言など文字列としてプログラムに記載されている場合、内容がを確認することができる

今回は `cpaw` の文言でgrepすることでフラグにに関する情報が無いか確認

```shell
strings /Users/ishibashi_genki/Downloads/rev100 | grep cpaw -A 13
D$Fcpawf
D$J{
D$ y
D$$a
D$(k
D$,i
D$0n
D$4i
D$8k
D$<u
D$@!
T$Le3
[^_]
;*2$"
```

`yakiniku!` という文字を発見！
これよりフラグを入力した所問題を突破

### 感想

リバースエンジニアリングの問題を解いたことが無かったが、stringsコマンドだったり勉強になる

そのうちアセンブラを理解して、バイナリを書き換えてプログラムを実行する必要など出てくるのだろうか...

CTF面白い！
