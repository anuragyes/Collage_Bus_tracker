import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    driverName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    busNumber: { type: String, required: true }, // ✅ CHANGED from Number → String
    driverActive: { type: Boolean, default: false },
    busActive: { type: Boolean, default: false },
    loginTime: { type: Date, default: Date.now },
    logoutTime: { type: Date },
    history: {
      type: [
        {
          status: String, // e.g. "Login" or "Logout"
          time: Date,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const History = mongoose.model("History", historySchema);
export default History;
