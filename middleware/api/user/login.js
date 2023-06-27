import { TeckGeekDB } from '../../../teckgeek-db.js';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function login(req, res){

    const {email, password} = req.body;
    console.log({email, password});
    const user = await TeckGeekDB.getUser(email);
    if (user?.error){
        return res.status(500).send(user.error);
    }
    if (!user){
        return res.status(401).send('ユーザーが見つかりません');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
        return res.status(401).send('パスワードが一致しません');
    }
    //passを除くユーザの情報をすべてをトークンに保持する
    //第一引数に、暗号化したいデータを書く。秘密鍵を第二引数に入れる
    //会員登録と同時にログインすることもあるから、同じようなことを会員登録のAPIでもやる。
    //user情報全てを第一引数に入れたいが、passwordは入れたくないので、deleteで消す
    //オプションなので任意だが、トークンの有効期限を決めることができる。
//JWTはローカルストレージセッションストレージクッキーに保存することができる

    delete user.password;
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('user_token', token,{
        httpOnLy: true,//セキュリティ上の脆弱性を回避、フロント側からクッキーを読み取れないようにする
        secure: process.env.NODE_ENV === 'production', //本番環境ではhttpsでアクセスさせたいので、trueにすることでhttpsでアクセスした時のみクッキーを発行する
        maxAge: 60 * 60 * 24 * 1000,//有効期限を1日にする
        });

    return res.status(200).json(user);
}