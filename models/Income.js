//server/models/Income.js
import mongoose from "mongoose"

const incomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    savingsGoal: {
        type: Number,
        default: 0,
    },
    month: {
        type: Number, //0-11
    },
    year: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model("Income", incomeSchema)

//this model stores a simple income record with optional month/year