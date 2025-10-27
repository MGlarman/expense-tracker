// server/routes/income.js
import express from "express";
import Income from "../models/Income.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/**
 * Get the latest income record for the user
 * GET /api/income
 */
router.get("/", auth, async (req, res) => {
  try {
    const inc = await Income.findOne({ userId: req.user.userId }).sort({ createdAt: -1 });
    if (!inc) return res.status(404).json({ error: "No income found" });
    res.json(inc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get all income records (for all months)
 * GET /api/income/all
 */
router.get("/all", auth, async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user.userId }).sort({ year: -1, month: -1 });
    res.json(incomes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Create a new monthly income record
 * POST /api/income
 * body: { amount: Number, savingsGoal?: Number, month?: Number, year?: Number }
 */
router.post("/", auth, async (req, res) => {
  try {
    const { amount, savingsGoal = 0, month, year } = req.body;
    if (typeof amount !== "number") {
      return res.status(400).json({ error: "amount must be a number" });
    }

    // Upsert: update existing month/year or create a new one
    const income = await Income.findOneAndUpdate(
      { userId: req.user.userId, month, year },
      { amount, savingsGoal },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(income);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Update an existing income record by ID
 * PUT /api/income/:id
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, savingsGoal, month, year } = req.body;

    const inc = await Income.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { amount, savingsGoal, month, year },
      { new: true }
    );

    if (!inc) return res.status(404).json({ error: "Income not found" });
    res.json(inc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Delete an income record by ID
 * DELETE /api/income/:id
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Income.findOneAndDelete({ _id: id, userId: req.user.userId });
    if (!deleted) return res.status(404).json({ error: "Income not found" });
    res.json({ message: "Income deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
