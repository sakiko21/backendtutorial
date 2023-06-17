// Purpose: Entry point for the application
import express from "express";
import dotenv from "dotenv";
dotenv.config();
//サーバー起動時にデータベース初期化
import { TeckGeekDB } from "./teckgeek-db.js";
//データベータの初期化が走り、テーブルがあるかないかが走る
TeckGeekDB.init();


const app = express();
const PORT = 3000;
//これするとボディにデータ入る
app.use (express.json());

app.get ("/", (req, res) => {
    res.send("<h1>Hello World!</h1>");
});

app.post ("/login",(req, res) => {
    const body = req.body;
    console.log(body);
    res.send(body);
    });

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});

// master
