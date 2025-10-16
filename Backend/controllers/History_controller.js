import History from "../models/HistoryModel.js";

export const fetchHistoryData = async (req, res) => {
  try {
    const allDetails = await History.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({ success: true, allDetails });
  } catch (error) {
    console.error("This is fetching history error:", error);
    // ❌ fix: you used a comma instead of a dot before json()
    res.status(500).json({
      success: false,
      message: "Server error fetching history details",
      error: error.message,
    });
  }
};
