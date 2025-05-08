import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    sallary: {
      type: Number,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
      enum: [
        "Cardiologist",
        "Neurologist",
        "Orthopedist",
        "Pediatrician",
        "Gynecologist",
        "Dermatologist",
        "Ophthalmologist",
        "ENT Specialist",
        "General Physician",
      ],
    },
    experience: {
      type: Number,
      required: true,
    },
    workInHospitals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
      },
    ],
    workInHours: {
      type: Number,
      required: true,
    },
    workInDays: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
  },
  { timestamps: true }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
