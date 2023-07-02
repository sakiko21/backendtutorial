import {create, products, product} from "../api/product/index.js";
import {userAuthentication} from "../middleware/index.js";
import multer from "multer";
import AWS from "aws-sdk";
import multerS3 from "multer-s3";
//環境変数読み込む
import dotenv from "dotenv";
dotenv.config();
console.log("AWS_REAGION", process.env.AWS_REGION);
import {TeckGeekDB} from "../teckgeek-db.js";

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const isProduction = process.env.NODE_ENV === "production";
let changeStorage;
if (isProduction){
    console.log("本番環境の設定")
    changeStorage = multerS3({
        //保存先を指定する
            s3 : s3,
            bucket: process.env.AWS_BUCKET_NAME,
            acl: "public-read",
            metadata: function(req, file, cb){
                cb(null, { fieldName: file.fieldname });
            },
            key: function(req, file, cb){
                cb(null, file.originalname || new Date().toISOString() + "." + file.mimetype); //ファイル名を指定する
            }            
        })
} else{
    console.log("開発環境の設定")
    changeStorage = multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, "frontend/assets/images/");
        },
        filename: function(req, file, cb){
            cb(null, file.originalname);            
        }   
    });
}
//multerの初期化
const upload = multer({
    storage: changeStorage
});

export function productRouter(app){
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