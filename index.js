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

// app.post ("/login",(req, res) => {
//     const body = req.body;
//     console.log(body);
//     res.send(body);
// });
// ユーザー情報のAPI
app.post ("/user/register", async (req, res) => {
    const {name, email, password} = req.body;
    console.log({name, email, password});
    //会員登録。（会員登録終わってからレスポンスを返したいので、上にasyncで非同期に宣言）
    const user = await TeckGeekDB.createUser(name, email, password);
    if (user.error){
        return res.status(500).send(user.error);
    }
    return res.status(200).send(user);
});

app.post("/login", async (req, res) => {
    const {email} = req.body;
    console.log({email});
    const user = await TeckGeekDB.getUser(email);
    console.log({user});
    if (user.message){
        return res.status(200).send(user.message);
    }
    else if (user.error){
        return res.status(500).send(user.error);
    }
    return res.status(200).send(user);
});



//商品情報の登録のAPI
app.post("/product/create", async (req, res) => {
    const {title, description, price, imagePath} = req.body;
    console.log({title, description, price, imagePath});
    const product = await TeckGeekDB.createProduct(
        title, 
        description, 
        price, 
        imagePath
        );
        console.log({product});
    if (product.error){
        console.log(product.error);
        return res.status(500).send(product.error);
    }
    return res.status(200).send(product);
});

app.get("/products", async (req, res) => {
    const products = await TeckGeekDB.getProducts();
    console.log({products});
    if (products.error){
        return res.status(500).send(products.error);
    } else{
    return res.status(200).send(products);
    }
});

app.get("/product/:id", async (req, res) => {
    const {id} = req.params;
    console.log({id});
    const {query_id, query_test} = req.query;
    console.log({query_id, query_test});
    const product = await TeckGeekDB.getProduct(id);
    console.log({product});
    if (product.message){
        return res.status(200).send(product.message);
    } else if (product.error){
        return res.status(500).send(product.error);
    }
    return res.status(200).send(product);
});

//会員情報を更新するAPI
app.put("/users/update", async (req, res) => {
    const {name, email, password, id} = req.body;
    console.log({name, email, password, id});
    const user = await TeckGeekDB.updateUser(name, email, password, id);
    console.log({user});
    if (user.error){
        return res.status(500).send(user.error);
    }
    return res.status(200).send(user);
    
});
//商品情報を更新するAPI
app.put("/product/update", async (req, res) => {
    const {title, description, price, imagePath, id} = req.body;
    console.log({title, description, price, imagePath, id});
    const product = await TeckGeekDB.updateProduct(title, description, price, imagePath, id);
    console.log({product});
    if (product.error){
        return res.status(500).send(product.error);
    }
    return res.status(200).send(product);
    
});
//商品を購入するAPI
app.post("/purchase/create", async (req, res) => {
    const {user_id, amount, product_ids} = req.body;
    console.log({user_id, amount, product_ids});
    const purchase = await TeckGeekDB.createPurchase(user_id, amount, product_ids);
    console.log({purchase});
    if (purchase.error){
        return res.status(500).send(purchase.error);
    }
    return res.status(200).send(purchase);
});


app.listen (PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});

// master
