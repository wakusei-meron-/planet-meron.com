---
title: Juliusではじめての音声認識
description:
date: 2021/09/23
tags:
- 2021
- 音声認識
- Julius
---

## Juliusとは

Juliusは京都大学や名古屋工業大学の研究室が開発しているオープンソースの音声認識ライブラリです

* [Github](https://github.com/julius-speech/julius)

音声認識を行う場合、音響モデルや言語モデルを作成するのに非常に時間がかかるが、日本語のモデル(dictation-kit)も公開されているので、動作させるだけならサクッと利用することが可能

## Juliusのインストール

[公式のHP](http://julius.osdn.jp/index.php?q=dictation-kit.html)より、2021/09/23時点で最新のver4.5をダウンロードして、インストールを行います

```shell
# 日本語のdictation-kitのダウンロード
wget https://osdn.net/dl/julius/dictation-kit-4.5.zip

# ダウンロードしたパッケージの解凍
unzip dictation-kit-4.5.zip

# juliusのインストール
cd dictation-kit-4.5/src
unzip julius-4.5.zip
cd julius-4.5
./configure --prefix=/usr/local
make
make install

# インストールされたかどうかの確認
julius -version
JuliusLib rev.4.5 (fast)

Engine specification:
 -  Base setup   : fast
・
・
・
```

## 音声認識する音声ファイルの準備

Juliusで音声ファイルを入力として用いる場合、指定されたフォーマットに合わせる必要があります

* 量子数: 16 bit
* チャンネル数: 1(モノラル)
* サンプリングレート: 16 kHz

https://julius.osdn.jp/juliusbook/ja/desc_adin.html

入力したい音声ファイルがmp3などの場合は、ffmpeg等を利用して変換を行ってください

```shell
# Juliusで入力可能な形式に変換
ffmpeg -i audio.mp3 -ar 16000 -ac 1 -acodec pcm_s16le auido.wav
```

## Juilusの起動と音声認識

配布されているパッケージには混合ガウス分布(GMM)とディープラーニング(DMM)のモデルが含まれている

まずは、GMMのモデルでJuliusを起動してみましょう

```shell
# GMMのモデルを利用して、Juliusの起動
julius -C main.jconf -C am-gmm.jconf -input rawfile
STAT: include config: main.jconf
STAT: include config: am-gmm.jconf
STAT: jconf successfully finalized
STAT: *** loading AM00 _default
・
・
・
### read waveform input
enter filename->
```

モデルが正常に読み込まれ、上記のプロンプトが表示されたら音声ファイルを入力値として与えると音声認識の結果が表示される

今回は[日本声優統計学会のコーパス](https://voice-statistics.github.io/)の音声ファイルを利用した

<audio src="/audio/fujitou_normal_018.wav" controls></audio>

```
他のメジャーなディストリビューションに比べセキュリティー上の問題の修正が遅い場合もある
```

先程のプロンプトに変換したwavファイルのパスを渡すと音声認識が開始される

```shell
### read waveform input
enter filename->audio.wav
・
・
・
sentence1:  あの ね ジャーナリスト に 臨床 に 比べ 、 セキュリティー 上 の 問題 の 修正 が 遅い 場合 も ある 。
wseq1: <s> あの+連体詞 ね+助詞 ジャーナリスト+名詞 に+助詞 臨床+名詞 に+助詞 比べ+動詞 、+補助記号 セキュリティー+名詞 上+接尾辞 の+助詞 問題+名詞 の+助詞 修正+名詞 が+助詞 遅い+形容詞 場合+名詞 も+助詞 ある+動詞 </s>
phseq1: silB | a n o | n e | j a: n a r i s u t o | n i | r i N sh o: | n i | k u r a b e | sp | s e ky u r i t i | j o: | n o | m o N d a i | n o | sh u: s e: | g a | o s o i | b a a i | m o | a r u | silE
cmscore1: 0.801 0.400 0.054 0.856 0.188 0.067 0.963 0.224 0.974 0.585 0.292 0.612 0.780 0.759 0.106 0.802 0.675 0.865 0.934 0.833 1.000
score1: -15867.260742

```

同様にDNNのモデルを使い音声認識を行ってみる

```shell
# ディープニューラルネットワークを利用した音声認識
julius -C main.jconf -C am-dnn.jconf -dnnconf julius.dnnconf -input rawfile
enter filename->audio.wav
・
・
・
sentence1:  あの 名 ジャーナリスト り ビジョン に 比べ 、 セキュリティー 上 の 問題 の 修正 が 遅い 場合 も ある 。
wseq1: <s> あの+連体詞 名+接頭辞 ジャーナリスト+名詞 り+助動詞 ビジョン+名詞 に+助詞 比べ+動詞 、+補助記号 セキュリティー+名詞 上+接尾辞 の+助詞 問題+名詞 の+助詞 修正+名詞 が+助詞 遅い+形容詞 場合+名詞 も+助詞 ある+動詞 </s>
phseq1: sp_S | a_B n_I o_E | m_B e:_E | j_B a:_I n_I a_I r_I i_I s_I u_I t_I o_E | r_B i_E | b_B i_I j_I o_I N_E | n_B i_E | k_B u_I r_I a_I b_I e_E | sp_S | s_B e_I ky_I u_I r_I i_I t_I i:_E | j_B o:_E | n_B o_E | m_B o_I N_I d_I a_I i_E | n_B o_E | sh_B u:_I s_I e:_E | g_B a_E | o_B s_I o_I i_E | b_B a_I a_I i_E | m_B o_E | a_B r_I u_E | sp_S
cmscore1: 0.674 0.310 0.048 0.986 0.038 0.123 0.986 0.512 0.992 0.643 0.697 0.899 0.980 0.975 0.532 0.966 0.648 0.948 0.916 0.976 1.000
score1: 609.903259
```

音声認識で出力された結果を比較してみる
```text
# 正しい音声
他のメジャーなディストリビューションに比べセキュリティー上の問題の修正が遅い場合もある

# GMMで音声認識された結果
あのねジャーナリストに臨床に比べ、セキュリティー上の問題の修正が遅い場合もある

# DNNで音声認識の結果
あの名ジャーナリストりビジョンに比べ 、セキュリティー上の問題の修正が遅い場合もある
```

前半部分の音声を正しく認識できていないが、後半の部分はどちらのモデルでも問題なさそう
`他の(たの)` や `ディストリビューション` という単語自体登録されていない可能性がある

scoreを見ても単語を正しく判定できていない様子もみてとれる

## まとめ

Juliusをインストールし、GMMとDNNで音声認識をやってみた

意外と簡単に音声認識の結果を得ることができてすごいと思った！

これから中身の仕組みや、より精度の高い音声認識をするために必要なことを書いていきたい



