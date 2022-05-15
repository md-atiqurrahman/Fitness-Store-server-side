const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster2.85unk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
       await client.connect();

       const productCollection = client.db('gymEquipment').collection('product');

       app.get('/products', async (req,res) =>{
           const query = {};
           const cursor = productCollection.find(query);
           const products = await cursor.toArray();
           res.send(products);
       });

       app.get('/products/:id', async (req, res) =>{
           const id = req.params.id;
           const query = {_id: ObjectId(id)};
           const product = await productCollection.findOne(query);
           res.send(product);
       });


    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('Fitness Store server is running')
});

app.listen(port, () =>{
    console.log('Listening on port',port)
})