---
title: AWSのクレデンシャルにMFAを必須にする
description:
date: 2021/10/21
tags:
- 2021
- golang
- iam
---

AWSのログイン画面に対してMFAを導入してる一方、クレデンシャルに対してノーガードの人が多いのではないだろうか

クレデンシャルを利用したcliのアクセスに対してもMFAを有効化する方法とセッションを更新する方法についてまとめる

## 前提条件

* MFAの設定がされている

## MFAを矯正するポリシー

IAMユーザーに対してMFAの設定を強制化するには下記のポリシーを付与する

下記のポリシーでは、パスワードの変更やMFAの設定については許可されている

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowViewAccountInfo",
            "Effect": "Allow",
            "Action": [
                "iam:GetAccountPasswordPolicy",
                "iam:GetAccountSummary",
                "iam:ListVirtualMFADevices"
            ],
            "Resource": "*"
        },
        {
            "Sid": "AllowManageOwnPasswords",
            "Effect": "Allow",
            "Action": [
                "iam:ChangePassword",
                "iam:GetUser"
            ],
            "Resource": "arn:aws:iam::*:user/${aws:username}"
        },
        {
            "Sid": "AllowManageOwnAccessKeys",
            "Effect": "Allow",
            "Action": [
                "iam:CreateAccessKey",
                "iam:DeleteAccessKey",
                "iam:ListAccessKeys",
                "iam:UpdateAccessKey"
            ],
            "Resource": "arn:aws:iam::*:user/${aws:username}"
        },
        {
            "Sid": "AllowManageOwnSigningCertificates",
            "Effect": "Allow",
            "Action": [
                "iam:DeleteSigningCertificate",
                "iam:ListSigningCertificates",
                "iam:UpdateSigningCertificate",
                "iam:UploadSigningCertificate"
            ],
            "Resource": "arn:aws:iam::*:user/${aws:username}"
        },
        {
            "Sid": "AllowManageOwnSSHPublicKeys",
            "Effect": "Allow",
            "Action": [
                "iam:DeleteSSHPublicKey",
                "iam:GetSSHPublicKey",
                "iam:ListSSHPublicKeys",
                "iam:UpdateSSHPublicKey",
                "iam:UploadSSHPublicKey"
            ],
            "Resource": "arn:aws:iam::*:user/${aws:username}"
        },
        {
            "Sid": "AllowManageOwnGitCredentials",
            "Effect": "Allow",
            "Action": [
                "iam:CreateServiceSpecificCredential",
                "iam:DeleteServiceSpecificCredential",
                "iam:ListServiceSpecificCredentials",
                "iam:ResetServiceSpecificCredential",
                "iam:UpdateServiceSpecificCredential"
            ],
            "Resource": "arn:aws:iam::*:user/${aws:username}"
        },
        {
            "Sid": "AllowManageOwnVirtualMFADevice",
            "Effect": "Allow",
            "Action": [
                "iam:CreateVirtualMFADevice",
                "iam:DeleteVirtualMFADevice"
            ],
            "Resource": "arn:aws:iam::*:mfa/${aws:username}"
        },
        {
            "Sid": "AllowManageOwnUserMFA",
            "Effect": "Allow",
            "Action": [
                "iam:DeactivateMFADevice",
                "iam:EnableMFADevice",
                "iam:ListMFADevices",
                "iam:ResyncMFADevice"
            ],
            "Resource": "arn:aws:iam::*:user/${aws:username}"
        },
        {
            "Sid": "DenyAllExceptListedIfNoMFA",
            "Effect": "Deny",
            "NotAction": [
                "iam:CreateVirtualMFADevice",
                "iam:EnableMFADevice",
                "iam:GetUser",
                "iam:ListMFADevices",
                "iam:ListVirtualMFADevices",
                "iam:ResyncMFADevice",
                "sts:GetSessionToken"
            ],
            "Resource": "*",
            "Condition": {
                "BoolIfExists": {
                    "aws:MultiFactorAuthPresent": "false"
                }
            }
        }
    ]
}
```

## cliからMFA認証をする

`sts` の `get-session` に対して `--serial-number` でmfaのARNを指定し、MFAの値を `--token-code` に指定する


```shell
# mfaを指定したセッショントークンの取得
aws sts get-session-token --serial-number arn:aws:iam::1234567890:mfa/username --token-code 616142

