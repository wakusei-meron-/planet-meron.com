---
title: Python, IPython, Jupyter Notebookの違いについて
date: 2022/02/05
tags:
- 2022
- python
- ipython
- jupyter_notebook
---

jupyter notebookに関連する知識が曖昧だと調べる時に必要な情報が引っかからないことがある

そこでpythonやipython、jupyter notebookなどの違いや何のためのツールかまとめる

## Python, IPython, notebookについて

```
Python: プログラミング言語
IPython: 対話型に特化したpythonのREPL
IPython notebook: ブラウザ上でIPythonを動かすための環境
Jupyter Notebook: IPython以外の言語もブラウザ上で動作するための環境
```

### マジックコマンド

```text
%: ラインマジック. 引数はその行に収まっている必要あり
%%: セルマジック. 引数は複数行にまたがってもOK
?: docstringの表示
??: ソースコードのヒョ時
!: シェルコマンドの実行
```

## ラインコマンド例
```
* %lsmagic：現在利用可能なマジックコマンドの一覧を表示してくれます。
* %magic：マジックコマンドの情報を表示してくれます。
* %time：これに続くコードの実行時間を測定し、結果を表示してくれます。
* %timeit：これに続くコードの実行時間を何度か測定し、その中で最速であった結果と平均を表示してくれます。
* %env：環境変数を取得したり、設定したりすることができます。
* %bash, %script：Shellコマンドを実行することができます。
* %who：現在宣言されている変数を表示してくれます。
* %whos：現在宣言されている変数とその型、内容を表示してくれます。
* %pwd：現在のディレクトリを表示します。
* %history：コードセルの実行履歴を一覧で表示してくれます。
* %ls：カレントディレクトリーのファイルを一覧で表示してくれます。
* %matplotlib inline：pyplotなどでグラフを描写すると結果が別ウインドーが開きそこに表示されますが、このマジックコマンドを使うとnotebook内にグラフが表示されるようになります。
* %matplotlib tk：別ウインドーにインタラクティブなグラフを表示してくれます。
* %matplotlib notebook：inlineを指定した場合と同様に、コードセルの下にグラフを表示してくれます。グラフはインタラクティブなグラフになります。
* %quickref：クイックレファレンス一覧を表示してくれます。
```

## セルマジック例

```text
%%timeit：%timeitの機能をセル内のすべてのコードに適応します。
%%html, %%HTML：htmlのコードの記述、実行を可能にします。
%%!, %%sx, %%system：shellコマンドの実行を可能にします。
%%js：Javascriptのコードの記述、実行を可能にします。
%%ruby：rubyのコードの記述、実行を可能にします。
%%perl：perlのコードの記述、実行を可能にします。
%%python：pythonのコードの記述、実行を可能にしま
```

## 参考文献
* [公式ドキュメント~Built-in magic commands~](https://ipython.readthedocs.io/en/stable/interactive/magics.html)
https://miyukimedaka.com/2019/07/28/blog-0083-jupyter-notebook-magic-command-explanation/
