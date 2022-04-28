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

    
    //   post data
      app.get("/dress", async(req,res)=>{
          const query = {}
          const cursor = userCollection.find(query)
          const result = await cursor.toArray()
          res.send(result)
      })
   
  


  }
  finally{}
}
  run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("hello assignment 11")
})

app.listen(port,() =>{
    console.log("assigment 11 runnig")
})