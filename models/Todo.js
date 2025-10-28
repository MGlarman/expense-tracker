// models/Todo.js
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  // Task title
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },

  // Whether the task is completed
  completed: { 
    type: Boolean, 
    default: false 
  },

  // Date when task was created (auto)
  createdAt: { 
    type: Date, 
    default: Date.now 
  },

  // ✅ New fields

  // When the task should ideally be completed
  dueDate: { 
    type: Date, 
    default: null 
  },

  // Estimated time to complete (in hours)
  estimatedTime: { 
    type: Number, 
    default: 0, 
    min: 0 
  },

  // Optional category for pie chart grouping
  category: { 
    type: String, 
    trim: true, 
    default: "General" 
  },

  // Priority level
  priority: { 
    type: String, 
    enum: ["low", "medium", "high"], 
    default: "medium" 
  },
});

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
