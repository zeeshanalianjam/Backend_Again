import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        lowercase: true,

    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);