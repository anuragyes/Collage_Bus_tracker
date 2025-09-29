import bcrypt from "bcrypt";
import { genToken } from "../config/JWTToken.js";
import Driver from "../models/DriverModel.js"
import Bus from "../models/Busmodel.js"
import DriverProfile from "../models/AccessDriver.js"




export const adminDriver = async (req, res) => {
  try {
    const { name, email, password, busNumber, phoneNumber } = req.body;

    // validate required fields
    if (!name || !email || !password || !busNumber || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if email already exists
    const existing = await DriverProfile.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email Already Taken" });
    }

    // check if busNumber already exists
    const busTaken = await DriverProfile.findOne({ busNumber });
    if (busTaken) {
      return res.status(400).json({ message: "Bus Already Taken by another driver" });
    }

    // check password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create driver
    const driver = await DriverProfile.create({
      name,
      email,
      password: hashedPassword,
      busNumber,
      phoneNumber,
      isDriving: false,
    });

    // generate token
    const token = await genToken(driver._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false,
    });

    return res.status(201).json(driver);
  } catch (error) {
    console.error("driverProfile Signup error", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate field value entered" });
    }

    res.status(500).json({ message: "driverProfile Signup error" });
  }
};


export const adminAddMultipleDrivers = async (req, res) => {
  try {
    const drivers = req.body.drivers; // expect array of driver objects

    if (!drivers || !Array.isArray(drivers) || drivers.length === 0) {
      return res.status(400).json({ message: "Drivers array is required" });
    }

    const createdDrivers = [];

    for (const driverData of drivers) {
      const { name, email, password, busNumber, phoneNumber } = driverData;

      if (!name || !email || !password || !busNumber || !phoneNumber) {
        return res.status(400).json({ message: "All fields are required for each driver" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: `Password too short for ${email}` });
      }

      // check if email or busNumber already exists
      const existingDriver = await DriverProfile.findOne({ $or: [{ email }, { busNumber }] });
      if (existingDriver) {
        return res.status(400).json({ message: `Driver with email or busNumber already exists: ${email}` });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const driver = await DriverProfile.create({
        name,
        email,
        password: hashedPassword,
        busNumber,
        phoneNumber,
        isDriving: false,
        location: driverData.location || { lat: 0, lng: 0 },
        tripHistory: driverData.tripHistory || [],
      });

      createdDrivers.push(driver);
    }

    return res.status(201).json({ message: "Drivers added successfully", drivers: createdDrivers });
  } catch (error) {
    console.error("Bulk driver creation error", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate field value found" });
    }

    return res.status(500).json({ message: "Bulk driver creation failed" });
  }
};


export const startDriverRide = async (req, res) => {
    try {
        const { email, password, busNumber } = req.body;

        // 1. Authenticate the driver by email and password
        const driver = await DriverProfile.findOne({ email });
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




