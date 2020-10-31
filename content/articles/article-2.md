---
title: 記事2
date: 2020/10/25
image: /images/neko2.jpg
tags: 
  - neko
---

## 明日の記事

このねこもかわいい


```js{1,3-5}[server.js]
const http = require('http')
const bodyParser = require('body-parser')

http.createServer((req, res) => {
  bodyParser.parse(req, (error, body) => {
    res.end(body)
  })
}).listen(3000)
```
