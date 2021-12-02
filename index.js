const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// Middle Ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcr1a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('BD-Tours-and-Travels');
        const serviceCollection = database.collection('Services');
        const orderCollection = database.collection('Orders');


        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })


        app.get('/services/:_id', async (req, res) => {
            const id = req.params._id;
            const query = { _id: ObjectId(id) };
            const user = await serviceCollection.findOne(query);
            console.log('load user with id:', id);
            res.send(user);
        })


        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })


        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome BD Tours and Travels');
});

app.listen(port, () => {
    console.log('Server is running at port', port);
})
