const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
//product id
const { ObjectId } = require("mongodb");

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection Setup
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("smartstock-ai");
    console.log("Connected to MongoDB successfully!");
  }
  return db;
}

// Dashboard Analytics API Route (MongoDB Connected)
app.get("/api/dashboard", async (req, res) => {
  try {
    const database = await connectDB();
    
    // Tomi ekhane database collection theke query korte parbe
    // const productsCollection = database.collection("products");

    const dashboardMetrics = {
      stats: {
        totalProducts: 48,
        productsChange: "+2 new this week",
        totalSales: 12450,
        salesChange: "+12% from last week",
        totalRevenue: 78320,
        revenueChange: "+18% from last week",
        totalProfit: 32150,
        profitChange: "+22% from last week",
      },
      chartData: [
        { month: "Jan", Sales: 12000, Revenue: 22000, Profit: 8000 },
        { month: "Feb", Sales: 19000, Revenue: 27000, Profit: 12000 },
        { month: "Mar", Sales: 15000, Revenue: 25000, Profit: 10000 },
        { month: "Apr", Sales: 22000, Revenue: 32000, Profit: 15000 },
        { month: "May", Sales: 28000, Revenue: 40000, Profit: 20000 },
        { month: "Jun", Sales: 24000, Revenue: 35000, Profit: 17000 },
        { month: "Jul", Sales: 31000, Revenue: 45000, Profit: 22000 },
        { month: "Aug", Sales: 29000, Revenue: 42000, Profit: 21000 },
        { month: "Sep", Sales: 35000, Revenue: 50000, Profit: 26000 },
        { month: "Oct", Sales: 38000, Revenue: 54000, Profit: 28000 },
      ],
      lowStockAlerts: [
        { name: "Wireless Mouse", stock: 3, minStock: 5 },
        { name: "USB Cable", stock: 2, minStock: 5 },
        { name: "Notebook", stock: 1, minStock: 5 },
        { name: "T-Shirt", stock: 4, minStock: 10 },
      ]
    };

    res.status(200).json(dashboardMetrics);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching dashboard data",
    });
  }
});
// 1. Get All Products API
app.get("/api/products", async (req, res) => {
  try {
    const db = await connectDB();
    const products = await db.collection("products").find({}).toArray();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
});

// 2. Add New Product API
app.post("/api/products", async (req, res) => {
  try {
    const db = await connectDB();
    const newProduct = {
      name: req.body.name,
      category: req.body.category,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      image: req.body.image || "",
      createdAt: new Date()
    };
    const result = await db.collection("products").insertOne(newProduct);
    res.status(201).json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding product" });
  }
});

// 3. Update Product API
app.put("/api/products/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const id = req.params.id;
    const updatedData = {
      name: req.body.name,
      category: req.body.category,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      image: req.body.image || ""
    };
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating product" });
  }
});

// 4. Delete Product API
app.delete("/api/products/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const id = req.params.id;
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
});

// const { ObjectId } = require("mongodb");

// 1. Get Inventory Stock History / Movements
app.get("/api/inventory", async (req, res) => {
  try {
    const database = await connectDB();
    const inventory = await database.collection("inventory").find({}).sort({ date: -1 }).toArray();
    res.status(200).json({ success: true, inventory });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ success: false, message: "Error fetching inventory history" });
  }
});

// 2. Stock In API (Add quantity to product & log movement)
app.post("/api/inventory/stock-in", async (req, res) => {
  try {
    const database = await connectDB();
    const { productId, quantity, referenceNo, notes, type } = req.body;

    // Find product first to get its name
    const product = await database.collection("products").findOne({ _id: new ObjectId(productId) });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Update product stock (increase)
    await database.collection("products").updateOne(
      { _id: new ObjectId(productId) },
      { $inc: { stock: Number(quantity) } }
    );

    // Insert stock movement record
    const movement = {
      productId: new ObjectId(productId),
      productName: product.name,
      quantity: Number(quantity),
      referenceNo: referenceNo || "",
      notes: notes || "",
      type: type || "Stock In",
      date: new Date()
    };

    await database.collection("inventory").insertOne(movement);

    res.status(200).json({ success: true, message: "Stock added successfully" });
  } catch (error) {
    console.error("Stock in error:", error);
    res.status(500).json({ success: false, message: "Error processing stock in" });
  }
});

// 3. Stock Out API (Decrease quantity from product & log movement)
app.post("/api/inventory/stock-out", async (req, res) => {
  try {
    const database = await connectDB();
    const { productId, quantity, referenceNo, notes, type } = req.body;

    // Find product first
    const product = await database.collection("products").findOne({ _id: new ObjectId(productId) });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if sufficient stock available
    if (product.stock < Number(quantity)) {
      return res.status(400).json({ success: false, message: "Insufficient stock available" });
    }

    // Update product stock (decrease)
    await database.collection("products").updateOne(
      { _id: new ObjectId(productId) },
      { $inc: { stock: -Number(quantity) } }
    );

    // Insert stock movement record
    const movement = {
      productId: new ObjectId(productId),
      productName: product.name,
      quantity: Number(quantity),
      referenceNo: referenceNo || "",
      notes: notes || "",
      type: type || "Stock Out",
      date: new Date()
    };

    await database.collection("inventory").insertOne(movement);

    res.status(200).json({ success: true, message: "Stock removed successfully" });
  } catch (error) {
    console.error("Stock out error:", error);
    res.status(500).json({ success: false, message: "Error processing stock out" });
  }
});
// Get Sales Records
app.get("/api/sales", async (req, res) => {
  try {
    const database = await connectDB();
    const sales = await database.collection("sales").find({}).sort({ date: -1 }).toArray();
    res.status(200).json({ success: true, sales });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching sales" });
  }
});

// Create New Sale (and auto-deduct product stock)
app.post("/api/sales", async (req, res) => {
  try {
    const database = await connectDB();
    const { customer, productId, productName, quantity, discount, total, status, date } = req.body;

    // Check product stock first
    const product = await database.collection("products").findOne({ _id: new ObjectId(productId) });
    if (!product || product.stock < Number(quantity)) {
      return res.status(400).json({ success: false, message: "Insufficient product stock" });
    }

    // Decrease product stock
    await database.collection("products").updateOne(
      { _id: new ObjectId(productId) },
      { $inc: { stock: -Number(quantity) } }
    );

    // Insert sale record
    const newSale = {
      customer: customer || "Walk-in Customer",
      productId: new ObjectId(productId),
      productName,
      quantity: Number(quantity),
      discount: Number(discount) || 0,
      total: Number(total),
      status: status || "Completed",
      date: date ? new Date(date) : new Date()
    };

    const result = await database.collection("sales").insertOne(newSale);
    res.status(201).json({ success: true, insertedId: result.insertedId, message: "Sale created successfully" });
  } catch (error) {
    console.error("Sale creation error:", error);
    res.status(500).json({ success: false, message: "Error creating sale" });
  }
});
module.exports = app;