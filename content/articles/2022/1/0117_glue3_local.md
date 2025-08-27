---
title: dockerでlocalにGlue3.0の開発環境を作る
date: 2022/01/17
tags:
  - glue3
---

Glueでの開発を行う場合、開発エンドポイントを利用することが一般的かと思いますが、ローカルでも動作確認できるのでメモします

## dockerイメージの取得と起動

dockerコマンドを用いた起動例を下記に示します

```shell
# glue3.0のライブラリを含むイメージのダンロード
docker pull amazon/aws-glue-libs:glue_libs_3.0.0_image_01

# 起動
# ローカルで設定したAWSの権限をそのまま渡す
docker run -it -p 8888:8888 -p 4040:4040 -e DISABLE_SSL="true" -e AWS_PROFILE=default -v ~/.aws:/home/glue_user/.aws --name glue_jupyter3 amazon/aws-glue-libs:glue_libs_3.0.0_image_01 /home/glue_user/jupyter/jupyter_start.sh
```

起動した状態で、 https://localhost:8888 にアクセスして、jupyter labの画面が表示されれば成功です

## docker composeを使った起動

またs3やdynamodbなどローカルで同時期どうしたい場合は、 `docker compose` を使うこともあるかと思います

そこで、docker-compose.yamlの例を下記に示します

```yaml
version: "3.8"

services:
  glue_jupyter:
    image: amazon/aws-glue-libs:glue_libs_3.0.0_image_01
    container_name: glue_jupyter
    environment:
      DISABLE_SSL: true
      AWS_PROFILE: default
    volumes:
      - ~/.aws:/home/glue_user/.aws:ro
      - ./jupyter_workspace:/home/glue_user/workspace/jupyter_workspace
    ports:
      - 8888:8888
      - 4040:4040
    command: /home/glue_user/jupyter/jupyter_start.sh
```

## DynamicFrameの基本的な操作

glueではjsonなどスキーマが定まっていないデータに対して、カラムの方を推測するDynamicFrameというものが存在します
https://docs.aws.amazon.com/ja_jp/glue/latest/dg/aws-glue-api-crawler-pyspark-extensions-dynamic-frame.html

そこでS3からjsonを取ってきて、DynamicFrameで操作するサンプルを下記に示します

```python
# 必要なライブラリのインポート
from pyspark import SparkContext
from awsglue.context import GlueContext

# コンテキストの初期化
glueContext = GlueContext(SparkContext.getOrCreate())

# s3からデータを取得し、ダイナミックフレームの生成
persons = glueContext.create_dynamic_frame_from_options(connection_type = "s3", connection_options = {"paths": ["s3://awsglue-datasets/examples/us-legislators/all/persons.json"]}, format = "json")
```

### ダイナミックフレームの操作

ダイナミックフレームはGlueで独自に定義されているデータ構造で、pandas等で利用されるDataFrameとは異なり、スキーマを推定してくれるという特徴を持っています

細かい挙動に関してはこちらを参照

https://dev.classmethod.jp/articles/aws-glue-dynamicframe/

```python
# ダイナミックフレーム周りの情報
## データフレームに変換し出力
persons.toDF().show()

## データ件数
persons.count()

## スキーマの表示
persons.printSchema()

# フィールドの表示
persons.select_fields('name')

# 変換

## フィールドの削除
persons.drop_fields('image')
persons.drop_fields(['image', 'gender']) # 複数の場合は配列を渡す

# フィールド名の変換
persons.rename_field('id', 'person_id')
```

## pythonスクリプトの実行

実際にGlueではpythonスクリプトを実行することになるかと思うんですが、下記のコマンドを利用することによって、ローカルでもスクリプトの実行が可能になります

```shell
# pythonスクリプトのローカル実行
# モジュールとして common.py, 環境変数としてdevを定義し、etl.pyのスクリプトを実行
docker compose run --rm glue_jupyter /home/glue_user/spark/bin/spark-submit --py-files common.py etl.py --env dev
```

## 参考文献

- [Developing AWS Glue ETL jobs locally using a container](https://aws.amazon.com/jp/blogs/big-data/developing-aws-glue-etl-jobs-locally-using-a-container/)
- [Glue Docker Imageを利用したGlue Jobローカル開発をためしてみた](https://dev.classmethod.jp/articles/2022-01-29-glue-local-dockerimage/)
