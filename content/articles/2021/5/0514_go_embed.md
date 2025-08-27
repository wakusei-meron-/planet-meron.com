---
title: GoのEmbed触ってみた
date: 2021/05/14
tags:
  - golang
  - 1.16
---

Goの1.16から静的ファイルをプログラムに踏めこむことが可能なEmbed機能がリリースされたので使ってみる

https://tip.golang.org/doc/go1.16#library-embed

## GoのEmbedって何？

yamlや画像など静的なファイルをGoのアプリケーションで利用している場合、生成されるバイナリとは別に配置してプログラムからアクセスする必要がありました

```shell
# ファイル構造
$ tree .
.
├── main.go
└── sample.txt

$ cat sample.txt
this is sample text
```

```go
package main

import (
  "fmt"
  "io/ioutil"
)

func main() {
	// パスを指定してファイルの読み込み
  f, _ := ioutil.ReadFile("./sample.txt")
  fmt.Println(string(f))
}
```

```shell
# アプリケーションの実行
$ go run main.go
this is sample text
```

シンプルなファイル構造なら上記のような形で問題は無いのですが、Docker上でアプリケーションを動かす場合、ローカルとは異なるファイルパスを指定する必要があったりします

環境変数で渡すファイルパスを変えたりして対処することは可能なのですが、デバッグも含めて動作確認がややめんどくさかったりします

そこでgoのembedの登場です

## Go embedの使い方

単純なテキストとして読み込む場合、embedをプラグインインポートして、 `//go:embed xxx` という形でディレクティブを定義するとコンパイル時にパスを解決してバイナリに埋め込んで利用することが可能になります

```go
package main

import (
  // embedをプラグインとしてインポート
  _ "embed"
  "fmt"
)

// 埋め込むファイルを指定
//go:embed sample.txt
var sampleText string

func main() {
  fmt.Println(sampleText)
}
```

```shell
# アプリケーションの実行
$ go run main.go
this is sample text
```

上記の例の場合、バイナリの中にテキストファイルが埋め込まれているので、実行時に対象の削除してもビルドした時点のコードを実行することができます

```shell
$ tree .
.
├── main.go
└── sample.txt

// アプリケーションをビルド
$ go build main.go

// 埋め込むファイルの削除
$ rm sample.txt
$ tree .
.
├── main
└── main.go

// ファイルが埋め込まれているので、削除しても実行可能
$ ./main
this is sample text
```

## 埋め込み可能形式について

埋め込みたいファイルに対して `[]byte`, `embed.FS` のように型を定義することもできます

`embed.FS` ディレクトリとして扱うことが可能で、ファイルをまとめて扱う際に有効です

```go
package main

import (
 "embed"
 _ "embed"
 "encoding/json"
 "fmt"
)

type (
  Hoge struct {
    Key string `json:"key"`
  }
)

//go:embed sample.json
var sampleJson []byte

//go:embed sample_dir/*
var sampleDir embed.FS

func main() {
  var hoge Hoge
  json.Unmarshal(sampleJson, &hoge)
  fmt.Println("Key: " ,hoge.Key)

  fmt.Println("ファイル名一覧")
  files, _ := sampleDir.ReadDir("sample_dir")
  for _, file := range files {
    fmt.Println(file.Name())
  }
}
```

```shell
$  go run main.go
Key:  value
ファイル名一覧
file_a.txt
file_b.txt
```

## まとめ

以上、Go1.16から導入されたembedの使い方について紹介しました

静的ファイルをGoのバイナリに埋め込む方法はサードパーティのライブラリに存在していたが、公式でサポートされて嬉しい

とても使い心地もよくて最高
