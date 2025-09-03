---
title: Manimに入門してみる
date: 2025/09/03
tags:
  - Python
  - manim
---

## はじめに

数式をわかりやすいアニメーション化できないか調査していたところmanimというものが存在していることを見つけた

https://docs.manim.community/en/stable/index.html

今後学習したことのアウトプットの方法として数式を単純に書くだけではわかりにくいので、アニメーションによる表現で理解しやすくなることを期待して使い方を学ぶ

## manimのインストール

公式の手順はこちら
https://github.com/3b1b/manim?tab=readme-ov-file#mac-osx


Macの環境で数式を扱う場合にはmactexをインストーする必要がある

```bash
brew install ffmpeg mactex
```

AppleシリコンベースのCPUではCairoをインストールしたほうが良いらしい(インストールしなくても動作はした)

```bash
# cairoのインストール
arch -arm64 brew install pkg-config cairo
```

manim自体はconda環境を作成してインストールを行う

またjupyter notebook上で動画を作成したいので、jupyter-labもインストールする

```bash
# conda環境の初期化
conda create -n manim python=3.11 -y

# manimとjupyterlabのインストール
conda install -c conda-forge manim jupyterlab

# jupyterlabの起動
jupyter-lab
```

jupyter-labでnotebookを開いて、manimのアニメーションを作成してみる

## 基本的な使い方 ~円から四角へ~

```python
import manim as mn
from manim import *
```

```python
%%manim -qm CircleToSquare

class CircleToSquare(Scene):
    def construct(self):
        blue_circle = Circle(color=BLUE, fill_opacity=0.5)
        green_square = Square(color=GREEN, fill_opacity=0.8)
        self.play(Create(blue_circle))
        self.wait()
        
        self.play(Transform(blue_circle, green_square))
        self.wait()
```

<video src="/video/tutorial_manim/circle_to_square.mp4" controls="true" width="100%"></video>

`%%manim`はjupyternotebookでmanimを動かすためのマジックコマンドを表す
import前に`%%manimu`は呼べない

`-qm`は動画の生成クオリティを表していて、`--quality=m`を表す。

 つまりミディアムクオリティの動画生成を意味している

クオリティを高くする場合-qh, 低くても良い場合-qlを使う

形状の生成アニメーションはCreate以外にも`FadeIn`や`DrawBorderThenFill`など色々ある

wait()はデフォルト1秒待つ
秒数を指定する場合wait(2)などにする

## 文字を描画する

図形描画と同時に文字を描画することも可能です

```python
%%manim -qm DrawBlueCircle

class DrawBlueCircle(Scene):
    def construct(self):
        # 円の定義
        circle = Circle()

        # 円の属性を更新すr
        blue_circle = circle.set_color(BLUE).set_opacity(0.5)

        # 文字の定義
        label = Text("青い円を書いています")

        # 文字を青い円の下に配置
        label.next_to(blue_circle, DOWN, buff=0.5)

        # 描画開始
        self.play(Create(blue_circle), Write(label))

```


<video src="/video/tutorial_manim/draw_blue_circle_with_label.mp4" controls="true" width="100%"></video>

playの引数に複数のオブジェクトを渡すことで同時に描画することが可能です。

日本語についても追加の設定をする必要がなく描画できました。(素晴らしい)

文字描画のアニメーションは`write()`以外にもあるので、色々見てみると面白い

https://docs.manim.community/en/stable/reference/manim.animation.creation.html

## 数式の描画

数式もきれいに書けるの素晴らしい

```python
%%manim -qm CauchyIntegralFormula

class CauchyIntegralFormula(Scene):
    def construct(self):
        formula = MathTex(r"[z^n]f(z) = \frac{1}{2\pi i}\oint_{\gamma} \frac{f(z)}{z^{n+1}}~dz")
        self.play(Write(formula), run_time=3)
        self.wait()
```


<video src="/video/tutorial_manim/formula.mp4" controls="true" width="100%"></video>

## まとめ

manimのインストールとチュートリアルを動かしてみた

簡単にアニメーション付きの図形や日本語や数式を含む文字を描画できることを確認した

図形と数式を連動させて動かしたりより面白い表現を探していきたい