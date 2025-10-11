import mongoose from "mongoose";

const driverProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
<<<<<<< HEAD

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

=======
    phoneNumber: { type: String },
>>>>>>> e7f726b5c152ba518eb14a77910c101fe42d2cc9
    password: { type: String, required: true },
    busNumber: { type: String, default: null },
    isAssigned: { type: Boolean, default: false },
    isDriving: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("DriverProfile", driverProfileSchema);
