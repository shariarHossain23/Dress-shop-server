const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gjc7a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

function verifyJwt(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "user unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.DB_USER_TOKEN, (error, decoded) => {
    if (error) {
      res.status(403).send({ message: "user forbidden" });
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    await client.connect();
    const userCollection = client
      .db("dress-Shop")
      .collection("dress-collection");

    // jwt token
    app.post("/login", async (req, res) => {
      const user = req.body;
      console.log(user);
      const accessToken = jwt.sign(user, process.env.DB_USER_TOKEN, {
        expiresIn: "1d",
      });
      res.send(accessToken);
    });
    //   get dress data
    app.get("/userpost", verifyJwt, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const email = req.query.email;
      if (decodedEmail === email) {
        const query = {email : email};
        const cursor = userCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      }
    });

    // data all
    app.get("/dress", async (req, res) => {
        const query = {};
        const cursor = userCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      })
      // pagination  page
    app.get("/dresspage", async (req, res) => {
        const limit = Number(req.query.limit)
        const page = Number(req.query.page)
        console.log(page);
        const query = {};
        const cursor = userCollection.find(query);
        const result = await cursor.skip(limit * page).limit(limit).toArray();
        res.send(result);
      })

    // post data
    app.post("/dress", async (req, res) => {
      const query = req.body;
      const result = await userCollection.insertOne(query);
      res.send(result);
    });
    // delete data
    app.delete("/dress/:id", async (req, res) => {
      const id = req.params.id;
      const filterId = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(filterId);
      res.send(result);
    });
    // get single dress data
    app.get("/dress/:id", async (req, res) => {
      const dressId = req.params.id;
      const filterId = { _id: ObjectId(dressId) };
      const query = await userCollection.findOne(filterId);
      res.send(query);
    });
    app.put("/dress/:id", async (req, res) => {
      const updateQuantity = req.body;
      console.log(updateQuantity);
      const dressId = req.params.id;
      const filterId = { _id: ObjectId(dressId) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: updateQuantity.quantity,
        },
      };
      const result = await userCollection.updateOne(
        filterId,
        updateDoc,
        options
      );
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello assignment 11");
}) 
  app.listen(port, () => {
    console.log("assigment 11 runnig");
  });
