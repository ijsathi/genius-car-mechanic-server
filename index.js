const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId ;


const cors = require('cors');
require('dotenv').config();


const app = express();
const port = 5000;
 
// middleware
app.use(cors());
app.use(express.json());

// PASSWORD 0X9bzFL8XoV4S8Iw

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vsocy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        // GET API
        app.get('/services', async(req, res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET Single Service
        app.get('/services/:id', async(req, res) =>{
            const id = req.params.id;
            console.log('getting specific service',id);
            const query = {_id: ObjectId (id) }
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        // POST
        app.post('/services',async(req, res) =>{
            const service = req.body;
        //    console.log('hitting the dating', service);

            const result = await servicesCollection.insertOne(service);
            // console.log(result);
            res.json(result)
        });

        // DELETE 
        app.delete('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId (id) }
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        });

    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir);


app.get('/',(  req, res) =>{
    res.send('Hello,WOW ! Running Genius Here!')
});
 
app.listen(port, () => {
    console.log('Listening the port', port);
});
