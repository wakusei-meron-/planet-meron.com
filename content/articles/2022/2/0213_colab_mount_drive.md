---
title: Colabでpip installしたライブラリを永続化する
date: 2022/02/13
tags:
  - jupyter_notebook
  - colab
---

colabでセッションを初期化するとpipインストールしたライブラリが消えてしまい、毎回インストールする必要があります

そこでインストールしたライブラリを永続化するために必要な設定を紹介します

## ①Google driveのフォルダをマウント

ColabではGoogle Driveのフォルダをマウントすることができます

フォルダをマウントし、ダウンロードしたライブラリを保存することで永続化を行います

下記の例では、ドライブをマウントした際のデフォルトのパスが `content/drive/My Drive/Colab Notebooks` となっていて、わかりにくいので、 `/content/notebooks` にシンボリックリンクを貼りわかりやすくしています

```python
import os, sys
from google.colab import drive

# driveをマウント
drive.mount('/content/drive', force_remount=True)

# わかりやすいようにシンボリックリンクを貼る
nb_path = '/content/notebooks'
target = '/content/drive/My Drive/Colab Notebooks/packages'
if os.path.realpath(nb_path) != target:
  os.symlink(target, nb_path)

# ライブラリのパスを通す
if nb_path not in sys.path:
  sys.path.insert(0, nb_path)

print(sys.path)
# ['/content/notebooks', ...] とパスが通っていればOK
```

## ②マウントしたフォルダにライブラリをインストール

該当のライブラリのimportを試みて、存在しなければpip installを行います

その時、インストール先として先程マウントしたフォルダを `--target` として指定します

```jupyter
try:
  import beautifulsoup4
except:
  !pip install --target=$nb_path beautifulsoup4
```

これでセッションの初期化を行ってもマウントしたフォルダよりライブラリをimportすることが可能になります

めでたしめでたし
