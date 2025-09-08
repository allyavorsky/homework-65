const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(express.json());

const mongoUrl = process.env.MONGO_URI;
const client = new MongoClient(mongoUrl);
let db;

async function connectDB() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB Atlas!");
    db = client.db();
  } catch (error) {
    console.error("Could not connect to MongoDB Atlas:", error);
    process.exit(1);
  }
}

app.get("/products", async (req, res) => {
  try {
    const collection = db.collection("products");
    const products = await collection.find({}).toArray();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/products", async (req, res) => {
  try {
    const collection = db.collection("products");
    const newProduct = req.body;

    if (!newProduct || Object.keys(newProduct).length === 0) {
      return res.status(400).json({ message: "Product data is required" });
    }

    const result = await collection.insertOne(newProduct);
    res.status(201).json({
      message: "Product created successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startServer();
