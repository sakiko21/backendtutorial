import express from "express";
import path from 'path';
import { 
    account,
    login,
    register
} from "../api/user/index.js";

import { userAuthentication } from "../middleware/index.js";
import { TeckGeekDB } from '../teckgeek-db.js';
import bcrypt from "bcryptjs";


export function userRouter(app){

    app.post ("/user/register", register);
    app.post("/user/login", login);
    app.get("/user/account", userAuthentication, account);

    
//     //静的なHTMLファイルを返す。ログアウトしていても一瞬表示されてしまうので、userAuthenticationを追加してみた
//     app.get('/account', userAuthentication, function(req, res) {
//         res.sendFile(path.resolve('frontend/user/account.html'));
// });
    
app.get('/user/account.html', userAuthentication, function(req, res) {
    res.sendFile(path.resolve('frontend/user/account.html'));
});


    //会員情報を更新するAPI
app.put("/users/update", userAuthentication, async (req, res) => {
    const {name, email, password, id} = req.body;
    console.log({name, email, password, id});
    const user = await TeckGeekDB.updateUser(name, email, password, id);
    console.log({user});
    if (user?.error){
        return res.status(500).send(user.error);
    }
    return res.status(200).send(user);
    
});

//現在のパスワードと変更後のパスワードを受け取り、現在のパスワードを検証した後に変更後のパスワードをハッシュ化して保存するAPI
app.post("/user/account/updatepass", userAuthentication, async (req, res) => {
    const {currentPassword, newPassword, id} = req.body;    //現在のパス、新しいパス、ユーザーIDを受け取りリクエストボディに格納
    console.log(req.body);
    try {
        const user = await TeckGeekDB.getUserById(id);
        if (!user) {
            return res.status(404).send("ユーザーがみつかりません");
        }
        // パスワードの比較
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).send("パスワードが間違っています");
        }
        // 新しいパスワードのハッシュ化
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log({hashedPassword});
        // パスワードの更新
        const updatedUser = await TeckGeekDB.updateUser(user.name, user.email, hashedPassword, id);
        console.log("パスワードを更新しました");
        return res.status(200).json(updatedUser);     
    } catch (error) {
        console.error(error);
        return res.status(500).send("エラーが発生しました");
    }
});
}