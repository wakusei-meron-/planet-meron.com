---
title: DIのライブラリを使って初めて幸せになれた話
description: 自分が関わってきたプロダクトの中でDIというものを何度か見ることがあったが、当時そのメリットを理解することが全然できなかった　なぜDIに否定的だったかというと、該当のオブジェクトがどんなメソッドやフィールドを持っているか知るためにコードジャンプしても、DIの部分で辿れなくなったり、毎回毎回初期化メソッドを登録して手間が増えているだけだと思っていた　ところが...
date: 2020/11/29
tags: 
  - DI
  - golang
  - wire
---

## はじめに

自分が関わってきたプロダクトの中でDIというものを何度か見ることがあったが、当時そのメリットを理解することが全然できなかった

なぜDIに否定的だったかというと、該当のオブジェクトがどんなメソッドやフィールドを持っているか知るためにコードジャンプしても、DIの部分で辿れなくなったり、毎回毎回初期化メソッドを登録して手間が増えているだけだと思っていた

ところが今開発しているプロダクトの成長が1→10のフェーズで指摘された問題点を解決するのにDIが非常に役に立った

ここではDIとはなにか
過去の自分に向けてメリット・使い所を改めて紹介したい

## そもそもDIって何？

DIはDependency Injectionの略称で依存性の注入と言われています

依存性の注入と言われてピンと来ないと思うのですが、要はあるオブジェクトが内部で使うオブジェクトを内部で生成するのではなく、外部から受け取って利用することを言います

DIを使わない・使う場合のコード例を挙げると下記のようになります

このソースコードではStructを初期化する際にログメッセージを出力して、Structに保持している例になります

```go
// DIを使わないオブジェクトの生成例
func NewStruct() Struct {
	l := NewLogger()
	l.Info("init struct")
	return Struct{Logger: l}
}

// DIを使ったオブジェクトの生成例
func NewStructWithDI(l Logger) Struct {
	l.Info("init struct")
	return Struct{Logger: l}
}

```

一見DIを使っても使わなくても変わらなく見えますが、開発を続けていくといくつか問題が発生する可能性があります

DIを使わない場合、生成されたオブジェクトがNewLoggerで生成されたロガーにに依存しています

そのため、テストなどの際に不要なログを出力してしまったり、Loggerを変更したい時に内部の実装を毎回変える必要があります

そこでDIを使った例のように、依存しているオブジェクトを初期化時に渡してあげると上記の問題を解決することができます

まさにその名の通り、依存してるオブジェクトを外部から注入しているわけですね

### 正直DIのメリットがまだ良くわからないんだけど...

上記の例ではDIとは何かを説明しただけで、DIでライブラリを導入する理由の説明にはなっていません

DIライブラリを導入して本領を発揮する時は、依存関係が多段や複雑になった時です

例として、APIサーバの実装を考えてみましょう

## DIを導入しない場合に生まれ得る技術的負債

ある程度の規模のAPIサーバを設計する場合、一般的に下記のようなcontroller, serviceやrepositoryのような設計になるかと思います

```plain
# 一般的なAPIサーバの設計
$ tree .
.
├── controller // ルーティングや入力パラメータのバインディング
├── env            // 環境ごとの設定
├── main.go    // エントリーポイントの定義 
├── repository // DBなどデータ層との接続ロジック
│   └── db      // DBとのアクセスロジック
└── service     // メインロジック
```

上記の各レイヤーの依存関係は下記のようになっています
* controllerはserviceに依存している
* serviceはrepositoryに依存している
* repositoryはdbに依存している
* dbはenvに依存している

このような状況の時にcontorollerの初期化をする際のコードを見てみましょう

```go
// controllerの初期化
func NewController(env Env) Controller {
  db := OpenDB(env) // DBのセッションの初期化 
  repo := NewRepository(db) // repositoryの初期化
  service := NewService(repo) // serviceの初期化
  return Controller{service}
}
```

上記のコードはまさにDIを利用していない場合のソースコードと一致していますね

先程の例のようにテストなどでmockを挟めないだけでなく、他にもいくつかの問題が発生する可能性があります

1. 他のcontrollerやserviceなど別のコンポーネントを参照する度にDBのセッションや各構造体の初期化・生成が必要になる
1. controllerが直接envの依存関係が無いのに、依存関係が生まれてしまっている

repositoryやserviceは一度初期化を行って使い回せば良いものを、複数のcontrollerから参照をしたいがために複数回初期化する必要が発生します

serviceやrepositoryならまだ複数回の初期化は大きな問題にならないので許容できますが、DBのセッションを複数回初期化することはパフォーマンス上の問題を発生させる可能性があります

これらの問題を回避するためにDBのセッションを上のレイヤーで初期化・注入する方法も考えられますが、envの問題と同様に直接依存関係の無いオブジェクトを受け取ることになります

