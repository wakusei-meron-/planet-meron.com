---
title: 2021年振り返り
description:
date: 2021/12/31
tags:
  - 振り返り
---

2021年もお疲れさまでした

誰かの人生ではなく自分の人生をより良く送れるために、今年やったこと・立てた目標を振り返り、2022年の目標を立てたいと思います

## 週末ワーケーション

今年一番やってよかったなと思ったのは週末ワーケーション

週末ワーケーションは旅のサブスクHafHを利用して、週末に色々な場所に行って、観光と趣味の開発を行うことに名前をつけました

週末に箱根や葉山などいって、リフレッシュしながら趣味の開発を行うことができたのは、今年1番の発見

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">3月の週末ワーケーションは箱根に行ってきた！<br>ゆっくり露天風呂にも浸かって超リフレッシュできた♨️<a href="https://twitter.com/hashtag/HafH?src=hash&amp;ref_src=twsrc%5Etfw">#HafH</a> <a href="https://twitter.com/hashtag/%E9%80%B1%E6%9C%AB%E3%83%AF%E3%83%BC%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3?src=hash&amp;ref_src=twsrc%5Etfw">#週末ワーケーション</a> <a href="https://twitter.com/hashtag/%E7%AE%B1%E6%A0%B9?src=hash&amp;ref_src=twsrc%5Etfw">#箱根</a> <a href="https://t.co/onzC6R4A3x">pic.twitter.com/onzC6R4A3x</a></p>&mdash; 石破氏 (@b0941015) <a href="https://twitter.com/b0941015/status/1376043564354789381?ref_src=twsrc%5Etfw">March 28, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr"><a href="https://twitter.com/hashtag/HafH?src=hash&amp;ref_src=twsrc%5Etfw">#HafH</a> <a href="https://twitter.com/hashtag/%E8%91%89%E5%B1%B1?src=hash&amp;ref_src=twsrc%5Etfw">#葉山</a> <a href="https://twitter.com/hashtag/%E9%80%B1%E6%9C%AB%E3%83%AF%E3%83%BC%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3?src=hash&amp;ref_src=twsrc%5Etfw">#週末ワーケーション</a> <a href="https://twitter.com/hashtag/%E8%91%89%E5%B1%B1%E3%81%86%E3%81%BF%E3%81%AE%E3%83%9B%E3%83%86%E3%83%AB?src=hash&amp;ref_src=twsrc%5Etfw">#葉山うみのホテル</a> <a href="https://twitter.com/hashtag/%E3%83%AA%E3%83%94%E3%83%BC%E3%83%88%E7%A2%BA%E5%AE%9F?src=hash&amp;ref_src=twsrc%5Etfw">#リピート確実</a> <a href="https://t.co/xEJtVWIIPX">pic.twitter.com/xEJtVWIIPX</a></p>&mdash; 石破氏 (@b0941015) <a href="https://twitter.com/b0941015/status/1421831699726409728?ref_src=twsrc%5Etfw">August 1, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## 筋トレ記録アプリ

去年の目標として `健康づくりの習慣化(筋トレ・食事・睡眠)、記録をつけて振り返られるように` ということと `アウトプットをキャッシュポイントに繋げる` という意味で、筋トレを記録するスマホ向けWEBアプリを開発した

<img src="/images/muscle-note-screenshot.png" width="200px">

https://www.muscle-note.net

技術的な試みとして、amplifyを用いて一切backend開発を行わない方法を試した

具体的には、GraphQLでスキーマ定義をしてデプロイをするとDynamoDBをバックエンドとしてCRUD処理が可能になる

2018年頃GraphQLを触っていて概念自体新しくて良いと思っていたが、開発をすすめるにあたってdebugをするためのエコシステム等が整っていないので辛い印象だった

再度使ってみた感想としては、バックエンド開発を一切やらなくてもWEBサービスを実現できる一方、ネストやリレーションを含むデータ処理においてGraphQLの定義の仕方が独自な概念だったり、DynamoDBのフィルターやソートなどSQLを普段利用している身としては新しい概念が多くて、慣れなかった...
(これが老害という可能性はあったり...)

