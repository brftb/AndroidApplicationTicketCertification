// 設定
const config = require('./config');

// appモジュール宣言
var express = require('express');
var app = express();

// View engine setup
app.set('port', config.port);

// パス指定用モジュール
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// データベースモジュール
const awaitMysql = require('mysql-await');
const db = awaitMysql.createPool({
  host: config.dbConfig.host,
  user: config.dbConfig.user,
  password: config.dbConfig.password,
  database: config.dbConfig.database
});

// 標準入力
process.stdin.setEncoding("utf8");
let reader = require("readline").createInterface({
  input: process.stdin
});
reader.on("line", (text) => {
  switch (text) {
    case "getChatLog":
      console.log("ChatRoom -> log");
      console.log(cr.log);
      break;
    case "getUsers":
      console.log("ChatRoom -> users");
      console.log(cr.users);
      break;
    default:
      break;
  }
});

module.exports = {
  app,
  db,
};