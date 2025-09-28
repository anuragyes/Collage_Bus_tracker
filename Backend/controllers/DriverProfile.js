import bcrypt from "bcrypt";
import { genToken } from "../config/JWTToken.js";
import Driver from "../models/DriverModel.js"
import Bus from "../models/Busmodel.js"



export const startDriverRide = async (req, res) => {
    try {
        const { email, password, busNumber } = req.body;

        // 1. Authenticate the driver by email and password
        const driver = await Driver.findOne({ email });
        if (!driver) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, driver.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 2. Find the bus by the provided busNumber.
        const bus = await Bus.findOne({ busNumber });
        if (!bus) {
            return res.status(404).json({ message: "Bus number not found or not registered by the school" });
        }

        // 3. Check if the bus is already assigned.
        if (bus.isAssigned) {
            // Check if the current driver is the one assigned to this bus.
            if (bus.assignedDriver && bus.assignedDriver.toString() !== driver._id.toString()) {
                return res.status(409).json({ message: "This bus is currently in use by another driver" });
            }
        }

        // 4. Update both the driver and bus documents.
        // Link the driver's ID to the bus and mark the bus as assigned.
        bus.isAssigned = true;
        bus.assignedDriver = driver._id;
        bus.driverPhoneNumber = driver.phoneNumber; // Assuming you get this from the driver's profile
        await bus.save();

        // Update the driver's profile.
        driver.busNumber = busNumber;
        driver.isDriving = true;
        await driver.save();

        // 5. Generate a token and send a successful response.
        const token = genToken(driver._id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        return res.status(200).json({
            message: "Ride started successfully. Live location tracking can now begin.",
            driver, // Return the updated driver document
        });

    } catch (error) {
        console.error("Error starting driver ride:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};




