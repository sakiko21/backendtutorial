import { TeckGeekDB } from '../../teckgeek-db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function register(req, res){

    const {name, email, password} = req.body;
    console.log({name, email, password});
    //パスワードをキャッシュ化する
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await TeckGeekDB.createUser(name, email, hashedPassword);
    console.log({user});
    if (user.error){
        return res.status(500).send(user.error);
    }
    delete user.password;
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' });
//バックエンド側からクッキー発行する
    res.cookie('user_token', token,{
        httpOnLy: true,//セキュリティ上の脆弱性を回避、フロント側からクッキーを読み取れないようにする
        secure: process.env.NODE_ENV === 'production', //本番環境ではhttpsでアクセスさせたいので、trueにすることでhttpsでアクセスした時のみクッキーを発行する
        maxAge: 60 * 60 * 24 * 1000,//有効期限を1日にする
        })
    return res.status(200).json(token);

}