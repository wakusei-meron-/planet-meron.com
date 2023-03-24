---
title: Lambda(Go)を利用したCognitoへのユーザー移行
date: 2021/11/12
tags:
- golang
- cognito
---

既にアプリケーションを運用していてセキュリティの都合上などユーザーの認証基盤としてCognitoを利用したいことってありますよね

そんな時Cognitoにはユーザー移行の手段として2つの方法があります

CSVによる一括インポートとlambdaを利用した既存ログインシステムを利用したユーザー移行です

CSV取込とlambda取込の大きな違いは既に利用しているパスワードをそのまま利用できるか否かです

CSV取込の場合、ユーザーがログイン時にパスワードを再設定する必要がある一方、lambdaを利用したユーザー移行の場合、パスワードをそのままユーザーを移行することができます


今回はlambdaを利用したユーザー移行についての備忘録です

## ユーザー移行用のlambdaの用意

今回はlambdaに利用する関数としてGoを用いた

ログイン時に実行する処理を下記に示します

```go
package main

import (
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	lambda.Start(func(events *events.CognitoEventUserPoolsMigrateUser) (*events.CognitoEventUserPoolsMigrateUser, error) {

		// 既存基盤のログイン処理
		user, err := login(events.UserName, events.Password)
		if err != nil {
			//　ログイン失敗
			return nil, err
		}

		// Cognitoに設定したいユーザー情報の登録
		events.UserAttributes = map[string]string{
			"email":          user.Email,
			"email_verified": "true", // 検証済みのメールかどうか
		}

		// ユーザーのステータス
		// パスワードの再設定が必要な場合はRESET_REQUIREDにする
		events.FinalUserStatus = "CONFIRMED"

		// ユーザーインポート後のアクション
		// デフォルトだとメールが送られるが、SURPRESSの場合何もしない
		events.MessageAction = "SUPPRESS"

		return events, nil
	})
}
```

また上記lambdaをsamでデプロイするための設定は下記の通り

注意する部分としてはlambdaを起動するための起動するための権限をCognitoに与えなきゃいけない点

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: user_migration

Globals:
  Function:
    Timeout: 5
    Environment:
      Variables:
        TZ: Asia/Tokyo

Resources:
  UserMigration:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: UserMigration
      CodeUri: ../../dist/event
      Handler: user-migration
      Runtime: go1.x
      Timeout: 300
      Description: Cognitoへのユーザー移行用の処理
      Policies: [ AWSLambdaVPCAccessExecutionRole ]
      Role: lambda-user-migration-role
  InvokePermission:
    Type: AWS::Lambda::Permission
    Properties:
      FunctionName: !GetAtt UserMigration.Arn
      Action: lambda:InvokeFunction
      Principal: cognito-idp.amazonaws.com
      SourceArn: arn:aws:cognito-idp:ap-northeast-1:1234567890:userpool/ap-northeast-1_XXXXXXXX
```

## cognito上の設定

実際にログインに使用するcognitoの設定部分に関しては下記の通りである

ここではログインに必要なIDをemailとしている

```hcl
# ユーザープール
resource "aws_cognito_user_pool" "example" {
  name = "userpool"

  # ログインはemail or 電話番号
  username_attributes = ["email"]
  username_configuration {
    # ユーザー名(Email)で大文字小文字を区別しない。
    case_sensitive = false
  }

  # 「schema」は登録するユーザーに求める属性。(メールアドレスや電話番号など)
  # 「email」はデフォルトで有効になっている属性だが、今回は登録時に必須にしたいため設定。
  schema {
    attribute_data_type = "String"
    developer_only_attribute = false
    mutable = false
    name     = "email"
    required = true

    string_attribute_constraints {
      max_length = "2048"
      min_length = "0"
    }
  }

  # lambdaトリガーの設定
  lambda_config {
    user_migration = "arn:aws:lambda:ap-northeast-1:1234567890:function:UserMigration"
  }
}

# ユーザープールを利用するクライアント
resource "aws_cognito_user_pool_client" "example" {
  name = "userpool-client"

  user_pool_id = aws_cognito_user_pool.example.id

  // cognitoの認証方法の設定
  // lambdaを利用したユーザー移行をする場合、ALLOW_USER_PASSWORD_AUTHを指定する必要あり
  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
  ]

  // cognitoのUIを利用したログインを可能にする
  supported_identity_providers = ["COGNITO"]
  allowed_oauth_flows = ["code", "implicit"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes = ["email", "openid"]
  
  // ログイン・ログアウト時のコールバック先のURL
  callback_urls = ["http://localhost:3000"]
  logout_urls = ["http://localhost:3000"]
}

# cognitが提供するUIを利用するためにドメインの設定
resource "aws_cognito_user_pool_domain" "main" {
  domain       = "example"
  user_pool_id = aws_cognito_user_pool.example.id
}
```

上記の設定を反映させたらcognitoのUIを開く

[<img src="/images/20211112_cognito_ui.png" width="800px">](https://m.jype.com/)

cognitoのUIが開かれれば、既存のアプリで利用していたID/PWを入力してSign inをする

[<img src="/images/20211112_login.png" width="400px">](https://m.jype.com/)

cognitoのユーザーディレクトリに対象のユーザーが存在すれば、その中でログイン判定を行い、存在しないユーザーだとlambdaが起動される

lambdaの引数にID/PWが載ってくるので、それを利用し既存システムでログインを試みる

ログインに成功したユーザーの場合、必要な情報をセットすることでcognito上でユーザーが生成される

## ハマったポイント

`events.MessageAction` に `SUPPRESS` を指定していない場合、ユーザーに対して初回ログインを知らせるメールが送信される

ただ、Cognito上でSESなどメールの設定をしていないとログインに失敗してしまう

lambdaを起動するcognitoのログがどこにも出力され無かったので、ログイン処理が成功していてもユーザー移行に失敗する問題が発生し、原因を突き詰めるのに非常に時間がかかった

cognitoのlambda処理の失敗理由をどこかにログとして吐いてくれるともっと嬉しいなと思った...

## まとめ

lambda(go)を利用したcognitoのユーザー移行の処理をまとめました

WEB上に関連する情報がほとんどなくて困ったので、ここにまとめる

誰かのためになれば幸いです


