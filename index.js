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
//urlをパースするためのモジュール
import {parse as urlParse} from "url";


const app = express();
// const PORT = 3000;
const PORT = process.env.PORT;

const STATIC_PATH = `${process.cwd()}/frontend`;//process.cwdでルートディレクトリへのパスを作る.ルートディレクトリから見てfrontendディレクトリを指定

app.use (express.json());
app.use (cookieParser());
userRouter(app);
productRouter(app, STATIC_PATH);

//Viewファイルを出すためのルーティングをかく
app.use(serveStatic(STATIC_PATH,{index: ["index.html"]}));

// //元のコード。これだと商品一覧から商品詳細ページに遷移するときのURLがlocalhost:3000/product/1のようになる　一旦コメントアウト　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　
// app.get("/*",  (req, res)=>{
//     console.log(STATIC_PATH + req.originalUrl + ".html");
//     const contentHtml = readFileSync(STATIC_PATH + req.originalUrl + ".html", "utf8");
//     res
//     .status(200)
//     .setHeader("Content-Type", "text/html")
//     .send(contentHtml);
// });


//
app.get("/*",  (req, res, next)=>{
    // parse the url, ignoring query parameters
    const url = urlParse(req.originalUrl);
    let path = STATIC_PATH;
//ルーティングとエンドポイントが混在しているため、うまくいかないらしい
//URLが/api/から始まる場合は、HTML読み込みをスキップする
    if (url.pathname.startsWith('/api/')) {
        return next();
    }

    if (url.pathname === "/product.html") {
        path += '/products' + url.pathname;
    } else {
        path += url.pathname;
    }
    console.log(path);
    const contentHtml = readFileSync(path, "utf8");
    res
    .status(200)
    .setHeader("Content-Type", "text/html")
    .send(contentHtml);
});



// app.listen (PORT, ()=>{
//     console.log(`Server running on port ${PORT}`);

// });

app.listen (process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`);

});
