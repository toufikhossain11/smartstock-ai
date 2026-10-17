const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();

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
    db = client.db("smartstock");
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

module.exports = app;