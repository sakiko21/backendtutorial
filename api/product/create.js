import { TeckGeekDB } from '../../teckgeek-db.js';


export async function create(req, res) {
        const {title, description, price } = req.body;
        console.log({title, description, price});
        //トークンを検証する(トークン、秘密鍵(JWT_SECRET)があれば検証できる、)
        //認証機能は別のファイルに書く
        console.log("user:", req.user);
        const image_path = req.file.path;
        console.log("file:", req.file);
        const product = await TeckGeekDB.createProduct(
            title, 
            description, 
            price, 
            image_path
            );
            console.log({product});
        if (product.error){
            
            return res.status(500).send(product.error);
        }
        
        return res.status(200).send(product);
        
        
    }
