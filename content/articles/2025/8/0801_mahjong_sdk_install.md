---
title: 麻雀AI研究向けシミュレータmjx(v0.1.0)を使ってみる
date: 2025/08/27
tags:
  - 麻雀
  - Python
  - mjx
---

## はじめに

https://github.com/mjx-project/mjx

## 最新Mac環境へのlocalインストール→失敗

まずは使っているMac環境へインストールを試みる。

- 環境
  - CPU: Apple silicon
  - Python:  3.7以上
  - pip（Pythonのパッケージマネージャー）

公式ドキュメントでは `pip install mjx` でインストール可能とのことなので実行してみる

```bash
❯ python -m pip install mjx
Collecting mjx
  Using cached mjx-0.1.0.tar.gz (354 kB)
  Installing build dependencies ... done
  Getting requirements to build wheel ... done
  Preparing metadata (pyproject.toml) ... done
Collecting google==3.0.0 (from mjx)
  Using cached google-3.0.0-py2.py3-none-any.whl.metadata (627 bytes)
Collecting protobuf==3.17.3 (from mjx)
  Using cached protobuf-3.17.3-py2.py3-none-any.whl.metadata (858 bytes)
Collecting grpcio==1.39.0 (from mjx)
  Using cached grpcio-1.39.0.tar.gz (21.3 MB)
  Installing build dependencies ... done
  Getting requirements to build wheel ... done
  Preparing metadata (pyproject.toml) ... done
Collecting numpy (from mjx)
  Downloading numpy-2.3.2-cp313-cp313-macosx_14_0_x86_64.whl.metadata (62 kB)
Collecting pillow (from mjx)
  Downloading pillow-11.3.0-cp313-cp313-macosx_10_13_x86_64.whl.metadata (9.0 kB)
Collecting svgwrite (from mjx)
  Using cached svgwrite-1.4.3-py3-none-any.whl.metadata (8.8 kB)
Collecting inquirer (from mjx)
  Using cached inquirer-3.4.1-py3-none-any.whl.metadata (6.8 kB)
Collecting beautifulsoup4 (from google==3.0.0->mjx)
  Using cached beautifulsoup4-4.13.5-py3-none-any.whl.metadata (3.8 kB)
Collecting six>=1.5.2 (from grpcio==1.39.0->mjx)
  Using cached six-1.17.0-py2.py3-none-any.whl.metadata (1.7 kB)
Collecting soupsieve>1.2 (from beautifulsoup4->google==3.0.0->mjx)
  Using cached soupsieve-2.7-py3-none-any.whl.metadata (4.6 kB)
Collecting typing-extensions>=4.0.0 (from beautifulsoup4->google==3.0.0->mjx)
  Using cached typing_extensions-4.15.0-py3-none-any.whl.metadata (3.3 kB)
Collecting blessed>=1.19.0 (from inquirer->mjx)
  Using cached blessed-1.21.0-py2.py3-none-any.whl.metadata (13 kB)
Collecting editor>=1.6.0 (from inquirer->mjx)
  Using cached editor-1.6.6-py3-none-any.whl.metadata (2.3 kB)
Collecting readchar>=4.2.0 (from inquirer->mjx)
  Using cached readchar-4.2.1-py3-none-any.whl.metadata (7.5 kB)
Collecting wcwidth>=0.1.4 (from blessed>=1.19.0->inquirer->mjx)
  Using cached wcwidth-0.2.13-py2.py3-none-any.whl.metadata (14 kB)
Collecting runs (from editor>=1.6.0->inquirer->mjx)
  Using cached runs-1.2.2-py3-none-any.whl.metadata (10 kB)
Collecting xmod (from editor>=1.6.0->inquirer->mjx)
  Using cached xmod-1.8.1-py3-none-any.whl.metadata (1.8 kB)
Using cached google-3.0.0-py2.py3-none-any.whl (45 kB)
Using cached protobuf-3.17.3-py2.py3-none-any.whl (173 kB)
Using cached six-1.17.0-py2.py3-none-any.whl (11 kB)
Using cached beautifulsoup4-4.13.5-py3-none-any.whl (105 kB)
Using cached soupsieve-2.7-py3-none-any.whl (36 kB)
Using cached typing_extensions-4.15.0-py3-none-any.whl (44 kB)
Using cached inquirer-3.4.1-py3-none-any.whl (18 kB)
Using cached blessed-1.21.0-py2.py3-none-any.whl (84 kB)
Using cached editor-1.6.6-py3-none-any.whl (4.0 kB)
Using cached readchar-4.2.1-py3-none-any.whl (9.3 kB)
Using cached wcwidth-0.2.13-py2.py3-none-any.whl (34 kB)
Downloading numpy-2.3.2-cp313-cp313-macosx_14_0_x86_64.whl (6.6 MB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 6.6/6.6 MB 11.6 MB/s  0:00:00
Downloading pillow-11.3.0-cp313-cp313-macosx_10_13_x86_64.whl (5.3 MB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 5.3/5.3 MB 11.6 MB/s  0:00:00
Using cached runs-1.2.2-py3-none-any.whl (7.0 kB)
Using cached svgwrite-1.4.3-py3-none-any.whl (67 kB)
Using cached xmod-1.8.1-py3-none-any.whl (4.6 kB)
Building wheels for collected packages: mjx, grpcio
  Building wheel for mjx (pyproject.toml) ... /
(しばらく待つ)
          raise CompileError(msg)
      distutils.compilers.C.errors.CompileError: command '/usr/bin/clang++' failed with exit code 1

      [end of output]

  note: This error originates from a subprocess, and is likely not a problem with pip.
  ERROR: Failed building wheel for grpcio
Failed to build mjx grpcio
error: failed-wheel-build-for-install

× Failed to build installable wheels for some pyproject.toml based projects
╰─> mjx, grpcio
```

