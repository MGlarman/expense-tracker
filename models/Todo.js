// models/Todo.js
import mongoose from "mongoose";

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
  estimatedTime: { type: Number, default: 0, min: 0 },
});

const todoSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  title: { 
    type: String, 
    required: true, 
    trim: true 
  },

  completed: { 
    type: Boolean, 
    default: false 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  },

  dueDate: { 
    type: Date, 
    default: null 
  },

  estimatedTime: { 
    type: Number, 
    default: 0, 
    min: 0 
  },

  category: { 
    type: String, 
    trim: true, 
    default: "General" 
  },

  priority: { 
    type: String, 
    enum: ["low", "medium", "high"], 
    default: "medium" 
  },

  // ✅ Subtasks
  subtasks: [subtaskSchema],
});

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
