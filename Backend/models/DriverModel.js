import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    // Existing authentication fields from the first schema
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;