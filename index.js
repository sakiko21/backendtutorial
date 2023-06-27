// Purpose: Entry point for the application
import express from "express";
import dotenv from "dotenv";
dotenv.config();
//サーバー起動時にデータベース初期化
import { TeckGeekDB } from "./teckgeek-db.js";
//データベータの初期化が走り、テーブルがあるかないかが走る
TeckGeekDB.init();
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
//ミドルウェア,1個ずつ読み込ませていくと、サーバーのキャッシュやメモリの圧迫や可読性悪につながる
//import { userAuthentication } from "./middleware/user-authentication.js";
//indexにまとめておくと必要な情報だけどんどん追加していける.例えばこんな感じで

import { 
    userAuthentication
} from "./middleware/index.js";

import {
    userRouter,
    productRouter
} from "./routes/index.js";

import serveStatic from "serve-static";
import {readFileSync} from "fs";
import {join} from "path";
import cookieParser from "cookie-parser";


const app = express();
const PORT = 3000;

app.use (express.json());
app.use (cookieParser());
userRouter(app);
productRouter(app);

const STATIC_PATH = `${process.cwd()}/frontend`;//process.cwdでルートディレクトリへのパスを作る.ルートディレクトリから見てfrontendディレクトリを指定
//Viewファイルを出すためのルーティングをかく
app.use(serveStatic(STATIC_PATH,{index: ["index.html"]}));

app.get("/*",  (req, res)=>{
    console.log(STATIC_PATH + req.originalUrl + ".html");
    const contentHtml = readFileSync(STATIC_PATH + req.originalUrl + ".html", "utf8");
    res
    .status(200)
    .setHeader("Content-Type", "text/html")
    .send(contentHtml);
});
//pathname: '/',path: '/',href: '/',_raw: '/' となるのを全て/user/newになるように修正するべきファイルを探す
//app.get("/user/new",  (req, res)=>{




//もしreadFileSyncを使用しない場合どうなるか。
// app.get("/", async (req, res)=>{
//     const contentHtml = await fs.readFile(STATIC_PATH + "index.html", "utf8");
//     res
//     .status(200)
//     .setHeader("Content-Type", "text/html")
//     .send("Hello World");
// }
// );

// app.get("/user/new",  (req, res)=>{
//     const contentHtml = readFileSync(STATIC_PATH + "/user/new.html", "utf8");
//     res
//     .status(200)
//     .setHeader("Content-Type", "text/html")
//     .send(contentHtml);
// }
//);



app.listen (PORT, ()=>{
    console.log(`Server running on port ${PORT}`);

});
