    // import pg from 'pg';

    // //色々な機能をまとめて作りたい。
    // //const TeckGedkDB のオブジェクトとして宣言すると、コネクトやテーブルなどの機能を作ることができる。
    // export const TeckGedkDB = {
    //     connect: () => {
    //     },
    //     createTable:() => {
    //     }
        
    // }

    // TeckGeekDB.connect();
    // TeckGeekDB.createTable();

import pg from 'pg';

//テックギークというDBとの接続作業をする
export const TeckGeekDB = {
    connect: async () => {
        //どのポストグレスに接続するかを決める
        const client = new pg.Pool({
            connectionString:process.env.DATABASE_URL,
            ssl: false
        });
        //接続を時効します、というコネクト関数
        await client.connect();
//接続終わったポストグレスの情報を返す
        return client;
    },
    //データベースの初期化
    //usersテーブルがあるかどうかのチェックをして、なければ作成する。
    init: async () => {
        const client = await TeckGeekDB.connect();
        const hasUsersTable = await client.query(
            `SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'users'
            );`
        );
        //UsersTableがなかったら作る
        if (!hasUsersTable.rows[0].exists) {
            console.log('create users table');
            //emailは一意にする email にUNICUEつける
            await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
            `);
        }
        const hasProductTable = await client.query(
            `SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'products'
            );`
        );
        if (!hasProductTable.rows[0].exists) {
            console.log('create products table');
            await client.query(`
                CREATE TABLE products (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    description text ,
                    price INTEGER NOT NULL,
                    image_path VARCHAR(255),
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
            `);
        }
            const hasPurchaseTable = await client.query(
                `SELECT EXISTS (
                    SELECT 1
                    FROM information_schema.tables
                    WHERE table_schema = 'public'
                    AND table_name = 'purchases'
                );`
            );
            if (!hasPurchaseTable.rows[0].exists) {
                console.log('create purchases table');
                await client.query(`
                    CREATE TABLE purchases (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER NOT NULL,
                        FOREIGN KEY (user_id) REFERENCES users(id),
                        amount INTEGER NOT NULL,
                        product_ids INTEGER [] NOT NULL,
                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                    );
                `);
            }
        },

            createUser: async (name, email, password) =>{
                //コネクトを呼び出し、どのデータベースに保存するか設定する
                const client = await TeckGeekDB.connect();
                const result = await client.query(
                    `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`,
                    [name, email, password]
                );
                return result.rows[0];
            },
            //ユーザーの情報を取得する
            getUser: async (email) => {
                const client = await TeckGeekDB.connect();
                const result = await client.query(
                    `SELECT * FROM users WHERE email = $1;`,
                    [email]
                );
                return result.rows[0];
            },
            //IDでも取得できるように
            getUserById: async (id) => {
                const client = await TeckGeekDB.connect();
                const result = await client.query(
                    `SELECT * FROM users WHERE id = $1;`,
                    [id]
                );
                return result.rows[0];
            },
            //商品を作成する
            createProduct: async (title, description, price, imagePath) => {
                const client = await TeckGeekDB.connect();
                const result = await client.query(
                    `INSERT INTO products (title, description, price, image_path) VALUES ($1, $2, $3, $4) RETURNING *;`,
                    [title, description, price, imagePath]
                );
                return result.rows[0];
            },
            //全ての商品情報をとってくる
            getProducts: async () => {
                const client = await TeckGeekDB.connect();
                const result = await client.query(
                    `SELECT * FROM products;`
                );
                return result.rows;
            },
            //商品IDから商品情報を取得する（商品詳細ページで特定の商品情報をとってくる必要がある）
            getProductById: async (id) => {
                const client = await TeckGeekDB.connect();
                const result = await client.query(
                    `SELECT * FROM products WHERE id = $1;`,
                    [id]
                );
                return result.rows[0];
            },
            createPurchase: async (user_id, amount, product_ids) => {
                const client = await TeckGeekDB.connect();
                const result = await client.query(
                    `INSERT INTO purchases (user_id, amount, product_ids) VALUES ($1, $2, $3) RETURNING *;`,
            [user_id, amount, product_ids]
        );
        return result.rows[0]; // INSERT操作なので、作成した購入記録のデータを返すべきで、result.rows[0]を返すように修正しました。
    },
    getPurchaseds: async (user_id) => {
        const client = await TeckGeekDB.connect();
        const result = await client.query(
            `SELECT * FROM purchases WHERE user_id = $1;`,
            [user_id]
        );
        return result.rows;
    }
}
