//server/routes/income.js
// server/routes/income.js
import express from "express";
import Income from "../models/Income.js";
import { auth } from "../middleware/auth.js"; // your existing auth middleware

const router = express.Router();

/**
 * Get latest income record for the user
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
 * Create or update income (simple approach: create a new record)
 * POST /api/income
 * body: { amount: Number, savingsGoal?: Number, month?: Number, year?: Number }
 */
router.post("/", auth, async (req, res) => {
  try {
    const { amount, savingsGoal = 0, month, year } = req.body;
    if (typeof amount !== "number") return res.status(400).json({ error: "amount must be a number" });

    const newIncome = new Income({
      userId: req.user.userId,
      amount,
      savingsGoal,
      month,
      year,
    });

    await newIncome.save();
    res.status(201).json(newIncome);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT to update an existing income by id (optional)
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

export default router;
