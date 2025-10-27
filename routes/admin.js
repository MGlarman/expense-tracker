// routes/admin.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/test", (req, res) => res.json({ msg: "Admin router works!" }));

/** Admin login */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ adminId: admin._id }, process.env.ADMIN_JWT_SECRET, { expiresIn: "8h" });
    res.json({ token, username: admin.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** CRUD users (all routes protected) */

// GET all users
router.get("/users", adminAuth, async (req, res) => {
  const users = await User.find({}, "-password"); // never return passwords
  res.json(users);
});

// GET single user
router.get("/users/:id", adminAuth, async (req, res) => {
  const user = await User.findById(req.params.id, "-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// CREATE user
router.post("/users", adminAuth, async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashed });
    res.status(201).json({ id: newUser._id, username: newUser.username });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE user
router.put("/users/:id", adminAuth, async (req, res) => {
  const { username, password } = req.body;
  try {
    const updateData = {};
    if (username) updateData.username = username;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, select: "-password" });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE user
router.delete("/users/:id", adminAuth, async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "User not found" });
  res.json({ message: "User deleted" });
});

export default router;