grpcio周りでエラーが発生しているのでビルドに失敗

その後grpcioを先にインストールしたり、バージョンを変えたりと色々と試したが、上手くインストールできず。。。

## Docker環境でmjxをインストール

一旦Mac環境にインストールすることは諦めてDocker環境にインストールすることを検討

### Dockerfileの作成
下記のDockerfileを作成して、mjxをインストールする

```dockerfile
FROM python:3.9-slim-bullseye

# 最低限のビルドツールを入れておく
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential cmake pkg-config git 

# pip を更新してから mjx を入れる
RUN python -m pip install --upgrade pip setuptools wheel \
 && pip install mjx tqdm jupyterlab

# jupyterlabの起動
CMD ["jupyter", "lab", "--ip=0.0.0.0", "--port=8888", "--no-browser", "--allow-root"]
```

サンプルのノートブックを実行するためにtqdmやjupyterlabも同時にインストールするようにDockerfileを作成します

### Dockerイメージのビルドと実行

下記コマンドでビルドと実行を行う

```
# ビルド
docker build --platform=linux/amd64 -t mjx-py39 .

# 実行
docker run --platform=linux/amd64 -it -p 8888:8888 --rm mjx-py39
```

正常に起動するとjupyterlabのURLが出力されるのでアクセスする(ex. http://127.0.0.1:8888/lab?token=34379a...)

## Notebookの作成と麻雀卓の表示

[公式のnotebook](https://colab.research.google.com/drive/1m1wOT_K2YFtuV6IO7VgWk4ilVhTKqRFU?usp=sharing
)を参考に麻雀の盤面を作成してみた

ちゃんと実行して局面が表示された！

![hello_mjx](/images/mahjong_sdk_install/Screenshot%202025-08-27%20at%203.59.29 PM.jpg)

確かにきれいな盤面が表示されている

次回はmjxに用意されている機能について紹介していきたいと思います。
