---
title: GolangでCDKを使ってみる
date: 2021/10/07
tags:
  - 2021
  - golang
  - cdk
---

今までAWSのインフラの管理にはterraformを使っていた

使い慣れていて基本的に問題は無いが、AWS上で新しくでた機能を使いたい場合など、terraformでは物足りない部分も多々あった

クラメソさんもterraformとCDKをいろいろな観点で比較検討している

<iframe class="speakerdeck-iframe" frameborder="0" src="https://speakerdeck.com/player/d9a8f050fe5d46568515bc9b33a26f33" title="AWS CDKとTerraformをn個の観点で徹底比較/compare-aws-cdk-and-terraform-from-n-perspectives" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style="border: 0px; background: padding-box padding-box rgba(0, 0, 0, 0.1); margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 560px; height: 314px;"></iframe>

新機能はいち早く使いたいという思いやCDK自体の使い心地を知りたいということで、今年GolangがCDKのサポートがされるようになったので使ってみる

## golangを使ったCDKのインストールと初期化

まずはCDK自体をインストールする

```shell
# cdkをグローバル環境にインストール
npm install -g aws-cdk
```

インストールしたcdkでプロジェクトの初期化

```
# サンプル用のディレクトリ作成して、移動
mkdir hello-cdk-go
cd hello-cdk-go

# golangを指定して初期化
$(npm bin -g)/cdk init --language=go
```

そうすると下記のようなログが出力される

```shell
Applying project template app for go
# Welcome to your CDK Go project!

This is a blank project for Go development with CDK.

**NOTICE**: Go support is still in Developer Preview. This implies that APIs may
change while we address early feedback from the community. We would love to hear
about your experience through GitHub issues.

## Useful commands

 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
 * `go test`         run unit tests
```

`deploy` でデプロイ, `diff` で差分の確認, `synth` でCloudFormationのテンプレートの出力が行える

また初期化を行うと以下のようなファイルが自動生成されている

```shell
tree .                                                                                                                                 (git)-[master]
.
├── README.md
├── cdk.json
├── go.mod
├── hello-cdk-go.go
└── hello-cdk-go_test.go
```

生成されるgoのコードは下記のようになる

```go
package main

import (
  "github.com/aws/aws-cdk-go/awscdk"
  "github.com/aws/aws-cdk-go/awscdk/awssns"
  "github.com/aws/constructs-go/constructs/v3"
  "github.com/aws/jsii-runtime-go"
)

type HelloCdkGoStackProps struct {
  awscdk.StackProps
}

func NewHelloCdkGoStack(scope constructs.Construct, id string, props *HelloCdkGoStackProps) awscdk.Stack {
  var sprops awscdk.StackProps
  if props != nil {
    sprops = props.StackProps
  }
  stack := awscdk.NewStack(scope, &id, &sprops)

  // The code that defines your stack goes here

  // as an example, here's how you would define an AWS SNS topic:
  awssns.NewTopic(stack, jsii.String("MyTopic"), &awssns.TopicProps{
    DisplayName: jsii.String("MyCoolTopic"),
  })

  return stack
}

func main() {
  app := awscdk.NewApp(nil)

  NewHelloCdkGoStack(app, "HelloCdkGoStack", &HelloCdkGoStackProps{
    awscdk.StackProps{
      Env: env(),
    },
  })

  app.Synth(nil)
}

// env determines the AWS environment (account+region) in which our stack is to
// be deployed. For more information see: https://docs.aws.amazon.com/cdk/latest/guide/environments.html
func env() *awscdk.Environment {
  // If unspecified, this stack will be "environment-agnostic".
  // Account/Region-dependent features and context lookups will not work, but a
  // single synthesized template can be deployed anywhere.
  //---------------------------------------------------------------------------
  return nil

  // Uncomment if you know exactly what account and region you want to deploy
  // the stack to. This is the recommendation for production stacks.
  //---------------------------------------------------------------------------
  // return &awscdk.Environment{
  //  Account: jsii.String("123456789012"),
  //  Region:  jsii.String("us-east-1"),
  // }

  // Uncomment to specialize this stack for the AWS Account and Region that are
  // implied by the current CLI configuration. This is recommended for dev
  // stacks.
  //---------------------------------------------------------------------------
  // return &awscdk.Environment{
  //  Account: jsii.String(os.Getenv("CDK_DEFAULT_ACCOUNT")),
  //  Region:  jsii.String(os.Getenv("CDK_DEFAULT_REGION")),
  // }
}
```

環境などの設定を行い、SNS Topicを作成していることがわかる
設定可能な変数についてはstructの中身を確認すれば良いので、ドキュメントを確認する手間がなくなって便利そう

## cdkの各コマンド(synth, diff, deploy, destroy)

`cdk synth` を実行すると `cdk.out` というディレクトリが生成され、CloudFormationのyamlファイルが標準出力に表示される

```shell
$(npm bin -g)/cdk synth
Resources:
  MyTopic86869434:
    Type: AWS::SNS::Topic
    Properties:
      DisplayName: MyCoolTopic
    Metadata:
      aws:cdk:path: HelloCdkGoStack/MyTopic/Resource
  CDKMetadata:
    Type: AWS::CDK::Metadata
・
・
・
```

`cdk diff` を実行すると差分を確認することが可能

```shell
$(npm bin -g)/cdk diff
Stack HelloCdkGoStack
Resources
[+] AWS::SNS::Topic MyTopic MyTopic86869434
```

`cdk deploy` を実行するとCloudFormationで実際にリソースが作成されます

```shell
$(npm bin -g)/cdk deploy
^[HelloCdkGoStack: deploying...
HelloCdkGoStack: creating CloudFormation changeset...

 ✅  HelloCdkGoStack
```

`cdk destroy` を実行すると作成したStackを削除します

```shell
$(npm bin -g)/cdk destroy
Are you sure you want to delete: HelloCdkGoStack (y/n)? y
HelloCdkGoStack: destroying...


✅  HelloCdkGoStack: destroyed
```

## まとめ

cdkのインストールからgolangを用いたテンプレートの実行まで行った

AWSのリソースの設定はSDKを通して利用可能なので、WEB上でドキュメントを都度管理するよりも便利かもしれない
