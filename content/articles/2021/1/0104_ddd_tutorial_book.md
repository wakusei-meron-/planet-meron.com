---
title: DDDをかじったけどよく分かってない人にオススメの1冊
date: 2021/01/04
tags:
  - DDD
  - book
---

DDD の勉強をして挫折したことないですか？

DDD についてネットで調べても概要や断片的な情報しか得られないし、[エリック・エヴァンスのドメイン駆動設計](https://amzn.to/2WYYQJ8) の本も重厚過ぎて一読しただけじゃ全然頭に入ってこない

正直自分は何度も挫折しました

でもそんな人に贈りたいのがこの本

<a target="_blank"  href="https://www.amazon.co.jp/gp/product/B082WXZVPC/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=B082WXZVPC&linkCode=as2&tag=planetmeron06-22&linkId=c4658769bc85d35b50222f19650c1407"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=B082WXZVPC&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=planetmeron06-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=planetmeron06-22&l=am2&o=9&a=B082WXZVPC" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

<a target="_blank" href="https://www.amazon.co.jp/gp/product/B082WXZVPC/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=B082WXZVPC&linkCode=as2&tag=planetmeron06-22&linkId=bb32048e9c82b435707ec59a236af63c">ドメイン駆動設計入門 ボトムアップでわかる！ドメイン駆動設計の基本</a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=planetmeron06-22&l=am2&o=9&a=B082WXZVPC" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

DDD をかじったけど用語とか概念とかよく分かっていない人はぜひ読んで欲しい

以下、その理由を綴っていきます

## DDD を体系的に学ぶことができる

DDD の本質は、Domain Driven Design (ドメイン駆動設計)という言葉からもわかるように、ドメインロジックと呼ばれる現実世界の問題解決するためのロジックから設計を行う手法です

ドメインロジックを如何に構築するか、ドメインロジックを表現するためにどんな手法があるかというのが本書の内容です

この本のおすすめポイントは、

① DDD で用いられる用語の解説だけでなく、それをなぜ使う必要があるのかということへの言及がある

② 依存関係逆転の法則やクリーンアーキテクチャなど用語だけでなく関連する内容を体系的に学ぶことができる

という 2 点です

初めにも書いたのですが、DDD を真面目に勉強しようとした時にネットで調べるだけでは、断片的な知識かつ抽象的な内容が多いので、自信をもって DDD を理解できたといえないのが現状じゃないでしょうか

クリーンアーキテクチャが流行っているから使ってみようという話はよく聞きますが、使い道を誤るとただただ工数がかかり、手間のかかる開発になることが多いと思います

なぜ DDD を取り入れて値オブジェクトやDIを使うと良いのかということが何よりも大事で、そこをソースコードを含めて解説してくれる本書は、設計という正解のない課題に向き合うための基礎を作ってくれます

## トランザクションや非機能要件など DDD で難しい部分を解決する一つの解を提示してくれている

この本を読む前の自分の DDD に対する理解はドメインロジックを起点として、それを実現するための機能開発をするというシンプルなものでした

例を挙げると、ユーザー登録というロジックを DDD で設計した場合、ユーザー情報を受け取って保存するということだけに焦点を当てるので、保存先が DB だろうとテキストファイルだろうと何でも良いという考え方です

ただこの理解だけだと、 SQL のコネクションを引き回すトランザクションを使いたい時に、ドメイン内に SQL という概念を持ち込まざるを得ない状況になり、困った経験があります

また、 DDD で設計を行っているとレイテンシーのように非機能要件を満たすロジックが必要になった場合、ドメインロジックの表現方法に悩んだ経験もあります

データソースがキャッシュでも DB でも意識せずに値を取得できることが DDD のメリットである一方、レイテンシー改善などの非機能要件によって SQL をチューニングしたい・DB にすらアクセスしたくないという場合、repository内の処理をドメインロジックに取り込みたくないが、どうやって表現をするか

これらの問題にも本書は一つの解を与えてくれています

一般的な技術書は機能の説明から入ることも多いのですが、体系的かつ、なぜその機能が存在するのかの解説をしてくれるので、盲目的に従うだけでなく、その機能をあえて使わないという選択肢も取ることができるようになります

## まとめ

この他にも語りたいことがいっぱいあるのですが、DDD に興味がある・かじったけど全体像をよく理解できてない人におすすめの一冊

2021 年のスタートダッシュにぜひどうぞ

<a target="_blank"  href="https://www.amazon.co.jp/gp/product/B082WXZVPC/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=B082WXZVPC&linkCode=as2&tag=planetmeron06-22&linkId=c4658769bc85d35b50222f19650c1407"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=B082WXZVPC&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=planetmeron06-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=planetmeron06-22&l=am2&o=9&a=B082WXZVPC" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

<a target="_blank" href="https://www.amazon.co.jp/gp/product/B082WXZVPC/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=B082WXZVPC&linkCode=as2&tag=planetmeron06-22&linkId=bb32048e9c82b435707ec59a236af63c">ドメイン駆動設計入門 ボトムアップでわかる！ドメイン駆動設計の基本</a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=planetmeron06-22&l=am2&o=9&a=B082WXZVPC" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
