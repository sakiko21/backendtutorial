import multer from "multer";
import AWS from "aws-sdk";
import multerS3 from "multer-s3";
//環境変数読み込む
import dotenv from "dotenv";
dotenv.config();
//console.log("AWS_REAGION", process.env.AWS_REGION);

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
export const upload = multer({
    storage: changeStorage
});