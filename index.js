const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middle ware:
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zyyhzcl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffesColletions = client.db("coffesDB").collection("coffe");

    app.get("/coffes",async(req,res)=>{
        const coffes = coffesColletions.find();
        const result = await coffes.toArray();
        res.send(result);
    })

    app.get("/coffes/:id" , async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffesColletions.findOne(query);
      res.send(result);
    })

    app.post("/coffes", async(req,res)=>{
        const newCoffe = req.body;
        console.log(newCoffe); 

        const result = await coffesColletions.insertOne(newCoffe);
        res.send(result);
    })

    app.delete("/coffes/:id" , async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffesColletions.deleteOne(query);
      res.send(result);
    })

    app.put("/coffes/:id", async(req,res)=>{
      const id = req.params.id;
      const coffe = req.body;

      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};

      const updatedCoffe={
        $set:{
          name: coffe.name,
          chef: coffe.chef,
          suplier: coffe.suplier,
          taste: coffe.taste,
          category: coffe.category,
          details: coffe.details,
          photo:coffe.photo
        }
      }

      const result = await coffesColletions.updateOne(filter, updatedCoffe, options);
      res.send(result);

    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/",(req,res)=>{
    res.send("express coffe house is running");
})

app.listen(port , (req, res)=>{
    console.log(`express coffe house is running on port: ${port}`);
});