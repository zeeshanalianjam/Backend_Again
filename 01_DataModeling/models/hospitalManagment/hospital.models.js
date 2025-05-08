import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    addressLine1: {
        type: String,
        required: true,
        trim: true,
    },
    addressLine2: {
        type: String,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        trim: true,
    },
    country: {
        type: String,
        required: true,
        trim: true,
    },
    pincode: {
        type: String,
        required: true,
        trim: true,
    },
    specialization: {
        type: String,
        required: true,
        enum: ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Gynecology", "Ophthalmology", "Dermatology", "General Medicine"],
    },
    type: {
        type: String,
        required: true,
        enum: ["Private", "Public", "Mixed"],
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
}, { timestamps: true });

export const Hospital = mongoose.model("Hospital", hospitalSchema);