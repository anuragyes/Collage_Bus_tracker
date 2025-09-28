import mongoose from "mongoose";

const AccessModelStudent = new mongoose.Schema(
  {
    // Existing authentication fields from the first schema
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },

    // Additional fields from your profile schema
    phoneNumber: { type: String, required: false, unique: true, sparse: true },
    busNumber: { type: String, required: false, unique: true, sparse: true },

    // Live location tracking
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },

    // Trip status
    isDriving: { type: Boolean, default: false },

    // Optional trip history
    tripHistory: [
      {
        startTime: Date,
        endTime: Date,
        route: String,
      },
    ],
  },
  { timestamps: true }
);

const Driver = mongoose.model("Driver", AccessModelStudent);

export default Driver;