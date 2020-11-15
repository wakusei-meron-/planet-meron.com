---
title: RedashでMySQLにおけるテーブル・カラムのCOMMENTを表示する
description: 
date: 2020/11/15
tags: 
  - SQL
  - Redash
  - MySQL
---

スキーマ変更時は、関連するデータの設計と実装を行うので問題ないのですが、規模が大きくなったり、新しい人が入ってくるような環境だと各テーブルやカラムに保存されるデータがどんなものかわからなくなりがちです

Excelやesaなどのドキュメントで管理をすると、それを変更しないと本番のDBに反映されないなどの運用フローがないとほぼ確実にメンテされなくなります
結果として、ほぼ確実に今現在動いているスキーマに関する情報が足りなかったり、古くなります

そこで弊社ではテーブルとカラムに何を表すテーブル・カラムかコメントを残すようにしています

また、自分の会社ではデータドリブンを価値観として掲げているので、非エンジニアもデータが触れるような環境をRedashを用いて作っています

非エンジニアもデータを触れる環境を作ろうとしているので、Redashで各テーブルのコメントを見れるようにしました

## クエリ

``` sql
-- テーブル一覧の表示
SHOW TABLES;
```

```sql
-- テーブル名とコメントの表示
SELECT
  TABLE_NAME AS `テーブル名`,
  TABLE_COMMENT AS `テーブル詳細`
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'sample'
```

```sql
-- カラム名と型、コメントの表示
SELECT 
  t.COLUMN_NAME AS `カラム名`,
  t.DATA_TYPE AS `データ型`,
  t.COLUMN_COMMENT AS `カラム詳細`
FROM (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = '{{table}}'
) t
```

`SHOW TABLES` や `SHOW FULL COLUMNS FROM [TABLE NAME]` で表示することが可能だが、必要なカラムだけ表示するようにしている

これで非エンジニアもテーブルの詳細について見れるようになったと。
