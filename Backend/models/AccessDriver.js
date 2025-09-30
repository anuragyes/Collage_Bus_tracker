import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phoneNumber: { type: String, required: true, unique: true, sparse: true },
    busNumber: { type: String, required: false, unique: true, sparse: true },

    // Assigned bus reference (optional)
    assignedBus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", default: null },

    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },

    isDriving: { type: Boolean, default: false },

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

const DriverProfile = mongoose.model("DriverProfile", DriverSchema);
export default DriverProfile;
