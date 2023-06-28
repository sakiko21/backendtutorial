import { TeckGeekDB } from '../../teckgeek-db.js';


export async function products(req, res) {
    const products = await TeckGeekDB.getProducts();
    console.log({products});
    if (products.error){
        return res.status(500).send(products.error);
    }
    return res.status(200).send(products);
}
