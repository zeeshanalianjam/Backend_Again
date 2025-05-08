import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    SubTodos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubTodo",
        },
    ]
  },
  { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);