自分もメモアプリとして利用したり、後輩にこのアプリを使ってもらったがバグが含まれてることや、入力に多くの手間がかかるなど操作性などのUXにまだまだ問題がある

とりあえずリリースすることを目的にしてたが、一旦開発停止中...
(もっと使われるような状況として発破をかけて、自分を追い込むのはありなのかな)

やはりSQLを含めたデータベースを利用したほうが個人的には色々なノウハウを持っていて使いやすいと感じてしまったので、もし次開発する時はリプレースするかも

## 2021年最初に立てた目標の振り返り

2021年のはじめに立てた目標について振り返ります

https://www.planet-meron.com/articles/20210111_look_back_on_last_year

### ①アウトプットをキャッシュポイントに繋げる

筋トレアプリをキャッシュポイントにつなげたいと思ったが、途中でモチベーションが切れてしまった...
ジモティーでプログラミングを教えるという試みもやってみたが、自分が興味をもって取り組むレベルにはならなかった
2022年は、もう少し技術的な内容を個人的に発信、作成していてキャッシュポイントにつなげたい

### ②健康づくりの習慣化(筋トレ・食事・睡眠)、記録をつけて振り返られるように

筋トレアプリを作成して3ヶ月程度は週に5日筋トレをするルーティンをできたけど、今はまたモチベーションが下がっている...笑
年の中盤まで体作りに励んで、年末サボって年始に開始する流れが続いている

### ③英語上達、特にスピーキング能力向上

ジモティーで英語を教えてくれる投稿に応募し、週1で2ヶ月くらい習い事としてやっていた
結論として、英語をやるなら時間を確保して、真面目にやらないと身につかない...もう少し、自分の興味のある所から手段としての英語からスキルアップを目指すのが良い気がした

### ④技術は音声信号処理周りをもっと勉強・発信していく

音声認識は奥が深いかつ、一般的なソリューションも提供されているので、今から本気をだして取り組もうと思っていなかったが、今やってる仕事に関係ありそうなので、少し調べて社内の勉強会で発表した
その他に音声認識における精度の計算方法など個人的に興味のある内容をまとめていたが、圧倒的にインプットが足りていない...(そもそも時間がとれていない)

<iframe src="//www.slideshare.net/slideshow/embed_code/key/4yH2wrfIbDvt6k" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/genkiishibashi3/20210903-250121299" title="仕組みから理解する人力音声認識" target="_blank">仕組みから理解する人力音声認識</a> </strong> from <strong><a href="https://www.slideshare.net/genkiishibashi3" target="_blank">Genki Ishibashi</a></strong> </div>

どの目標に対してもアプローチはできていて、合格ラインは突破している気がする

ただ、どれも当初期待しているような達成感を得るような成果にはつながっていない

やはり、目標は建てるだけでなく成果を指標として取り組むのが良いのかもしれない

## その他仕事について

今年一番頑張ったのは、今やっている仕事についてである

今までシステムについて全責任をもって開発をやっていたのを、新しくメンバーを採用、権限や責任の移譲を行ってきた

個人的に自由と放置は紙一重だし、その人の成長を第一にできる限りのサポートをしてくれる環境を望んでいた

今の状況はそういう環境を少しは提供できたのではないかと思っている

でも本当になってほしい姿は自分が全くサポートしなくても、成果を出せる人財になること

年が変わることを一つの区切りとして、組織の体制変更も行った

自分がある程度自由になるので、また新しい価値を提供できて、プロダクト自体飛躍する2022年にしていきたい

## 2022年の目標

2022年は仕事でも研究領域のことをやれる機会が増えそうなので、やりたいといいつつできなかったことを目標として4つ掲げたい

- 音声周りの技術をプロダクトに導入
  - 商用利用や学会に入って研究者の方々と繋がりを作る
- 運動の習慣化
- 第三者が提供するプラットフォームで何かしらの結果を残す(kaggle, 競プロ, etc)
- 週に1度8時間のインプット or 発信(ブログ, OSS)
- 質にこだわったアウトプット(スター100を超えるOSSの開発 or スキやlike・はてぶが100を超える記事の投稿)

コツコツやり続けていった先に自分が予期しない未来へとたどり着けるようにしたい

今年も全力で走り切るのでよろしくお願いします