コンポーネントがそれほど多くない場合は問題になりませんが、扱うコンポーネントが多くなると依存関係を意識することができなくなり、ほぼ確実にレイヤー間の依存を無視したコードが出来上がります

依存を無視したコードが出来上がるとcontrollerでdbを直接参照する人が現れ、一度マージされてしまうとスパゲッティコードの誕生です

これが加速していくと技術的負債が指数関数的に増えていき、新機能開発に多大な労力を費やす結果を招きかねません

## DIを導入してみる

それではDIライブラリを利用して上記の問題を回避してみましょう

最終的に出来上がるソースコードは [github](https://github.com/wakusei-meron-/wire_sample) にあげているので詳細はこちらをご確認ください

golangでは [google/wire](https://github.com/google/wire) というDIライブラリがあり、こちらを使ってみます

wireの使うには下記の3ステップを踏みます

1. 依存を意識した初期化関数を定義
1. 定義した初期化関数を登録
1. 依存関係をwireに解決してもらい初期化関数の作成

それでは順番に見ていきましょう

### ①依存を意識した初期化関数を定義

今回のコードにおける依存関係を再度確認しておきたいと思います

* controllerはserviceに依存している
* serviceはrepositoryに依存している
* repositoryはdbに依存している
* dbはenvに依存している

これらを明確にするため、初期化関数には依存しているもののみ引数として定義します
```go
// controllerの初期化(controller/controller.go)
// controllerはserviceに依存
func NewController(service service.Service) Controller {
	return Controller{service}
}
```
```go
// serviceの初期化(service/service.go)
// serviceはrepositoryに依存
func NewService(repo repository.Repository) Service {
	return Service{repo}
}
```
```go
// repositoryの初期化(repository/repository.go)
// repositoryはdbに依存
func NewRepository(db *sql.DB) Repository {
	return Repository{db}
}
```
```go
// dbの初期化(repository/db/db.go)
// dbは環境ごとの設定に依存
func OpenDB(e env.Conf) *sql.DB {
	dbPath := fmt.Sprintf("%s:%s@%s", e.DBSetting.USER, e.DBSetting.PASS, e.DBSetting.HOST)
	db, _ := sql.Open("mysql", dbPath)
	return db
}
```

### ②定義した初期化関数を登録

上記の定義した依存関係をwire.goというファイルを作成して登録していきます

```go
// +build wireinject

package main

import (
	"github.com/google/wire"

	"wire_sample/controller"
	"wire_sample/env"
	"wire_sample/repository"
	"wire_sample/repository/db"
	"wire_sample/service"
)

// Controllerの初期化関数をwireで自動生成するための定義
func InitController(e env.Conf) controller.Controller {
	wire.Build(
		db.OpenDB,
		repository.NewRepository,
		service.NewService,
		controller.NewController,
	)
	return controller.Controller{}
}
```

`// +build wireinject` はgoのビルドに含めないというコメントになるので、記述するようにしてください

wireでは引数の型と返り値の型を参照して依存性を自動で解決してくれます

つまり、 `controller.Controller` を生成するために、 `env.Conf` と `wire.Build` で定義された関数をもとに依存性の解決を行います

### ③依存関係をwireに解決してもらい初期化関数の作成

上記のファイルから依存性解決をしたファイルの生成を行います

実行方法はwireをダウンロードし、wireコマンドを実行します

```bash
# wireのインストール
$ go get github.com/google/wire/cmd/wire

# wire.goのビルド
$ wire
```

ビルドを行うと `wire_gen.go` というファイルが生成されます

```go
// Code generated by Wire. DO NOT EDIT.

//go:generate wire
//+build !wireinject

package main

import (
	"wire_sample/controller"
	"wire_sample/env"
	"wire_sample/repository"
	"wire_sample/repository/db"
	"wire_sample/service"
)

// Injectors from wire.go:

func InitController(e env.Conf) controller.Controller {
	sqlDB := db.OpenDB(e)
	repositoryRepository := repository.NewRepository(sqlDB)
	serviceService := service.NewService(repositoryRepository)
	controllerController := controller.NewController(serviceService)
	return controllerController
}
```

wireで定義したInitControllerという関数が自動生成されていて、各レイヤーの依存関係を自動で解決をしてくれています

これによって、各レイヤーでは依存するオブジェクトのみ定義することが可能で、かつ複数回初期化されることを避けることができました

## まとめ

DIとはなにか、DIによって解決できる問題についてgolangのwireを用いて具体的な例を見てみました

DIとは、依存するオブジェクトを引数として定義して渡すことで、柔軟な設計を行うパターンです

そして、一般的なAPIサーバを設計する際に起こりうる問題の定期とDIライブラリを用いた解決方法について具体例を挙げました

これによってAPIサーバにおける各レイヤーの依存関係を意識することができ、同じオブジェクトを複数回生成することを避けることができました

以上のことよりDIとはなにか、どんな時に導入するとメリットを享受できるのか理解する助けとなれば幸いです
