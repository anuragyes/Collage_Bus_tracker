// models/Student.js
 import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    subscription: {
      type: Boolean,
      default: false, // student must buy subscription
    },
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus", // bus assigned
      default: null,
    },
  },
  { timestamps: true }
);


 const Student = mongoose.model("Student", studentSchema);

export default Student;  // ✅ always default export