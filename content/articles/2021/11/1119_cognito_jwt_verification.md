---
title: Cognitoで発行したトークンをGoで検証する
date: 2021/11/21
tags:
- golang
- cognito
- echo
---

Cognitoの認証によってAWSの権限を利用する場合、適切なIAMロールを設定することによしなに権限の検証を行ってくれる

ただ自前でリソースサーバー等を使う場合、Cognitoによって発行されたトークンを検証する必要がある

ここでは、Echoを使ったHTTPサーバーでCognitoによって発行されたトークンを検証、claimの中身を利用する

## パブリックなJSON Web キー(JWK)

Cognitoではユーザーブールを作成するとパブリックなJWKが取得可能になる

`https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json`

こちらのURLにアクセスすると下記のようなJSONが取得される

```json
{
	"keys": [{
		"kid": "1234example=",
		"alg": "RS256",
		"kty": "RSA",
		"e": "AQAB",
		"n": "1234567890",
		"use": "sig"
	}, {
		"kid": "5678example=",
		"alg": "RS256",
		"kty": "RSA",
		"e": "AQAB",
		"n": "987654321",
		"use": "sig"
	}]
}
```

これらを用いて、発行されたトークンの検証を行う

## トークンの検証

下記に証明書を利用したトークンの検証方法についてのコードを示す

```go
package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	jwt "github.com/golang-jwt/jwt"
	echo "github.com/labstack/echo/v4"
	middleware "github.com/labstack/echo/v4/middleware"
	jwk "github.com/lestrrat-go/jwx/jwk"
)

func getKey(token *jwt.Token) (interface{}, error) {

	// アクセスの度にパブリックキーを取得するので注意
	keySet, err := jwk.Fetch(context.Background(), fmt.Sprintf("https://cognito-idp.%s.amazonaws.com/%s/.well-known/jwks.json", region, userPoolID))
	if err != nil {
		return nil, err
	}

	keyID, ok := token.Header["kid"].(string)
	if !ok {
		return nil, errors.New("expecting JWT header to have a key ID in the kid field")
	}

	key, found := keySet.LookupKeyID(keyID)

	if !found {
		return nil, fmt.Errorf("unable to find key %q", keyID)
	}

	var pubkey interface{}
	if err := key.Raw(&pubkey); err != nil {
		return nil, fmt.Errorf("Unable to get the public key. Error: %s", err.Error())
	}

	return pubkey, nil
}

func restricted(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	name := claims["name"].(string)
	return c.String(http.StatusOK, "Welcome "+name+"!")
}

func main() {
	e := echo.New()

	// Restricted group
	r := e.Group("/restricted")
	{
		config := middleware.JWTConfig{
			KeyFunc: getKey,
		}
		r.Use(middleware.JWTWithConfig(config))
		r.GET("", restricted)
	}

	e.Logger.Fatal(e.Start(":1323"))
}
```

今回の例だとアクセスを受ける度にJWKを取得するロジックになっているため、実運用するにはオーバーヘッドが大きい可能性がある

自分がこの辺りの仕様について詳しいわけではないが、JWK自体更新されずにCognitoのユーザープールに紐づくものであれば、ローカルにファイルを落として利用することが可能だが、更新される場合、定期的に取得する必要がある

本番環境で利用する際にはURLをキーとして、ローカルキャッシュを利用する形にしようと思う

## 参考文献
* [JSON Web トークンの検証](https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html)
* [JWT Recipe](https://echo.labstack.com/cookbook/jwt/)
