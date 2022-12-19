---
title: 【書評】ディープラーニング関連の最新の本2冊を読んで
description:
date: 2022/01/02
tags:
  - 2022
  - 読書
---

年末の課題図書として以下の2札を読んだ

<a target="_blank"  href="https://www.amazon.co.jp/gp/product/B09FPBQM9C/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=B09FPBQM9C&linkCode=as2&tag=planetmeron06-22&linkId=0b8aef31f66b9a026dfd6bf36ba1f6ac"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=B09FPBQM9C&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=planetmeron06-22" ></a>

[深層学習の原理に迫る　数学の挑戦 (岩波科学ライブラリー)](https://amzn.to/3zkpM8h)

<a target="_blank"  href="https://www.amazon.co.jp/gp/product/B09NQTXZXP/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=B09NQTXZXP&linkCode=as2&tag=planetmeron06-22&linkId=81553295eee56bc3db60fe921259e497"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=B09NQTXZXP&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=planetmeron06-22" ></a>

[ディープラーニングを支える技術 ——「正解」を導くメカニズム［技術基礎］ Tech × Books plus](https://amzn.to/3eOosB7)

1冊目は、深層学習がなぜ成功したのかを数式をほとんど使わず、解説する本でAmazonのおすすめに出てきたのでついつい購入

2冊目は、PFNの創業者でもある岡野原さんが執筆した本で、PFNの技術力がどのレベルまで進んでいるのか知りたい興味と最新動向について知りたかったので購入

## 感想

結論から言って、両本とも良書だった

前者の本は今までの機械学習では出なかった成果がなぜ深層学習を使うと改善されたのかについて今までの観点と深層学習における見解について要点がまとめられている

1つ紹介すると、フーリエ変換やマークローリン展開のように線形の関数を無限個重ね合わせれば、あらゆる関数を近似できるはずなのに、なぜ深層学習では層を増やす必要があるのかというものである

この問題提起自体とても理解できて、1層でニューロンの数を増やせばあらゆるものを表現できることと同義で層を増やす必要性が今までの経験とは相反する

これは、活性化関数に非線形な関数を用いることによって、連続ではない関数など表現の幅が広がることに起因する

活性化関数自体、なぜ必要なのか、非線形な変な形の関数が定義されることは知っていたが、この説明を聞き、その理由が少しわかった気がした

その他にも学習時のパラメータが多いと過学習するのに、なぜ深層学習の学習はうまくいくのかという問題など、一度は既存の機械学習を触った人であれば今までの概念を覆す話がたくさん出てきて非常に興味深い

後者の本では、非常に基礎的な話から、最近の動向まで丁寧に書かれている

個人的には、深層学習の学習における3大発明(①活性化関数としてのReLU②バッチ正規化③スキップ接続)や注意機構という概念が理論も含めて非常に面白かった

とにかくあらゆる要素技術について丁寧な解説がついていて、著者の理解の深さがとても伺える良書でした

実装とはすこし違うが、深層学習の全体像を掴むにはとてもおすすめしたい本でした

