// routes/todo.js
import express from "express";
import Todo from "../models/Todo.js";
import { auth } from "../middleware/auth.js"; // ✅ use default export

const router = express.Router();

// GET all todos for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add a new todo
router.post("/", auth, async (req, res) => {
  try {
    const { title, dueDate, estimatedTime, category, priority } = req.body;

    const todo = new Todo({
      userId: req.user.userId,
      title,
      dueDate: dueDate || null,
      estimatedTime: Number(estimatedTime) || 0,
      category: category || "General",
      priority: priority || "medium",
      subtasks: [], // ✅ initialize empty subtasks
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: Update a todo
router.put("/:id", auth, async (req, res) => {
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
      { _id: req.params.id, userId: req.user.userId },
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
router.delete("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//////////////////////////
// ✅ Subtasks Routes
//////////////////////////

// POST: Add a subtask
router.post("/:id/subtasks", auth, async (req, res) => {
  try {
    const { title, estimatedTime } = req.body;
    if (!title) return res.status(400).json({ error: "Subtask title is required" });

    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!todo) return res.status(404).json({ error: "Todo not found" });

    const subtask = { title, completed: false, estimatedTime: Number(estimatedTime) || 0 };
    todo.subtasks.push(subtask);

    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: Update a subtask
router.put("/:id/subtasks/:subId", auth, async (req, res) => {
  try {
    const { title, completed, estimatedTime } = req.body;

    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!todo) return res.status(404).json({ error: "Todo not found" });

    const subtask = todo.subtasks.id(req.params.subId);
    if (!subtask) return res.status(404).json({ error: "Subtask not found" });

    if (title !== undefined) subtask.title = title;
    if (completed !== undefined) subtask.completed = completed;
    if (estimatedTime !== undefined) subtask.estimatedTime = Number(estimatedTime);

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove a subtask
router.delete("/:id/subtasks/:subId", auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!todo) return res.status(404).json({ error: "Todo not found" });

    const subtask = todo.subtasks.id(req.params.subId);
    if (!subtask) return res.status(404).json({ error: "Subtask not found" });

    subtask.remove();
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
