import { TeckGeekDB } from '../../teckgeek-db.js';

export async function product(req, res) {

    const {id} = req.params;
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
}