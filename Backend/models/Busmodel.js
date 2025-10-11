import mongoose from "mongoose";

const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    route: {
      type: String,
      trim: true,
    },
    capacity: {
      type: Number, // total number of passengers the bus can hold
    },
    isAssigned: {
      type: Boolean,
      default: false,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    driverName: {
      type: String,
      default: null, // name of the driver (for admin UI)
    },
    driverPhoneNumber: {
      type: String,
      default: null,
    },
    currentLocation: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      timestamp: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

const Bus = mongoose.model("Bus", busSchema);
export default Bus;
