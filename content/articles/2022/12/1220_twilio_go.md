---
title: 遂にTwilio公式にサポートされたGoのSDKを使い倒してみる！
date: 2022/12/18
tags:
  - 2022
  - Golang
  - Twilio
---

## はじめに

この記事は[Twilio Advent Calendar 2022](https://qiita.com/advent-calendar/2022/twilio)の18日目の記事です

<embed-link src="https://qiita.com/advent-calendar/2022" url="https://qiita.com/advent-calendar/2022/twilio"></embed-link>

今年の10月にTwilioのGoライブラリが正式にリリースされたので、使い心地を試してみます

<embed-link src=https://github.com/twilio/twilio-go></embed-link>


## RESTクライントの生成

SMSの送信やTwilioのリソースへアクセスする際には認証が必要で、RESTクライアントを作成すると容易にAPIを叩くことが可能になります

以下環境変数やパラメータを指定した方法やサブアカウント、APIキーを利用したクライアントの生成方法を紹介します


#### 環境変数を利用した初期化
```go
// TWILIO_ACCOUNT_SIDとTWILIO_AUTH_TOKENの環境変数が認証情報として利用される
client := twilio.NewRestClient()
```
　

#### パラメータを利用した初期化
```go
accountSID := "ACXXXXXXXXXXXXXXX"
authToken := "yyyyyyyyyyyyyyyyyy"
client := twilio.NewRestClientWithParams(twilio.ClientParams{
  Username: accountSID,
  Password: authToken,
})
```

#### サブアカウントの初期化
```go
accountSID := "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
authToken := "yyyyyyyyyyyyyyyyyy"
subAccountSID := "ACZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ"
client := twilio.NewRestClientWithParams(twilio.ClientParams{
  Username:   accountSID,
  Password:   authToken,
  AccountSid: subAccountSID,
})
```

#### APIキーを利用した初期化
```go
accountSID := "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
apiKey := "SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
apiSecret := "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  client := twilio.NewRestClientWithParams(twilio.ClientParams{
  Username:   apiKey,
  Password:   apiSecret,
  AccountSid: accountSID,
})
```

パラメータとして `Username` と `Password` , `AccountSid` を与えられるのですが、サブアカウントやAPIキーを利用する場合は、読み変えて値を設定する必要があるので、やや注意が必要です。

## RESTクライアントの設定項目(edgeとタイムアウト)

初期化したRESTクライアントの設定項目としてEdgeとタイムアウトを設定することが可能です

```go
// EdgeとしてTokyoを指定 (※TWILIO_EDGEとして環境変数が設定されていれば不要)
client.SetEdge("tokyo")

// APIのタイムアウト時間を設定(デフォルトではタイムアウト設定はされない)
client.SetTimeout(1 * time.Second)
```

## RESTクライアントの使い方

RESTクライアントはAccountやFlexなど各TwilioサービスごとにAPIのインタフェースを持っていて、関数を呼び出すことで各アクションが可能です

#### メッセージの送信
```go
// 送信メッセージのパラメータの設定
params := &openapi.CreateMessageParams{}
params.SetTo("090xxxxxxxxx")
params.SetFrom("050xxxxxxxx")
params.SetBody("hello twilio-go!")

// メッセージの送信
resp, err := client.Api.CreateMessage(params)
```

#### Twilio Functionの作成
```go
params := &twilioApi.CreateFunctionParams{}
params.SetFriendlyName("My Serverless func")

resp, err := client.ServerlessV1.CreateFunction(serviceSid, params)
```

APIの仕様についてはOPEN APIで定義されていて、必要あれば見てみてください

https://github.com/twilio/twilio-oai

#### データの取得(ListXXX, StreamXXX, PageXXX)

リソース一覧を取得する関数名は `ListXXX` として定義されています

```go
// メッセージ一覧の取得
resp, _ := client.Api.ListMessage(params)
for record := range resp {
  fmt.Println("Body: ", *resp[record].Body)
}
```

非同期に複数リソースを取得したい場合、 `StreamXXX` という関数名でチャネルを扱うことができます

```go
// チャネルを利用してメッセージ一覧の取得
channel, _ := client.Api.StreamMessage(params)
for record := range channel {
  fmt.Println("Body: ", *record.Body)
}
```

ListXXXやStreamXXXによるデータ取得はデフォルト50件となっていて、最大1000件まで取得することが可能です

https://github.com/twilio/twilio-go/blob/main/client/page_util.go#L10-L26

また、バッチで処理をする場合 `PageXXX` として処理することも可能です

```go
// ページング情報を扱う変数
var currentPage, nextPageToken string

// 5件ずつ処理するリクエストを生成
params := &openapi.ListMessageParams{}
params.SetPageSize(5)

// 次ページのトークンがからになるまでループを回す
for {
	// ページリクエストによるバッチデータ取得
	resp, _ := client.Api.PageMessage(params, nextPageToken, currentPage)
	for _, record := range resp.Messages {
    fmt.Println("Body: ", *record.Body)
	}
	
	// 次ページへの情報はUriとして返ってくるので必要な値のパース(ex. /2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Message.json?PageSize=5&Page=2&PageToken=PAIDc54f6171674c3fed47879caeed457ffe)
	u, _ := url.Parse(resp.NextPageUri) 
	q := u.Query()
	currentPage = q.Get("Page")
	nextPageToken = q.Get("PageToken")
	
	// 次ページが無くなったら処理を終了
	if nextPageToken == "" {
		break
	}
}
```

## TwiML周りの扱い

Twilio Client SDKを使って発着信をする場合、TwiMLを生成する必要があります

ここでは、①アクセストークンの生成, ②TwiMLの生成例を示します

### アクセストークンの作成

アクセストークンの発行例を下記に示します

```go
// identyを受け取ってアクセストークンの発行
func genCallToken(identity string) (string, error) {
  tk := jwt.CreateAccessToken(jwt.AccessTokenParams{
    AccountSid:    env.TwilioAccountSID,
    SigningKeySid: env.TwilioAPIKeyID,
    Secret:        env.TwilioAPIKeySecret,
    Identity:      identity,
  })
  
  // アクセストークンの初期化と権限設定
  tk.AddGrant(&jwt.VoiceGrant{
      Incoming: jwt.Incoming{Allow: true},
      Outgoing: jwt.Outgoing{
        ApplicationSid: env.TwilioAppSID,
      },
  })
  return tk.ToJwt()
}
```

発行されるトークンの有効期限( `TTL` )はデフォルトで1時間となっています

https://github.com/twilio/twilio-go/blob/main/client/jwt/access_token.go#L55

有効期限を変更する場合はパラメータに指定することが可能です

```go
tk := jwt.CreateAccessToken(jwt.AccessTokenParams{
  AccountSid:    env.TwilioAccountSID,
  SigningKeySid: env.TwilioAPIKeyID,
  Secret:        env.TwilioAPIKeySecret,
  Identity:      identity,
  Ttl:           60 * 60 * 24, // 24時間 ※秒で指定する必要あり
})
```

### TwiMLの生成例

発信用のTwiMLの生成例を以下に示します

下記の例では、Twilioで購入した電話番号( `to` )を利用して、 `from` へ発信するTwiMLを生成します

```go
// 発信用のTwiML生成
func genOutgoingTwiML(from, to string) (string, error) {
  dial := twiml.VoiceDial{
    Number:   to,
    CallerId: from,
    Record:   "record-from-answer-dual",
    Timeout:  "50",
  }
  return twiml.Voice([]twiml.Element{dial}) // XML宣言がついた状態で文字列が生成される
}
```

生成を行うと下記のXMLが生成されます

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial record="record-from-answer-dual" timeout="50" callerId="+81 50-xxxx-xxxx">+81 90xxxxxxxx</Dial>
</Response>
```

複数のアクションを設定する場合は、生成時の可変長引数として渡すことで可能です

```go
// 音声合成アクション
say := twiml.VoiceSay{
  Message: "hello twilio-go",
}

// 発信アクション
dial := twiml.VoiceDial{
  Number:   to,
  CallerId: from,
  Record:   "record-from-answer-dual",
  Timeout:  "50",
}
return twiml.Voice([]twiml.Element{say, dial})
```

## まとめ&所感

公式としてGoのSDKをサポートしてくれるのは心強いですね！

呼び出し可能なAPIは関数として補間されるので、ドキュメントを調べずに色々なメソッドを呼び出せるのは非常に便利！

Goを日常的に使う身としては、関数や変数名の命名規則が公式が推奨するベストプラクティスに則っていなかったり、TwiMLのパラメータを与える時にboolや数字自体も文字列として与えなきゃいけない部分に違和感や不便を感じたり...

https://github.com/golang/go/wiki/CodeReviewComments#initialisms


とはいえ今後より使いやすい形になることに期待！

