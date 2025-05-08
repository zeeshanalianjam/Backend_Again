import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    diagnosis: {
      type: String,
      required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum : ['M', 'F', 'O'],
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    bloodGroup: {
        type: String,
        enum : ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
        required: true
    },
    choosedDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
    }
    
}, { timestamps: true });

export const Patient = mongoose.model("Patient", patientSchema);