import jwt from "jsonwebtoken";
//nextは、次の処理に移行させますよ、というもの
export async function userAuthentication(req, res, next){
    const token = req.cookies.user_token;
    if(!token){ //トークンがなかったら、next()を走らせないでレスポンスを返す。
        //return res.status(401).send("トークンがありません。");
        return  res.redirect('/');
    }
    //トークンがあったら、
    //トークンを検証する(トークン、秘密鍵(JWT_SECRET)があれば検証できる、)
    try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log({
        user
    });
    req.user = user;//リクエストの中にuserというオブジェクトを作り、ペイロードのuserを入れる
    next();
    } catch (error) {
        return res.status(500).send(error.message);
    }
}