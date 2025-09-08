const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
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

app.post("/products/many", async (req, res) => {
  try {
    const collection = db.collection("products");
    const newProducts = req.body;
    if (!Array.isArray(newProducts) || newProducts.length === 0) {
      return res
        .status(400)
        .json({ message: "Products data must be a non-empty array" });
    }
    const result = await collection.insertMany(newProducts);
    res.status(201).json({
      message: "Products created successfully",
      insertedCount: result.insertedCount,
      insertedIds: result.insertedIds,
    });
  } catch (error) {
    console.error("Error creating multiple products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.patch("/products/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Update data is required" });
    }

    try {
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: updates };
      const result = await collection.updateOne(filter, updateDoc);

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res
        .status(200)
        .json({
          message: "Product updated successfully",
          modifiedCount: result.modifiedCount,
        });
    } catch (error) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.patch("/products/many", async (req, res) => {
  try {
    const collection = db.collection("products");
    const { filter, updates } = req.body;

    if (!filter || !updates || Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ message: "Filter and update data are required" });
    }

    const updateDoc = { $set: updates };
    const result = await collection.updateMany(filter, updateDoc);

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "No products found matching the criteria" });
    }

    res.status(200).json({
      message: "Products updated successfully",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating multiple products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const { id } = req.params;
    const replacementProduct = req.body;

    if (
      !replacementProduct ||
      !replacementProduct.name ||
      !replacementProduct.price
    ) {
      return res
        .status(400)
        .json({ message: "Replacement data must include name and price" });
    }

    try {
      const filter = { _id: new ObjectId(id) };
      const result = await collection.replaceOne(filter, replacementProduct);

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res
        .status(200)
        .json({
          message: "Product replaced successfully",
          modifiedCount: result.modifiedCount,
        });
    } catch (error) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }
  } catch (error) {
    console.error("Error replacing product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const { id } = req.params;

    try {
      const filter = { _id: new ObjectId(id) };
      const result = await collection.deleteOne(filter);

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
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
