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
          return !phone || /^[\+]?[1-9][\d]{0,15}$/.test(phone);
        },
        message: "Please provide a valid phone number",
      },
    },

    password: { type: String, required: true },

    // NEW FIELDS
    aadhaarNumber: {
      type: String,
      unique: true,
      sparse: true,
      minlength: 12,
      maxlength: 12,
      validate: {
        validator: function (v) {
          return /^\d{12}$/.test(v);
        },
        message: props => `${props.value} is not a valid Aadhaar number!`
      }
    },

    dateOfBirth: {
      type: Date,
    },

    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },

    licenseNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    busNumber: { type: String, default: null },
    isAssigned: { type: Boolean, default: false },
    isDriving: { type: Boolean, default: false },

    aadhaarUrl: String,
    licenseUrl: String,
    photoUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("DriverProfile", driverProfileSchema);
