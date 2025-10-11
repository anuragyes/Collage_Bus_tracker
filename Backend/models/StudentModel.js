// models/Student.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function(email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "Please provide a valid email address"
      },
      index: true, // Add index for better query performance
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      maxlength: [128, "Password cannot exceed 128 characters"],
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
    phoneNumber: { 
      type: String, 
      unique: true, 
      sparse: true,
      validate: {
        validator: function(phone) {
          // Basic phone number validation - adjust regex as needed
          return !phone || /^[\+]?[1-9][\d]{0,15}$/.test(phone);
        },
        message: "Please provide a valid phone number"
      }
    },
  },
  { 
    timestamps: true 
  }
);

// Compound index for better query performance
studentSchema.index({ email: 1, subscription: 1 });

const Student = mongoose.model("Student", studentSchema);

export default Student;
