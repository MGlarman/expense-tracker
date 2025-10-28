import express from "express";
import Todo from "../models/Todo.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// GET all todos for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add a new todo
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, dueDate, estimatedTime, category, priority } = req.body;

    const todo = new Todo({
      userId: req.user._id,
      title,
      dueDate: dueDate || null,
      estimatedTime: Number(estimatedTime) || 0,
      category: category || "General",
      priority: priority || "medium",
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: Update a todo
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, completed, dueDate, estimatedTime, category, priority } = req.body;

    const updatedFields = {};
    if (title !== undefined) updatedFields.title = title;
    if (completed !== undefined) updatedFields.completed = completed;
    if (dueDate !== undefined) updatedFields.dueDate = dueDate;
    if (estimatedTime !== undefined) updatedFields.estimatedTime = Number(estimatedTime);
    if (category !== undefined) updatedFields.category = category;
    if (priority !== undefined) updatedFields.priority = priority;

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updatedFields,
      { new: true }
    );

    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove a todo
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
