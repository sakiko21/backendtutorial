//import express from "express";
import path from 'path';
import { 
    account,
    login,
    register
} from "../middleware/api/user/index.js";

import { userAuthentication } from "../middleware/index.js";

export function userRouter(app){

    app.post ("/user/register", register);
    app.post("/user/login", login);
    app.get("/user/account", userAuthentication, account);

    
    //静的なHTMLファイルを返す。ログアウトしていても一瞬表示されてしまうので、userAuthenticationを追加してみた
//     app.get('/account', userAuthentication, function(req, res) {
//         res.sendFile(path.resolve('frontend/user/account.html'));
// });
    
app.get('/user/account.html', userAuthentication, function(req, res) {
    res.sendFile(path.resolve('frontend/user/account.html'));
});


//     //会員情報を更新するAPI
// app.put("/users/update", userAuthentication, async (req, res) => {
//     const {name, email, password, id} = req.body;
//     console.log({name, email, password, id});
//     const user = await TeckGeekDB.updateUser(name, email, password, id);
//     console.log({user});
//     if (user?.error){
//         return res.status(500).send(user.error);
//     }
//     return res.status(200).send(user);
    
// });

}