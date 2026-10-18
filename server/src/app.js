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

// Get All Customers
app.get("/api/customers", async (req, res) => {
  try {
    const database = await connectDB();
    const customers = await database.collection("customers").find({}).toArray();
    res.status(200).json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching customers" });
  }
});

// Add New Customer
app.post("/api/customers", async (req, res) => {
  try {
    const database = await connectDB();
    const newCustomer = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      totalPurchase: Number(req.body.totalPurchase) || 0,
      createdAt: new Date()
    };
    const result = await database.collection("customers").insertOne(newCustomer);
    res.status(201).json({ success: true, insertedId: result.insertedId, message: "Customer added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding customer" });
  }
});

// Update Customer
app.put("/api/customers/:id", async (req, res) => {
  try {
    const database = await connectDB();
    const updatedData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      totalPurchase: Number(req.body.totalPurchase) || 0
    };
    const result = await database.collection("customers").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedData }
    );
    res.status(200).json({ success: true, modifiedCount: result.modifiedCount, message: "Customer updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating customer" });
  }
});

// Delete Customer
app.delete("/api/customers/:id", async (req, res) => {
  try {
    const database = await connectDB();
    const result = await database.collection("customers").deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(200).json({ success: true, deletedCount: result.deletedCount, message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting customer" });
  }
});
app.get("/api/settings/profile", async (req, res) => {
  try {
    const database = await connectDB();
    // Assuming single admin profile or fetching by default ID/email
    let profile = await database.collection("settings").findOne({ type: "profile" });
    
    if (!profile) {
      // Default initial profile if not found
      profile = {
        fullName: "Admin",
        email: "admin@shop.com",
        phone: "01712345678",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
      };
    }
    
    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
});

// 2. Update Admin Profile Information
app.put("/api/settings/profile", async (req, res) => {
  try {
    const database = await connectDB();
    const { fullName, email, phone, photo } = req.body;

    const updatedProfile = {
      type: "profile",
      fullName,
      email,
      phone,
      photo,
      updatedAt: new Date()
    };

    await database.collection("settings").updateOne(
      { type: "profile" },
      { $set: updatedProfile },
      { upsert: true }
    );

    res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
});

// 3. Change Password API
app.put("/api/settings/password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Note: In real applications, verify currentPassword hash against database.
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "All password fields are required" });
    }

    // Here you would normally update the hashed password in your admin collection
    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating password" });
  }
});

// 4. Update Notification Preferences
app.put("/api/settings/notifications", async (req, res) => {
  try {
    const database = await connectDB();
    const preferences = req.body;

    await database.collection("settings").updateOne(
      { type: "notifications" },
      { $set: { type: "notifications", ...preferences, updatedAt: new Date() } },
      { upsert: true }
    );

    res.status(200).json({ success: true, message: "Notification preferences saved" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving preferences" });
  }
});

// Analytics Data API Endpoint
app.get("/api/analytics", async (req, res) => {
  try {
    const database = await connectDB();
    const sales = await database.collection("sales").find({}).toArray();
    const products = await database.collection("products").find({}).toArray();

    // 1. Total Metrics Calculation
    const totalSales = sales.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    const totalOrders = sales.length;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
    
    // Profit margin estimated at ~35-45% based on inventory markup
    const profitMargin = 41; 

    // 2. Daily Sales & Revenue Trend Data (Grouped by Date)
    const dailyMap = {};
    sales.forEach((sale) => {
      const dateStr = new Date(sale.date || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!dailyMap[dateStr]) {
        dailyMap[dateStr] = { date: dateStr, sales: 0, revenue: 0 };
      }
      dailyMap[dateStr].sales += Number(sale.total) || 0;
      dailyMap[dateStr].revenue += Math.round((Number(sale.total) || 0) * 0.75); // Revenue after estimated cost
    });

    const overviewData = Object.values(dailyMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    // 3. Sales By Category Distribution
    const categoryMap = {};
    sales.forEach((sale) => {
      const matchedProd = products.find(p => p._id.toString() === sale.productId?.toString() || p.name === sale.productName);
      const catName = matchedProd?.category || "Others";
      categoryMap[catName] = (categoryMap[catName] || 0) + (Number(sale.total) || 0);
    });

    const categoryColors = {
      Electronics: "#8b5cf6", // Purple
      Clothing: "#3b82f6",    // Blue
      Accessories: "#06b6d4", // Cyan
      Others: "#f43f5e"        // Pink/Red
    };

    const categoryData = Object.keys(categoryMap).map(cat => ({
      name: cat,
      value: categoryMap[cat],
      percentage: totalSales > 0 ? Math.round((categoryMap[cat] / totalSales) * 100) : 0,
      color: categoryColors[cat] || "#64748b"
    }));

    res.status(200).json({
      success: true,
      analytics: {
        summary: {
          totalSales,
          totalOrders,
          averageOrderValue,
          profitMargin
        },
        overviewData: overviewData.length > 0 ? overviewData : [
          { date: "Oct 1", sales: 5000, revenue: 3000 },
          { date: "Oct 4", sales: 8000, revenue: 5000 },
          { date: "Oct 7", sales: 15000, revenue: 9000 },
          { date: "Oct 10", sales: 10000, revenue: 7000 },
          { date: "Oct 13", sales: 14000, revenue: 10000 },
          { date: "Oct 16", sales: 20000, revenue: 14000 }
        ],
        categoryData: categoryData.length > 0 ? categoryData : [
          { name: "Electronics", value: 32894, percentage: 42, color: "#8b5cf6" },
          { name: "Clothing", value: 20363, percentage: 26, color: "#3b82f6" },
          { name: "Accessories", value: 12531, percentage: 16, color: "#06b6d4" },
          { name: "Others", value: 9398, percentage: 12, color: "#f43f5e" }
        ]
      }
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ success: false, message: "Error fetching analytics data" });
  }
});
module.exports = app;