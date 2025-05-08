import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true

    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true 
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
