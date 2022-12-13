---
title: DIのライブラリを使って初めて幸せになれた話
description: 自分が関わってきたプロダクトの中でDIというものを何度か見ることがあったが、当時そのメリットを理解することが全然できなかった　なぜDIに否定的だったかというと、該当のオブジェクトがどんなメソッドやフィールドを持っているか知るためにコードジャンプしても、DIの部分で辿れなくなったり、毎回毎回初期化メソッドを登録して手間が増えているだけだと思っていた　ところが...
date: 2020/12/07
tags:
  - DI
  - golang
  - wire
---

## はじめに

自分が関わってきたプロダクトの中で DI というものを何度か見ることがあったが、当時そのメリットを理解することが全然できなかった

なぜ DI に否定的だったかというと、該当のオブジェクトがどんなメソッドやフィールドを持っているか知るためにコードジャンプしても、DI の部分で辿れなくなったり、毎回毎回コンストラクタを登録して手間が増えているだけだと思っていた

ところが今開発しているプロダクトの成長が 1→10 のフェーズで指摘された問題点を解決するのに DI が非常に役に立った

ここでは DI とはなにか
過去の自分に向けてメリット・使い所を改めて紹介したい

## そもそも DI って何？

DI は Dependency Injection の略称で、日本語では依存性の注入と言われています

依存性の注入と言われてピンと来ないと思うのですが、要はあるオブジェクトが内部で使うオブジェクトを内部で生成するのではなく、外部から受け取って利用することを言います

DI を使わない・使う場合のコード例を挙げると下記のようになります

このソースコードでは Struct を初期化する際にログメッセージを出力して、Struct に保持している例になります

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

一見 DI を使っても使わなくても変わらなく見えますが、開発を続けていくといくつか問題が発生する可能性があります

DI を使わない場合、生成されたオブジェクトが NewLogger で生成されたロガーに依存しています

そのため、テストなどの際に不要なログを出力してしまったり、Logger 自体を変更したい時に内部の実装を毎回変える必要があります

そこで DI を使った例のように、依存しているオブジェクトを初期化時に引数として渡してあげると、この問題を解決することができます

まさにその名の通り、依存してるオブジェクトを外部から注入しているわけですね

### 正直 DI のメリットがまだ良くわからないんだけど...

上記の例では DI とは何かを説明しただけで、巷に存在する DI ライブラリを導入する理由の説明にはなっていません

DI ライブラリが本領を発揮する時は、依存関係が多段や複雑になった時です

例として、API サーバの実装を考えてみましょう

## DI を導入しない場合に生まれ得る技術的負債

ある程度の規模の API サーバを設計する場合、一般的に下記のような controller, service や repository のようなレイヤーを分けた設計になるかと思います

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

- controller は service に依存している
- service は repository に依存している
- repository は db に依存している
- db は env に依存している

このような状況の時に contoroller のコンストラクタの一例を見てみましょう

```go
// controllerの初期化
func NewController(env env.Config) controller.Controller {
  db := db.OpenDB(env) // DBのセッションの初期化
  repo := repository.NewRepository(db) // repositoryの初期化
  service := service.NewService(repo) // serviceの初期化
  return controler.Controller{service}
}
```

上記のコードでは初期化に必要な設定を受け取り、依存するオブジェクトを順次作成し、controller を生成しています

まさに DI を利用していない場合のソースコードと一致していますね

先程の例のようにテストなどで mock を挟めないだけでなく、他にもいくつかの問題が発生する可能性があります

1. controller を生成する度に DB のセッションや各構造体の初期化・生成が必要になる
1. controller が直接 env との依存関係が無いのに、依存関係が生まれている

repository や service は一度初期化を行って使い回せば良いものを、異なるエンドポイントの controller を作成する度に初期化する必要が発生します

service や repository の複数回の初期化は大きな問題にならないので許容できますが、DB のセッションを複数回生成することはパフォーマンス上の問題を発生させる可能性があります

これらの問題を回避するために DB のセッションを上のレイヤーで初期化・注入する方法も考えられますが、env の問題と同様に直接依存関係の無いオブジェクトを受け取ることになります

コンポーネントがそれほど多くない場合は問題になりませんが、扱うコンポーネントが多くなると依存関係を意識することができなくなり、ほぼ確実にレイヤー間の依存を無視したコードが出来上がります

依存を無視したコードが出来上がると controller で db を直接参照する人が現れ、一度マージされてしまうとスパゲッティコードの誕生です

これが加速していくと技術的負債が指数関数的に増えていき、新機能開発に多大な労力を費やす結果を招きかねません

## DI を導入してみる

それでは DI ライブラリを利用して上記の問題を回避してみましょう

最終的に出来上がるソースコードは [github](https://github.com/wakusei-meron-/wire_sample) にあげているので詳細はこちらをご確認ください

golang では [google/wire](https://github.com/google/wire) という DI ライブラリがあり、こちらを使ってみます

wire の使うには下記の 3 ステップを踏みます

1. レイヤー間の依存を意識したコンストラクタを定義
1. 生成したいコンストラクタと定義したコンストラクタを登録
1. 依存関係を wire に解決してもらい目的のコンストラクタを作成

それでは順番に見ていきましょう

### ① レイヤー間の依存を意識したコンストラクタを定義

今回のコードにおける依存関係を再度確認しておきたいと思います

- controller は service に依存している
- service は repository に依存している
- repository は db に依存している
- db は env に依存している

これらを明確にするため、コンストラクタには依存しているもののみ引数として定義します

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

### ② 生成したいコンストラクタと定義したコンストラクタを登録

生成したいコンストラクタと上記の定義した依存関係を wire.go というファイルに登録していきます

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

// 生成したいControllerのコンストラクタ
func InitController(e env.Conf) controller.Controller {

    //Controllerの生成に必要なコンストラクタの登録
	wire.Build(
		db.OpenDB,
		repository.NewRepository,
		service.NewService,
		controller.NewController,
	)
	return controller.Controller{}
}
```

`// +build wireinject` は go のビルドに含めないというコメントになり、 `wire.go` をビルドターゲットから除外してくれるようになります

wire では、生成したいコンストラクタにおける引数と返り値の型を参照して、依存性を自動で解決してくれます

つまり、 `controller.Controller` を生成するために、 `env.Conf` と `wire.Buildで登録された関数` をもとに依存性の解決を行います

### ③ 依存関係を wire に解決してもらい目的のコンストラクタを作成

上記のファイルから依存性解決をしたファイルの生成を行います

実行方法は wire をダウンロードし、wire コマンドを実行します

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

wire で定義した InitController という関数が自動生成されていて、各レイヤーの依存関係を自動で解決をしてくれています

これによって、各レイヤーでは依存するオブジェクトのみ定義することが可能で、かつ複数回コンストラクタの実行を避けることができました

## まとめ

DI とはなにか、DI によって解決できる問題について golang の wire を用いて具体的な例を見てみました

DI とは、依存するオブジェクトを引数として定義して渡すことで、柔軟な設計を行うパターンです

そして、一般的な API サーバを設計する際に起こりうる問題の定期と DI ライブラリを用いた解決方法について具体例を挙げました

これによって API サーバにおける各レイヤーの依存関係を明確にし、同じオブジェクトを複数回生成することを避けることができました

以上のことより DI とはなにか、どんな時に導入するとメリットを享受できるのか理解する助けとなれば幸いです
