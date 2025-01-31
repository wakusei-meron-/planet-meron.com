---
title: ffmpegの使い方メモ
date: 2023/08/09
tags:
  - 2023
  - ffmpeg
---

## はじめに

ffmegの使い方がわからなかったのでまとめてみました

## 前提

version: 4.4.2-0ubuntu0.22.04.1

## 基本的な使い方

ffmpeg [オプション] [[入力オプション] -i 入力ファイル] [[出力オプション] 出力ファイル]

### グローバルオプション

-y: 出力ファイルが存在する場合に上書きする

### ファイルオプション

-f: 入力ファイルのフォーマットを指定する
-c -codec: コーデックを指定する
-t duration: duration秒の長さのファイルを出力する
-to time_stop: time_stopまでのファイルを出力する
-ss time_off: time_offからのファイルを出力する

### 動画オプション

-r fps: fpsで動画を出力する
-s size: sizeで動画を出力する(WxH or abbreviation)
-aspect aspect: aspect比を指定する(4:3, 16:9, 1.3333, 1.7777)
-vn: 動画を出力しない
-vf: フィルタを指定する

### 音声オプション

-ar rate: rateで音声を出力する
-ac channels: channelsで音声を出力する
-vol volume: volumeで音量を指定する
-an: 音声を出力しない

### 字幕オプション

-s size: sizeで字幕を出力する(WxH or abbreviation)
-scodec codec: codecで字幕を出力する

## 具体的な使用例

### 動画を結合する

1. 結合したいファイルの名前を記述したテキストファイルを作成する

```input.txt
file 'input1.mp4'
file 'input2.mp4'
```

2. ffmpegを実行する

```bash
ffmpeg -f concat -i input.txt -c copy output.mp4
```

### 動画の切り出し

- 30秒から40秒までの動画を切り出す

```bash
ffmpeg -ss 30 -i input.mp4 -t 10 -c copy output.mp4
```

- 指定時間ごとに静止画として切り出し
  ex. 30秒から40秒の動画を1秒ごとに5枚の静止画として切り出す

```bash
ffmpeg -ss 30 -i input.mp4 -t 10 -r 5 -f image2 image-%03d.jpeg
```

### 動画変換・音声抽出

- mp4をaviに変換

```bash
ffmpeg -i input.mp4 output.avi
```

- mp4からAAC形式で音声抽出

```bash
ffmpeg -i input.mp4 -vn -acodec copy output.aac
```

- mp4からAVI(H.264)形式に変換

```bash
ffmpeg -i input.mp4 -vcodec h264 output.avi
```

※コーデックとは、動画や音声を圧縮するためのアルゴリズムのこと. 音声ではmp3やAAC、動画ではH.264やVP9などがある

### 字幕追加

字幕データ(.srt/.ssa/.ass)のフォーマットに対応している

- 動画に外部字幕(.ass)を追加

```bash
ffmpeg -i input.mp4 -vf subtitles=01.ass -y output.mp4
```

-vf: エフェクト内容の指定
subtitles=: 追加したい外部字幕の指定
-y: 上書き
