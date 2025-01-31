---
title: MySQL8.0から追加されたCHECK制約の使い方
date: 2023/01/10
tags:
  - 2023
  - MySQL
  - SQL
---

MySQL 8.0.16からCHECK制約が追加されました

CHECK制約とはカラムに保存可能なデータに関する制約を課すもので、データ保存時に値のバリデーションが可能になります

例を上げるとフラグを扱うようなカラムがあった場合に、保存可能なデータを絞ることが可能です

```sql
-- active_flagにCHECK制約を用いて、NULL, 1,0以外の値を保存できないようにする
CREATE TABLE `hoge` (
  `id` INT,
  `active_flag` INT CHECK (`active_flag` IN (1,0))
);
```

上記のテーブルに対して、制約を破るようなデータを入れるとエラーが発生します

```sql
mysql> INSERT INTO hoge (`active_flag`) VALUES (2);
ERROR 3819 (HY000): Check constraint 'hoge_chk_1' is violated.
```

## CHECK制約の使い方

CHECK制約は以下の構文で定義可能です

```sql
-- CHECK制約の構文
[CONSTRANT [制約名]] CHECK (制約条件) [[NOT] ENFORCED]
```

CONSTRAINTや `制約名` は省略可能で、制約名を省略した場合、 `テーブル名_chk_および序数 (1、2、3 など)` の名前が自動で付与されます

```sql
-- 制約名を指定しない場合
CREATE TABLE `hoge` (
  `id` INT,
  `active_flag` INT CHECK (`active_flag` IN (1,0))
);

mysql> SHOW CREATE TABLE `hoge` \G
*************************** 1. row ***************************
       Table: hoge
Create Table: CREATE TABLE `hoge` (
  `id` int DEFAULT NULL,
  `active_flag` int DEFAULT NULL,
  CONSTRAINT `hoge_chk_1` CHECK ((`active_flag` in (1,0))) -- hoge_chk_1で制約名が生成されている
)

-- 制約名を指定した場合
CREATE TABLE IF NOT EXISTS `hoge` (
  `id` INT,
  `active_flag` INT CONSTRAINT positive_chk CHECK (`active_flag` IN (1,0))
);

mysql> SHOW CREATE TABLE `hoge` \G
*************************** 1. row ***************************
       Table: hoge
Create Table: CREATE TABLE `hoge` (
  `id` int DEFAULT NULL,
  `active_flag` int DEFAULT NULL,
  CONSTRAINT `positive_chk` CHECK ((`active_flag` in (1,0))) -- 指定した制約名で生成される
)
```

`NOT ENFORCED` を定義した場合、制約は作成されますが、保存時のバリデーションは実行されません

```sql
-- 制約を作成するが実行しない
CREATE TABLE IF NOT EXISTS `hoge` (
  `id` INT,
  `active_flag` INT CHECK (`active_flag` IN (1,0)) NOT ENFORCED
);

-- INSERTに成功する
mysql> INSERT INTO hoge (`active_flag`) VALUES (2);
Query OK, 1 row affected (0.00 sec)

-- カラムに制約は作成されている
mysql> SHOW CREATE TABLE `hoge` \G
*************************** 1. row ***************************
       Table: hoge
Create Table: CREATE TABLE `hoge` (
  `id` int DEFAULT NULL,
  `active_flag` int DEFAULT NULL,
  CONSTRAINT `hoge_chk_1` CHECK ((`active_flag` in (1,0))) /*!80016 NOT ENFORCED */
)
```

なぜ制約を課さないオプションが用意されているのかわからないですが、メモ的な用途で機能が用意されてるのかもしれません

## カラム制約とテーブル制約

上記ではカラムにおいてのみ制約を課す例を上げていますが、CHECK制約にはカラム制約とは別にテーブル制約も存在します

これは別カラムのデータを参照し、保存データをバリデーションすることが可能です

例として、ユーザー情報を保存するときに電話番号かメールアドレスを必須にするようなテーブルを考えます

```sql
-- 電話番号かメールアドレスのどちらかを必須にするテーブル制約を作成
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT,
  `phone` VARCHAR(45),
  `email` VARCHAR(100),
  CONSTRAINT phone_or_email_required_chk CHECK(`phone` IS NOT NULL OR `email` IS NOT NULL)
);
```

上記のテーブルに対して電話番号やメールアドレスに値が存在する場合、空の場合についてデータを挿入してみましょう

```sql
-- 電話番号&メールアドレスが共にNULLの場合
mysql> INSERT INTO `user` (`phone`, `email`) VALUES (NULL, NULL);
ERROR 3819 (HY000): Check constraint 'phone_or_email_required_chk' is violated.

-- メールアドレスのみNULLの場合
mysql> INSERT INTO `user` (`phone`, `email`) VALUES ("09012345678", NULL);
Query OK, 1 row affected (0.01 sec)

-- 電話番号のみNULLの場合
mysql> INSERT INTO `user` (`phone`, `email`) VALUES (NULL, "hoge@example.com");
Query OK, 1 row affected (0.00 sec)

-- 電話番号&メールアドレスに値がある場合
mysql> INSERT INTO `user` (`phone`, `email`) VALUES ("09012345678", "hoge@example.com");
Query OK, 1 row affected (0.00 sec)
```

こちら想定通り、メールアドレスか電話番号のどちらかに対してデータが指定されていないと保存できない挙動を実現できています

## まとめ

MySQL 8.0から導入されたCHECK制約について構文の紹介とサンプルを作成して挙動の確認を行いました

データベースは技術的な負債が溜まりやすく、置き換えや運用に対するコストが高いので、正しい設計を心がけましょう！
