const express = require("express")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config()
const cors = require("cors")
const app = express()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gjc7a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
      await client.connect();
      const userCollection = client.db("dress-Shop").collection("dress-collection")

    
    //   get dress data
      app.get("/dress", async(req,res)=>{
          const query = {}
          const cursor = userCollection.find(query)
          const result = await cursor.toArray()
          res.send(result)
      })
      // post data
      app.post("/dress", async(req,res)=>{
          const query = req.body
          const result = await userCollection.insertOne(query)
          res.send(result)
      })
    // get single dress data
      app.get("/dress/:id",async(req,res)=>{
        const dressId = req.params.id
        const filterId = {_id:ObjectId(dressId)}
        const query = await userCollection.findOne(filterId)
        res.send(query)
    })
      app.put("/dress/:id",async(req,res)=>{
        const updateQuantity = req.body
        console.log(updateQuantity);
        const dressId = req.params.id
        const filterId = {_id:ObjectId(dressId)}
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            quantity:updateQuantity.quantity
          },
        };
        const result = await userCollection.updateOne(filterId, updateDoc, options);
        res.send(result)
    })
    


  }
  finally{}
}
  run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("hello assignment 11")
})
/
app.listen(port,() =>{
    console.log("assigment 11 runnig")
})