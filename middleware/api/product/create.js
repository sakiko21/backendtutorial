import { TeckGeekDB } from '../../../teckgeek-db.js';


export async function create(req, res) {
        const {title, description, price, imagePath, token} = req.body;
        console.log({title, description, price, imagePath, token});
        //トークンを検証する(トークン、秘密鍵(JWT_SECRET)があれば検証できる、)
        //認証機能は別のファイルに書く
        console.log("user:", req.user);
    
        const product = await TeckGeekDB.createProduct(
            title, 
            description, 
            price, 
            imagePath
            );
            console.log({product});
        if (product.error){
            
            return res.status(500).send(product.error);
        }
        return res.status(200).send(product);
    }
