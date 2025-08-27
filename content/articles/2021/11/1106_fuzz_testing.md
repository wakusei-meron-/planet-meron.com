---
title: Fuzz TestingとGo
date: 2021/11/06
tags:
  - golang
  - FuzzTesting
---

昨日第3回homieエンジニア勉強会にてFuzz Testingについて発表した

<iframe src="//www.slideshare.net/slideshow/embed_code/key/93NNN7uLGRBWja" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/genkiishibashi3/fuzz-testinggo" title="Fuzz testingとgo" target="_blank">Fuzz testingとgo</a> </strong> from <strong><a href="https://www.slideshare.net/genkiishibashi3" target="_blank">Genki Ishibashi</a></strong> </div>

Fuzz Testingは一言でいうとランダムなデータを生成して、クラッシュや例外が発生する入力値を探すテスト手法である

例えばだがjsonのデコードする昨日を開発する時に、完璧なテストケース自体を用意すること自体難しいのは想像に難くない

人が考えるよりも機械にやらせて、ある程度品質を担保するものを作った方が良い

その時に用いられるのがFuzz Testingである

## Fuzz Testingの例

例として以下のような関数を考えてみる

関数自体は文字列→int, int→文字列にするような関数である

```go
package fuzz_testing

import (
	"strconv"
)

// 文字列を読み込んでintに変換
func ReadNum(s string) int {
	n, err := strconv.Atoi(s)
	if err != nil {
		return 0
	}
	return n
}

// intを受け取って文字列に変換
func WriteNum(n int) string{
	return strconv.Itoa(n)
}
```

ここで文字列を数値に変換後、文字列に変換し直した時に元の文字列に一致するかどうかを判定するテストを書くとしよう

```go
package fuzz_testing

import (
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/ginkgo/extensions/table"
	. "github.com/onsi/gomega"
)


var _ = Describe("テスト", func() {
	DescribeTable("入力文字列とパースした数字の出力が一緒",
		func(in string, expected int) {
			// 文字列を数字へ変換
			n := ReadNum(in)
			Expect(n).To(Equal(expected))

			// intに変換できた場合、文字列に変換して入力値と比較
			if n != 0 {
				s := WriteNum(n)
				Expect(s).To(Equal(in))
			}
		},
		Entry("valid", "41", 41),
		Entry("invalid", "hoge", 0),
		Entry("negative", "-10", -10),
		Entry("zero", "0", 0),
		Entry("float", "1.5", 0),
	)
})
```

上記のように数字、文字列、負の値など想定できるような入力値を用意してテストを実行する

```shell
go test
Running Suite: FuzzTesting Suite
================================
Random Seed: 1636191755
Will run 5 of 5 specs

•••••
Ran 5 of 5 Specs in 0.000 seconds
SUCCESS! -- 5 Passed | 0 Failed | 0 Pending | 0 Skipped
PASS
ok      fuzz-testing    0.495s
```

他に入力値と変換後の文字列が思いつくでしょか？

それではFuzz Testingをやってみましょう

go-fuzzを用いた場合 `func Fuzz(b []byte)` という関数を用いると無作為な値を入力値として関数を実行することができます

今回は、この無作為に生成された文字列をintに変換後、文字列に変換して比較した時に、等しくない場合にpanicを発生するような関数を作成します

```go
package fuzz

import (
	"fmt"
	fuzz_testing "fuzz-testing"
)

func Fuzz(b []byte) int {
	n := fuzz_testing.ReadNum(string(b))
	if n == 0 {
		return 0
	}
	s := fuzz_testing.WriteNum(n)
	if s != string(b) {
		panic(fmt.Sprintf("panic起きてるで. in: %s, output: %s",string(b), s))
	}
	return 1
}
```

ここまでのファイル構成をまとめると下記のようになります

```shell
tree .
.
├── fuzz
│└── fuzz.go
├── fuzz_testing_suite_test.go
├── go.mod
├── go.sum
├── sample.go
└── sample_test.go
```

それではFuzz Testingを行ってみましょう

```shell
# fuzzディレクトリ配下に移動
cd fuzz

# fuzzテストの事項
go-fuzz-build && go-fuzz
2021/11/06 18:51:02 workers: 12, corpus: 20 (3s ago), crashers: 37, restarts: 1/0, execs: 0 (0/sec), cover: 0, uptime: 3s
・
・
・
```

すると3秒おきに標準出力に実行経過のサマリーが表示されます
crashersというのがpanicになった数を表しています

どの入力値の時にpanicになったかどうかを確認するには、fuzzのディレクトリ配下に `corpus` `crashers` `surpressions` というディレクトリが生成されていて、crashers内のデータを見るとわかります

```shell
 tree
.
├── corpus
│ ├── 3bc15c8aae3e4124dd409035f32ea2fd6835efc9-2
│ └── 5b2592e6f2a850a904744d65898b4ec3529c48f2-3
├── crashers
│ ├── 0c26d48b0282b5a3d815fad4fe4a71ad0b8bcdfb
│ ├── 0c26d48b0282b5a3d815fad4fe4a71ad0b8bcdfb.output
│ └── 0c26d48b0282b5a3d815fad4fe4a71ad0b8bcdfb.quoted
├── fuzz-fuzz.zip
├── fuzz.go
└── suppressions
    └── 0a432a9ee4661d17af0e2b50b4dd3955d3424695

cat crashers/0c26d48b0282b5a3d815fad4fe4a71ad0b8bcdfb.output
panic: panic起きてるで. in: -0201, output: -201

goroutine 1 [running]:
fuzz-testing/fuzz.Fuzz(0x8910000, 0x5, 0x5, 0x3)
        /Users/ishibashi_genki/IdeaProjects/fuzz-testing/fuzz/fuzz.go:15 +0x2b7
go-fuzz-dep.Main(0xc000092f70, 0x1, 0x1)
        go-fuzz-dep/main.go:36 +0x1b8
main.main()
        fuzz-testing/fuzz/go.fuzz.main/main.go:15 +0x52
exit status 2%
```

エラー内容をエラー内容を見ると負の値で数字の前に0が入るパターンが `strconv.Atoi` でエラーにならないが、入力と一致してないケースとしてpanicになっている

```shell
gore> :import strconv
gore> strconv.Atoi("-0001")
-1
nil
```

-の前に0をつけること自体人間は思いつかないが、Fuzz Testingをやると何も考えずに結果を出してくれる

このように、ランダムな値を入力値として関数を実行することによって人が考えもつかないような入力値を見つけられる

## GoにおけるFuzz Testingについて

Goの標準ライブラリでもFuzz Testingで不具合が起きるケースが数多く報告され、その有効性が認知されている

そこで、Go1.18からFuzz Testingが標準ライブラリとして実装された
https://github.com/golang/go/issues/44551

Go 1.18がリリースされたら、ぜひFuzz Testingを使ってみよう

## まとめ

任意の文字列の入力値のテストなどテストケースを考えることが難しい場合はFuzz Testingを利用することで有効なテストケースを容易に見つけられることがわかった
