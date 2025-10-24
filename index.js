// server/index.js

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expenses.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/expenses", expenseRoutes);

// Test route
app.get("/", (req, res) => res.send("Expense Tracker API running 🚀"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