{
    "Credentials": {
        "AccessKeyId": "ASIAXXXXXXXXXXXXXX",
        "SecretAccessKey": "5wWi+HdJJfE9pOAKhogehogehogeyrJKHRrfQL",
        "SessionToken": "IQoJb3JpZ2luX2VjEGMaDmFwLW5vcnRoZWFzdC0xIkgwRgIhAM5gUp4iQjGvbokOF0459XNqqiF1qydy84rrH2ClD3INAiEAxqbppAwyRKU/9Aews3XbcACnG3njByq3WrFOtrhK3MEq+AEI7P//////////ARACGgwxMDY4MDM2MDI2MDQiDKYUde38SwhQM4c8WSrMAbJCtbFlaUOGILbU9KnFLjo540LEdSh2pDbwuAYxlPIqx59THazb87rbkzZA2LxObhOK6+LHJaAj3vueBA1V/K/d3UuwYFULrCqkeANGolAC7lebaHpYFVWPpjpH01oIvzN98kLlWPSTUrHmyGT2LdCFWerYR5IYjkyIkSvTFZEAiIOjIsV+pOyNm3kGYOkdxtcPABJCEgsrVnxnaHWsEV3dXIpBk0/4/v3ykqWBCENJ7gHaHKFE+f8HeDVdXKbqwCxpLe5ke1cQgxU88jCZjsWLBjqXAfpydgEtFqkJp/vstOiKXwGzRz7z8cDSuhSH31WJqdjkrAt7s1R4q/0VAtHBycanLY0eD0xRhIGDGMI7AsOe1ZO+gnV3XexoWnKUv18ZRK09N8CjrYB/lZiLBDdx1masG8hogehogehogehogegehogehogheogeh=",
        "Expiration": "2021-10-22T22:55:21+00:00"
    }
}
```

取得したidとtokenを設定するとアクセスが可能になる

ここでは `mfa` というプロファイルにセッションを設定している

```shell
# セッション情報をmfaというprofileに設定
aws configure set profile.mfa.aws_access_key_id ASIAXXXXXXXXXXXXXX
aws configure set profile.mfa.aws_secret_access_key 5wWi+HdJJfE9pOAKhogehogehogeyrJKHRrfQL
aws configure set profile.mfa.aws_session_token IQoJb3JpZ2luX2VjEGMaDmFwLW5vcnRoZWFzdC0xIkgwRgIhAM5gUp4iQjGvbokOF0459XNqqiF1qydy84rrH2ClD3INAiEAxqbppAwyRKU/9Aews3XbcACnG3njByq3WrFOtrhK3MEq+AEI7P//////////ARACGgwxMDY4MDM2MDI2MDQiDKYUde38SwhQM4c8WSrMAbJCtbFlaUOGILbU9KnFLjo540LEdSh2pDbwuAYxlPIqx59THazb87rbkzZA2LxObhOK6+LHJaAj3vueBA1V/K/d3UuwYFULrCqkeANGolAC7lebaHpYFVWPpjpH01oIvzN98kLlWPSTUrHmyGT2LdCFWerYR5IYjkyIkSvTFZEAiIOjIsV+pOyNm3kGYOkdxtcPABJCEgsrVnxnaHWsEV3dXIpBk0/4/v3ykqWBCENJ7gHaHKFE+f8HeDVdXKbqwCxpLe5ke1cQgxU88jCZjsWLBjqXAfpydgEtFqkJp/vstOiKXwGzRz7z8cDSuhSH31WJqdjkrAt7s1R4q/0VAtHBycanLY0eD0xRhIGDGMI7AsOe1ZO+gnV3XexoWnKUv18ZRK09N8CjrYB/lZiLBDdx1masG8hogehogehogehogegehogehogheogeh=
```

上記の操作を行うと一時的に `mfa` のprofileに対して、MFA認証済みの一時的な権限が付与される

```shell
# 設定されたprofileを用いてアクセス
aws s3 ls --profile mfa
```

上記の処理を毎回やるのはめんどくさいので、ワンライナーで実行できるようなスクリプトを作成した

https://gist.github.com/wakusei-meron-/caa758bdd140d90a8507895f29ae4617

実行方法については下記の通りである

```shell
## ex. defaultのprofileでmfaのprofileに権限付与
curl -sf https://gist.githubusercontent.com/wakusei-meron-/caa758bdd140d90a8507895f29ae4617/raw/d7b01716003888e65ce3a1bd89681823191d46e9/session_token.sh | sh -s 647023

## ex.2 usernameのprofileでhogehogeのprofileに権限付与
curl -sf https://gist.githubusercontent.com/wakusei-meron-/caa758bdd140d90a8507895f29ae4617/raw/d7b01716003888e65ce3a1bd89681823191d46e9/session_token.sh | PROFILE=username OUTPUT_PROFILE=hogehoge sh -s 647023
```

## まとめ

これでcliのクレデンシャルの安全性も確保できるようになったとさ

めでたしめでたし
