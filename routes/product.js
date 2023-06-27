import {create, products, product} from "../middleware/api/product/index.js";
import {userAuthentication} from "../middleware/index.js";
export function productRouter(app){

    app.post("/product/create", userAuthentication, create);
    app.get("/products", products);
    app.get("/product/:id", product);
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
// //商品を購入するAPI
// app.post("/purchase/create", async (req, res) => {
//     const {user_id, amount, product_ids} = req.body;
//     console.log({user_id, amount, product_ids});
//     const purchase = await TeckGeekDB.createPurchase(user_id, amount, product_ids);
//     console.log({purchase});
//     if (purchase.error){
//         return res.status(500).send(purchase.error);
//     }
//     return res.status(200).send(purchase);
// });


}