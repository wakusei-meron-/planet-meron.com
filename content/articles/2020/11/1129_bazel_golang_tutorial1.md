---
title: Bazelをgolangプロジェクトをbuildする
description: 自分が立ち上げたプロジェクトでバックエンドもフロントも言語が違うコンポーネントを一つのリポジトリで管理するモノレポを採用している　このモノレポという開発手法はGoogleやFacebookでも用いられている 自分の考え方としては、ベンチャーという組織においては価値を生むことが最優先なので...
date: 2020/11/29
tags:
  - Bazel
  - golang
---

## はじめに

自分が立ち上げたプロジェクトでバックエンドもフロントも言語が違うコンポーネントを一つのリポジトリで管理するモノレポを採用している

このモノレポという開発手法は Google や Facebook でも用いられている

自分の考え方としては、ベンチャーという組織においては価値を生むことが最優先なので、開発言語や特定の役割にとらわれるのではなく開発技術・言語にとらわれず一貫したプロダクトの開発を行えるようにという思いもある

今までは各コンポーネントで Docker-Compose を使っていたけど、[Bazel](https://docs.bazel.build/versions/3.7.0/tutorial/cpp.html) を使ってみる

## ビルド方法

[公式のドキュメント](https://docs.bazel.build/versions/3.7.0/getting-started.html) におけるチュートリアルは C++, Java, Android, iOS のみ存在する

Golang に関しては、 [rules_go](https://github.com/bazelbuild/rules_go) を参照すると良い

まずはビルドするディレクトリ構成について

```bash
# ディレクトリ構成
$ tree .
.
├── BUILD.bazel
├── WORKSPACE.bazel
├── go.mod
└── main.go
```

`main.go` は `hello world!` を出力するシンプルなもの

```go
package main

import "fmt"

func main() {
	fmt.Println("hello world!")
}
```

bazel 導入に必要なファイルは `WORKSPACE.bazel` と `BUILD.bazel`

bazel には `WORKSPACE` という概念があり、ソースコードとビルドされたファイルを管理するためのディレクトリ定義する必要がある

`WORKSPACE.bazel` は WORKSPACE を定義し、各言語の設定などを記述する

c++や java の場合はファイル再存在すれば動作をするが、golang の場合 `WORKSPACE.bazel` に下記の記述が必要になる

```sh
$  cat WORKSPACE.bazel
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "io_bazel_rules_go",
    sha256 = "207fad3e6689135c5d8713e5a17ba9d1290238f47b9ba545b63d9303406209c6",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.24.7/rules_go-v0.24.7.tar.gz",
        "https://github.com/bazelbuild/rules_go/releases/download/v0.24.7/rules_go-v0.24.7.tar.gz",
    ],
)

load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")

go_rules_dependencies()

go_register_toolchains()
```

そして、ソースコードのビルドの設定は `BUILD.bazel` に記述します

```
$ cat BUILD.bazel
load("@io_bazel_rules_go//go:def.bzl", "go_binary")

go_binary(
    name = "hello_world", # ビルドターゲット名
    srcs = ["main.go"],   # ソースコードの指定
)
```

この状態でターゲット名を指定してビルドを行います

```bash
# hello_worldをbazelでビルド
$ bazel build //:hello_world
INFO: Analyzed target //:hello_world (1 packages loaded, 2 targets configured).
INFO: Found 1 target...
Target //:hello_world up-to-date:
  bazel-bin/hello_world_/hello_world
INFO: Elapsed time: 0.149s, Critical Path: 0.01s
INFO: 1 process: 1 internal.
INFO: Build completed successfully, 1 total action
```

ビルドを行うと WORKSPACE で指定したディレクトリに bazel に関するファイル群が生成されます

```
$ tree . -L 1
.
├── BUILD.bazel
├── WORKSPACE.bazel
├── bazel-bazel_sample
├── bazel-bin
├── bazel-out
├── bazel-testlogs
├── go.mod
└── main.go
```

ビルドされた実行ファイルは `bazel-bin` 配下に含まれているので、実行してみましょう

```
$ ./bazel-bin/hello_world_/hello_world
hello world!
```

無事 bazel で、go 言語をビルドして実行することができました
