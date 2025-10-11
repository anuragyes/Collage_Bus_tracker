import mongoose from "mongoose";

const driverProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    password: { type: String, required: true },
    busNumber: { type: String, default: null },
    isAssigned: { type: Boolean, default: false },
    isDriving: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("DriverProfile", driverProfileSchema);
