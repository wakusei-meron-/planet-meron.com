---
title: 音声認識システムの性能・精度について
description:
date: 2021/09/24
tags:
- 2021
- 音声認識
- 精度評価
---

音声認識の性能を図る評価基準には①応答速度と②誤認識が少ないという2つの観点があります

## 応答速度の評価基準

リアルタイムで音声認識を行う場合など、処理をするのに必要な時間が短いほど高性能といえます

この性能を一般には、実時間比(real time factor; RTF)というもので測られます

RTFは、音声を処理するのに要した時間を処理した音声の長さで割った値です

```math
RTF = (処理時間) / (音声の長さ)
```

処理時間が音声の長さを超える、`RTF>1` となる場合、発声を終えてもすぐに結果が表示されません

システムの利用用途によりますが、RTFの値が小さいほど高性能な音声認識システムと言えそうです


## 認識性能の評価基準

下記のように音声認識の結果が得られた場合、精度はどのように計算できるでしょうか

```text

正解の文: 今日はとても晴れています
認識結果: 今日は　　　晴れていました
```

### 文章比較における3つの誤り

文章の違いを比較する場合、3つの違いが存在します

1. 削除誤り(Deletion error)

削除誤りは、正解文には存在するが音声認識の結果存在しない誤りです

上記の例では「とても」という単語が認識できていない部分に該当します

2. 置換誤り(Substitution error)

置換誤りは、正解文に存在する文字が、異なる文字として認識される誤りです

上記の例では 「晴れていま`す`」が「晴れていま`し`」となっている部分が該当します

3. 挿入誤り(Insertion error)

挿入誤りは、正解文に存在しない文字が、認識結果に存在する誤りです

上記の例では「晴れていまし`た`」の部分に相当します

### 認識精度の計算方法

上記の誤りを評価する方法として主に2種類の方法が利用されます

それは単語正解率(Percent Correct; PC)と単語正解精度(Word Accuracy; WA)です

それではそれぞれ比較してしましょう

#### PCの場合

それぞれの文をmecabを使って形態素解析をした結果を下記に示します

```shell
echo "今日はとても晴れています" | mecab
今日	名詞,副詞可能,*,*,*,*,今日,キョウ,キョー
は	助詞,係助詞,*,*,*,*,は,ハ,ワ
とても	副詞,助詞類接続,*,*,*,*,とても,トテモ,トテモ
晴れ	動詞,自立,*,*,一段,連用形,晴れる,ハレ,ハレ
て	助詞,接続助詞,*,*,*,*,て,テ,テ
い	動詞,非自立,*,*,一段,連用形,いる,イ,イ
ます	助動詞,*,*,*,特殊・マス,基本形,ます,マス,マス
EOS
```

```shell
echo "今日は晴れていました" | mecab
今日	名詞,副詞可能,*,*,*,*,今日,キョウ,キョー
は	助詞,係助詞,*,*,*,*,は,ハ,ワ
晴れ	動詞,自立,*,*,一段,連用形,晴れる,ハレ,ハレ
て	助詞,接続助詞,*,*,*,*,て,テ,テ
い	動詞,非自立,*,*,一段,連用形,いる,イ,イ
まし	助動詞,*,*,*,特殊・マス,連用形,ます,マシ,マシ
た	助動詞,*,*,*,特殊・タ,基本形,た,タ,タ
EOS
```

正解文の単語数は7単語で、削除誤りが1, 置換誤りが1, 挿入誤りが1となっています

PCは下記のような定義で計算されます

```math
PC = (正解単語数) / (認識対象単語数) 
   = (認識対象単語数 - 置換誤り - 削除誤り) / (認識対象単語数) 
   = (7 -1 -1) / 7 = 0.714.... ≒ 71[%]
```

定義を見てわかるように、PCでは予測対象単語に対して、どの程度正しく認識できているかを表す指標となっています

ただし、PCの計算のでは、挿入誤りを考慮していないので、挿入誤りが多い場合、現実的な用途として意味をなさない場合があります

#### WAの場合

WAは下記のような定義で計算されます

```math
WA = (正解単語数) / (認識対象単語数) 
    = (認識対象単語数 - 置換誤り - 削除誤り - 挿入誤り) / (認識対象単語数) 
    = (7 -1 -1 -1) / 7 = 0.5714... ≒ 57[%]
```

挿入誤りが多くなる場合、WAは負の値を取ることがあり、厳密には率ではありません

ただ、実用上WAが使われることが多く、日本語では便宜上WAを単語正解率と呼ばれることが多いようです

## まとめ

いかがだったでしょうか？

音声認識システムの性能を表す応答速度と認識性能の評価指標を紹介しました

その他実際に運用する上で注意する点として、口頭の文章の場合「あー」や「えーと」などのフィラーの扱いをどうするかや、「6」と「六」など同じものを表す場合でも表記が異なるものを合わせる必要があります

とりあえず、これで音声認識の精度を評価できるようになったので、いろいろなモデルやロジックを変えたときの良し悪しを定量に比較できるようになりました