---
title: Go FAQ読んでみた
date: 2022/09/18
tags:
  - 2022
  - Golang
---

Goに関していろいろ調べていると公式のFAQを見つけた

https://go.dev/doc/faq#What_is_the_purpose_of_the_project

普段から思ってる疑問に対する回答も載っていたので、気になった回答をいくつかピックアップする

## Go言語はGo or Golangのどちらで呼ばれる？

> この言語はGoと呼ばれています。"golang"という名前は、もともとWebサイトがgolang.orgだったからです（当時は.devドメインはありませんでした）。(しかし、多くの人がgolangという名前を使っていて、ラベルとして便利です。例えば、Twitterのタグは "#golang "です。言語の名前は関係なく、単なるGoです。

現在のGoの公式なドメインは `go.dev` であるが、 `golang.org` が使われていたので、正式な呼び方がどっちつかずになっていたのね
またgolangの方が検索性が良いいので、継続して `golang` は使われることにはなりそう

## なぜGoには例外がないのですか？

> try-catch-finallyイディオムのように例外を制御構造に結びつけると、複雑なコードになると私たちは考えています。また、ファイルを開けなかったというような普通のエラーを例外として扱うようプログラマに促す傾向があります。

> Goは異なるアプローチを取ります。普通のエラー処理では、Goの複数値戻り値によって、戻り値をオーバーロードせずにエラーを報告することが簡単にできます。標準的なエラータイプとGoの他の機能が相まって、エラー処理は快適ですが、他の言語でのエラー処理とは全く異なります。

> Goには、本当に例外的な状態を通知し、そこから回復するための組み込み関数もいくつかあります。回復機構は、エラー後に関数の状態が破棄される際にのみ実行されます。これは大惨事を処理するには十分ですが、余分な制御構造は必要なく、うまく使えばきれいなエラー処理コードに仕上がります。

> 詳しくは、Defer, Panic, and Recoverの記事を参照してください。また、Errors are values というブログ記事では、エラーは単なる値なので、エラー処理に Go のフル パワーを展開できることを示すことで、Go できれいにエラーを処理するための 1 つのアプローチを説明しています。

普通のエラーと例外処理は異なるのに同一のものとして扱われることが多かったので、関数の返り値としてエラーを定義するような形にした

そして、大局的な例外処理はpanicで対応

## なぜスレッドでなくゴルーチンなのか？

> ゴルーチンは、並行処理を簡単にするためのものです。このアイデアは以前からあり、独立して実行される関数（コルーチン）をスレッドの集合に多重化することです。コルーチンがブロッキングシステムコールを呼び出すなどしてブロックされると、ランタイムは自動的に同じオペレーティングシステムのスレッド上の他のコルーチンを、ブロックされないように実行可能な別のスレッドに移動させる。プログラマには、このようなことは全く分からない。それが重要な点である。ゴルーチンは、スタック用のメモリ（数キロバイト）以上のオーバーヘッドをほとんど持ちません。

> スタックを小さくするために、Goのランタイムはサイズ変更可能な境界付きスタックを使用しています。新しく作成されたゴルーチンは、数キロバイトを与えられますが、これはほとんど常に十分な量です。足りないときは、ランタイムがスタックを格納するメモリを自動的に拡大（縮小）するので、多くのゴルーチンが適度な量のメモリで生活できるようになります。CPUのオーバーヘッドは、関数呼び出し1回につき平均して3個程度の安い命令である。同じアドレス空間に何十万ものゴルーチンを作ることが現実的である。もしゴルーチンが単なるスレッドだったら、もっと少ない数でシステムリソースが枯渇してしまうでしょう。

スレッドはOS上の機能としてスレッド間のメモリが干渉しないような機能として、提供されているがデフォルトのスタックサイズが1,2MB要する

Goroutineはスレッドを用いず独自の並行処理で、数KBのメモリ容量しか用いいない

これによってGoが達成しようとしていた目標である並行処理を容易に、かつヘビーな用途にも用いることが可能
https://qiita.com/kumamo-n/items/0e5d3fec247f77cefba7

## なぜマップ演算はアトミックであると定義されていないのですか？

> 長い議論の末、マップの典型的な使い方では、複数のゴルーチンから安全にアクセスする必要はなく、アクセスする場合でも、マップはすでに同期化されている大きなデータ構造または計算の一部であろうということが決定されました。そのため、すべてのマップ操作にミューテックスを取得することを要求すると、ほとんどのプログラムの速度を低下させ、安全性を高めることはほとんどできません。しかし、これは制御不能なマップアクセスがプログラムをクラッシュさせる可能性があることを意味するので、簡単な決定ではありませんでした。

> この言語はアトミックなマップ更新を排除するものではありません。信頼できないプログラムをホストする場合など、必要であれば、実装はマップアクセスをインターロックすることができます。

> マップアクセスが安全でないのは、更新が行われているときだけです。すべてのゴルーチンがマップの要素を読み取るだけであれば、for range ループを使用してマップを繰り返し、要素への代入や削除によってマップを変更しない限り、同期化せずに同時にマップにアクセスすることは安全です。

> マップを正しく使用するための補助として、この言語のいくつかの実装には、同時実行によってマップが安全でない形で変更された場合に実行時に自動的に報告する特別なチェックが含まれています。

goのmapはパフォーマンス的な観点で意図的にスレッドセーフではない

## 私の言語の変更を受け入れてもらえますか？

> Goの言語に対する改良を提案する人はよくいます。メーリングリストにはそのような議論の豊富な歴史がありますが、これらの変更が受け入れられることは非常に少ないです。

> Goはオープンソースのプロジェクトですが、言語とライブラリは、少なくともソースコードレベルでは、既存のプログラムを破壊するような変更を防ぐ互換性の約束によって保護されています（最新の状態に保つためにプログラムは時々再コンパイルする必要があるかもしれません）。あなたの提案がGo 1の仕様に違反する場合、その利点にかかわらず、私たちはそのアイデアを受け入れることさえできません。将来のメジャー リリースは Go 1 と互換性がないかもしれませんが、このトピックに関する議論は始まったばかりであり、1つ確かなことは、その過程で非互換性が生じることは非常に少ないということです。さらに、互換性の約束は、そのような状況が発生した場合に古いプログラムが適応するための自動的な道を提供するよう促しています。

> あなたの提案がGo 1仕様と互換性があったとしても、Goの設計目標の精神にはそぐわないかもしれません。記事「Go at Google: Go at Google: Language Design in the Service of Software Engineeringの記事で、Goの起源とその設計の動機について説明しています。

互換性を破壊するような変更はされないように保護されている
ほとんどの場合提案は取り入れられないが、Goの設計目標を確認する必要あり

https://go.dev/talks/2012/splash.article

## Goはオブジェクト指向言語か？

> イエスでもありノーでもあります。Goには型とメソッドがあり、オブジェクト指向のプログラミングが可能ですが、型の階層はありません。Goの「インターフェイス」のコンセプトは、使いやすく、ある意味より一般的であると私たちが考える別のアプローチを提供します。また、型を他の型に埋め込む方法もあり、サブクラス化と似ているが同一ではないものを提供します。さらに、GoのメソッドはC++やJavaよりも一般的で、あらゆる種類のデータに対して定義することができます。構造体（クラス）に限定されるわけではありません。

> また、型階層がないため、Goの「オブジェクト」はC++やJavaのような言語よりもずっと軽量に感じられます。

オブジェクト指向の言語であるが、型に対する複雑な機能は提供してない軽量オブジェクト指向言語

## なぜlenはメソッドではなく関数なのですか？

> 私たちはこの問題について議論しましたが、lenとその仲間を関数として実装することは、実際には問題なく、基本的な型のインタフェース（Go型の意味での）についての質問を複雑にすることもないと判断しました。

どんな議論をしたのかは、ここでは語られず...

## なぜGoはメソッドや演算子のオーバーロードをサポートしないのですか？

> メソッドのディスパッチは、型のマッチングもする必要がなければ単純化されます。他の言語での経験から、同じ名前でシグネチャが異なるさまざまなメソッドを持つことは、時には便利ですが、実際には混乱しやすく壊れやすいということがわかりました。名前だけでマッチングし、型の一貫性を要求することは、Goの型システムにおける主要な単純化の決定でした。

> 演算子のオーバーロードについては、絶対的な要件というよりも、利便性の方が高いように思います。繰り返しになりますが、演算子のオーバーロードはない方がシンプルです。

オーバーロードは便利な一方、実際には混乱しやすく壊れやすい

## new と make の違いは何ですか？

> 簡単に言うと、newはメモリを確保し、makeはスライス型、マップ型、チャネル型を初期化します。

> 詳しくは Effective Go の該当箇所を参照してください。

メモリ確保が不要な場合もあるので、コードを書く時に使い分ける
