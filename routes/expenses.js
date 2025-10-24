import express from "express";
import Expense from "../models/Expense.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// CREATE expense
router.post("/", auth, async (req, res) => {
  const { title, amount, category, date } = req.body;
  try {
    const expense = await Expense.create({
      userId: req.user.userId,
      title,
      amount,
      category,
      date,
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all expenses for a user
router.get("/", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE expense
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, date } = req.body;

  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { title, amount, category, date },
      { new: true }
    );
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE expense
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findOneAndDelete({ _id: id, userId: req.user.userId });
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
