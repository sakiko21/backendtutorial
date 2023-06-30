import {create, products, product} from "../api/product/index.js";
import {userAuthentication} from "../middleware/index.js";
import multer from "multer";
import {TeckGeekDB} from "../teckgeek-db.js";
export function productRouter(app){
//multerの初期化
const upload = multer({
    storage: multer.diskStorage ({
    //ファイルの保存先を指定する
    destination: function(req, file, cb){
        cb(null, 'frontend/assets/images/'); 
    },
    //ファイル名を指定する
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
})
});

    app.post("/product/create", userAuthentication, upload.single("product_image"), create);
    app.get("/products", products);
    app.get("/api/product/:id", product);
// //商品情報を更新するAPI
// app.put("/product/update", async (req, res) => {
//     const {title, description, price, imagePath, id} = req.body;
//     console.log({title, description, price, imagePath, id});
//     const product = await TeckGeekDB.updateProduct(title, description, price, imagePath, id);
//     console.log({product});
//     if (product.error){
//         return res.status(500).send(product.error);
//     }
//     return res.status(200).send(product);
    
// });
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

// app.get("/products/product.html", (req, res) => {
//     // ファイルを読み込んで表示させる
//     const contentHtml = readFileSync(STATIC_PATH + "/products/product.html", "utf8");
//     res.status(200).setHeader("Content-Type", "text/html").send(contentHtml);
// });


}