import express from "express";
import Bus from "../models/Busmodel.js";

const router = express.Router();

// A simple endpoint to create a single bus
router.post("/register", async (req, res) => {
  const { busNumber, route } = req.body;
  try {
    // Check if a bus with this number already exists
    const existingBus = await Bus.findOne({ busNumber });
    if (existingBus) {
      return res.status(409).json({ message: "Bus with this number already exists." });
    }

    const newBus = new Bus({ busNumber, route });
    await newBus.save();
    res.status(201).json({ message: "Bus registered successfully.", bus: newBus });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
});

// An endpoint to register multiple buses at once (useful for initial setup)
router.post("/register-multiple", async (req, res) => {
  const busesToRegister = req.body.buses; // Expects an array of bus objects
  if (!Array.isArray(busesToRegister)) {
    return res.status(400).json({ message: "Input must be an array of buses." });
  }

  try {
    const results = await Promise.all(
      busesToRegister.map(async (busData) => {
        const { busNumber, route } = busData;
        const existingBus = await Bus.findOne({ busNumber });
        if (existingBus) {
          return { busNumber, status: "failed", message: "Bus number already exists." };
        }
        const newBus = new Bus({ busNumber, route });
        await newBus.save();
        return { busNumber, status: "success", bus: newBus };
      })
    );
    res.status(201).json({ message: "Multiple bus registrations processed.", results });
  } catch (error) {
    res.status(500).json({ message: "Server error during bulk registration.", error });
  }
});

export default router;