import mongoose from "mongoose";

const driverProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator: function (phone) {
          // Basic phone number validation (adjust regex if needed)
          return !phone || /^[\+]?[1-9][\d]{0,15}$/.test(phone);
        },
        message: "Please provide a valid phone number",
      },
    },

    password: { type: String, required: true },
    busNumber: { type: String, default: null },
    isAssigned: { type: Boolean, default: false },
    isDriving: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("DriverProfile", driverProfileSchema);
