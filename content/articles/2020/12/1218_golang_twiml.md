---
title: GolangでTwiMLを生成するライブラリを作った話
description: はじめまして homie株式会社でエンジニアをやってる石橋
date: 2020/12/18
tags:
  - Golang
  - TwiML
  - Twilio
---


はじめまして

homie株式会社でエンジニアをやってる石橋([@b0941015](https://twitter.com/b0941015))と申します

この記事は、twilio Advent Calendar 2020の18日目の記事です


<embed-link src=https://qiita.com/advent-calendar/2020/twilio></embed-link>



弊社ではHOTLEADという不動産営業における支援ツールを作成しています

<embed-link src=https://homie.co.jp/#contact></embed-link>

このHOTLEADというプロダクトでは、反響と呼ばれる問い合わせメールからお客様と会うまでのアポイントメント数を最大化するための一次対応を行っています

エンジニアリングとコールセンターの力を最大限発揮し、お客様にも導入したクライアント様にもメリットを提供できるようなプロダクト開発に日々取り組んでいます

今回はコールセンターを構築するにあたってTwilioの導入を検討していて、その開発の中でGolang用のTwiMLを生成するライブラリを作った話をしたいと思います




## Twilio・TwiMLとはどういうものか

Twilioは電話やSMSなどコミュニケーションに関するクラウドAPIを提供するSaaSで、プログラマティックに発着信・自動応答メッセージなどを扱うことができます

Twilioへの指示はAPIを利用して行うので、任意の自動メッセージを流すような架電をしたり、着信した際に条件に応じて特定の人につないだりすることが可能です

この時、電話をかけて自動メッセージを流すなどTwilioに振る舞いを伝える手段としてTwiMLというものを使います

TwiMLは `the Twilio Markup Language` の略称で、Twilioに動作を指示するためのタグや属性が定義されたXMLです

`<Say>` や `<Dial>` などの動詞と `<Number>` や `<Client>` などの名詞タグからTwiMLは構成され、上のタグから順に実行されていきます

各タグに属性やデータを付与することによって、録音やメッセージを読み上げる声を変えたりすることができます

一つTwiMLの例を見てましょう

<figure class="figure-image figure-image-fotolife" title="サーバーからTwiMLを指定して発信">[f:id:b0941015:20201216174752p:plain]<figcaption>サーバーからTwiMLを指定して発信</figcaption></figure>

こちらは、サーバーからTwiMLを指定して電話をかけて"Hello world!"と音声が流れる指示を出しています

この時、音声を流す指示を出すTwiMLは下記のようになります

```xml
<Response>
  <Say>Hello world!</Say>
</Response>
```

TwiMLでは `<Response>` タグでTwilioにやってほしい指示内容を囲みます

この指示内容は属性を付与したり、並列にタグを並べることで複数の指示を出すことが可能です

```xml
<!-- Sayのタグにalice属性を指定して、メッセージを読み上げる声を変える -->
<Response>
  <Say voice="alice">Hello world!</Say>
</Response>
```
```xml
<!-- メッセージを読み上げた後に電話をつなぐ -->
<Response>
  <Say>この音声は録音されています</Say>
  <Dial>+81 90 1234 5678 </Dial>
</Response>
```

TwiMLについて他にどんなことができるのか、より詳細な説明については公式のドキュメントを参考にしてください

https://jp.twilio.com/docs/voice/twiml



## GolangでTwiMLを生成するライブラリを作成した経緯

### `encoding/xml` を使ったTwiMLの生成

Golangには `encoding/xml` というXMLを扱うためのパッケージが公式で用意されています

ただこの公式パッケージを用いたXMLの生成は、直感的な理解がやや難しかったりします

それは構造体の中にタグ名や属性・データ内容を定義することが可能なので、タグと構造体の関係がイメージしづらいという問題があるからです

以下、 `encoding/xml` を使ったXML出力サンプルです
```go
type (
	VoiceResponse struct {
		XMLName xml.Name   `xml:"Response"` // この構造体の要素名
		Say     SayElement `xml:"Say"`      // 要素のタグ名
	}

	SayElement struct {
		Voice   string `xml:"voice,attr"` // 属性
		Message string `xml:",chardata"`  // 文字データ
	}
)

func main() {
	resp := VoiceResponse{
		Say: SayElement{
			Message: "hello world",
			Voice:   "alice",
		},
	}
	buf, err := xml.MarshalIndent(resp, "", "  ")
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(string(buf))
}
```
```xml
<Response>
  <Say voice="alice">hello world</Say>
</Response>
```

[https://play.golang.org/p/3gQ8NwE9rda]


要素の名前を構造体のタグやフィールドどちらでも記述できるというのは柔軟な表現が可能である一方、両方記述された場合どちらが優先されるかわからないなどの複雑さがあります

またTwiMLの特性上、手順を追記していく形になるので要素の数は可変で、かつ入れ子構造が必要になるので複雑になる場合があります

この時、Golangでは構造体のフィールドを事前に決めておく必要があったり、interfaceを多用しなければなりません

ゆえに、公式で用意されている `encording/xml` だけで、TwiMLを表現するのは難しいといえます

### TwiMLを生成する既存ライブラリ

Twilioでは、APIを叩いたりTwiMLを生成するためのSDKを公式に提供しています

https://jp.twilio.com/docs/libraries

https://github.com/twilio


C#, Java, Node.js, PHP , Python , Rubyと様々な言語に対応していますが、弊社がサーバーサイドで利用しているGolangがありませんでした

OSSを探してみてもAPIクライアントは存在していますが、TwiMLを生成するものは数が少なく、かつ直近のメンテがされていない状況でした


## ライブラリgotwimlの紹介

そこで、TwiMLをGolangで容易に扱うことができるようにgotwimlというSDKを作成しました


https://github.com/homie-dev/gotwiml


こちらでは、各要素と属性・文字データを必要最小限かつ、直感的に扱えることを重視して設計しています

簡単な仕様例は下記の通りです

```go
func main() {
	resp := twiml.NewVoiceResponse().
		Say("hello world!", attr.Voice(voice.Alice))

	xml, _ := resp.ToXMLPretty("  ")
	fmt.Println(xml)
}
```
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">hello world!</Say>
</Response>
```

[https://play.golang.org/p/NhThQxdMaR5]


メソッドで要素名を指定し、第一引数で文字データを渡し、必要な属性をその後に定義していきます
これによって構造体を意識することなく、メソッドチェーンで必要な要素のみを渡してTwiMLを作成することができます

また、各TwiMLの動詞の作成時にFunctional Optionsパターンを採用しているので、属性の定義は柔軟に行うことができます

```go
// 生成例1:  "hello world"のメッセージを読み上げる
resp := twiml.NewVoiceResponse().Say("hello world!")
```
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response><Say>hello world!</Say></Response>
```
```go
// 生成例2:  イギリス英語のアクセント、かつアリスの声で、"hello world!"のメッセージを読み上げる
resp := twiml.NewVoiceResponse().
	Say("hello world!",
		attr.Voice(voice.Alice),
		attr.Language(language.EnGb),
	)
```
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response><Say voice="alice" language="en-GB">hello world!</Say></Response>
```

また複数の処理したい場合メソッドチェーンをつなげたり、ネストするような要素を加える場合は `AppendXXX` で要素を追加します

```go
// メソッドチェーンで複数処理を追加していく
resp := twiml.NewVoiceResponse().
	Say("ただいま、オペレータにつないでおります").
	Dial("+81 90 1234 5678", attr.AnswerOnBridge(true))
```

```xml
<Response>
  <Say>ただいま、オペレータにつないでおります</Say>
  <Dial answerOnBridge="true">+81 90 1234 5678</Dial>
</Response>
```

```go
// ネストしたTwiMLの生成
dial := twiml.NewDial(
	attr.AnswerOnBridge(true),
	attr.Record(recording.FromAnswerDual),
).Client("john")
resp := twiml.NewVoiceResponse().AppendDial(dial)
```

```xml
<Response>
  <Dial answerOnBridge="true" record="record-from-answer-dual">
    <Client>john</Client>
  </Dial>
</Response>
```

## まとめ

TwilioではTwiMLという独自に定義したXMLを用いて、架電や応答メッセージなどの操作を行います

このTwiMLを生成する際にGolangはTwilioによって公式なサポートがされていないので、TwiMLを作成するライブラリ gotwiml を作成しました

gotwimlを使うことによって、メソッドチェーンで処理を記述したり、属性を必要なものだけ定義をできるようにしています

このライブラリによって、直感的にTwiMLを生成できるようになり誰かの助けになれば幸いです

以上、お付き合いありがとうございました
