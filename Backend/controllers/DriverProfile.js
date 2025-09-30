import bcrypt from "bcrypt";
import { genToken } from "../config/JWTToken.js";
import Bus from "../models/Busmodel.js";
import DriverProfile from "../models/AccessDriver.js";

// =================== ADMIN: Add single driver ===================
export const adminDriver = async (req, res) => {
  try {
    const { name, email, password, busNumber, phoneNumber } = req.body;

    if (!name || !email || !password || !busNumber || !phoneNumber)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await DriverProfile.findOne({ $or: [{ email }, { busNumber }] });
    if (existing)
      return res.status(400).json({ message: "Email or Bus already taken" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const driver = await DriverProfile.create({
      name,
      email,
      password: hashedPassword,
      busNumber,
      phoneNumber,
      isDriving: false,
    });

    const token = await genToken(driver._id);
    res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: "strict", secure: false });

    res.status(201).json({ message: "Driver added successfully", driver });
  } catch (error) {
    console.error("Driver signup error:", error);
    res.status(500).json({ message: "Driver signup failed" });
  }
};

// =================== ADMIN: Add multiple drivers ===================
export const adminAddMultipleDrivers = async (req, res) => {
  try {
    const { drivers } = req.body; // expect array
    if (!drivers || !Array.isArray(drivers) || drivers.length === 0)
      return res.status(400).json({ message: "Drivers array required" });

    const createdDrivers = [];

    for (const d of drivers) {
      const { name, email, password, busNumber, phoneNumber } = d;

      if (!name || !email || !password || !busNumber || !phoneNumber)
        return res.status(400).json({ message: `All fields required for ${email}` });

      if (password.length < 6)
        return res.status(400).json({ message: `Password too short for ${email}` });

      const exists = await DriverProfile.findOne({ $or: [{ email }, { busNumber }] });
      if (exists) return res.status(400).json({ message: `Driver exists: ${email}` });

      const hashedPassword = await bcrypt.hash(password, 10);

      const driver = await DriverProfile.create({
        name,
        email,
        password: hashedPassword,
        busNumber,
        phoneNumber,
        isDriving: false,
        location: d.location || { lat: 0, lng: 0 },
        tripHistory: d.tripHistory || [],
      });

      createdDrivers.push(driver);
    }

    res.status(201).json({ message: "Drivers added successfully", drivers: createdDrivers });
  } catch (error) {
    console.error("Bulk driver creation error:", error);
    res.status(500).json({ message: "Bulk driver creation failed" });
  }
};

export const DriverLogin = async (req, res) => {
  try {
    const { email, password, busNumber } = req.body;

    if (!email || !password || !busNumber)
      return res.status(400).json({ message: "Email, password & busNumber required" });

    // 1️⃣ Find driver
    const driver = await DriverProfile.findOne({ email });
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    // 2️⃣ Check password
    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) return res.status(400).json({ message: "Password incorrect" });

    // 3️⃣ Find the bus from database
    const bus = await Bus.findOne({ busNumber });
    if (!bus) return res.status(404).json({ message: "Bus number not registered by school" });

    // 4️⃣ Check if bus is already assigned to another driver
    if (bus.isAssigned && bus.assignedDriver?.toString() !== driver._id.toString()) {
      return res.status(403).json({ message: "Bus is already assigned to another driver" });
    }

    // 5️⃣ Assign bus to driver (if not already assigned)
    bus.isAssigned = true;
    bus.assignedDriver = driver._id;
    bus.driverPhoneNumber = driver.phoneNumber;
    await bus.save();

    driver.busNumber = busNumber;
    driver.isDriving = true;
    await driver.save();

    // 6️⃣ Generate token & set cookie
    const token = genToken(driver._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "Login successful", driver });
  } catch (error) {
    console.error("Driver login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};


//  to update database bus vlaue false 

// export const logoutDriver = async (req, res) => {
//   try {
//     const { busNumber } = req.body;

//     if (!busNumber) return res.status(400).json({ success: false, message: "Bus number is required" });
//     console.log("this is busnumber f rom backend " , busNumber);

//     await Bus.findOneAndUpdate(
//       { busNumber },
//       { $unset: { busNumber: "" }, isDriving: false }
//     );

//     res.json({ success: true, message: "Driver logged out successfully." });
//   } catch (error) {
//     console.error("Logout error:", error);
//     res.status(500).json({ success: false, message: "Failed to logout driver." });
//   }
// }


export const logoutDriver = async (req, res) => {
  try {
    const { busNumber } = req.body;

    if (!busNumber) {
      return res.status(400).json({ success: false, message: "Bus number is required" });
    }

    console.log("Bus logout request for:", busNumber);

    // Set isAssigned = false and driver = null
    const bus = await Bus.findOneAndUpdate(
      { busNumber },
      { isAssigned: false, driver: null },
      { new: true }
    );

    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    res.json({ success: true, message: "Driver logged out successfully.", bus });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Failed to logout driver." });
  }
};


export const startDriverRide = async (req, res) => {
  try {
    const { email, password, busNumber } = req.body;

    if (!email || !password || !busNumber)
      return res.status(400).json({ message: "Email, password & busNumber required" });

    // 1️⃣ Authenticate driver
    const driver = await DriverProfile.findOne({ email });
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) return res.status(401).json({ message: "Password incorrect" });

    // 2️⃣ Find the bus from the database
    const bus = await Bus.findOne({ busNumber });
    if (!bus) return res.status(404).json({ message: "Bus not registered by school" });

    // 3️⃣ Check if bus is assigned to another driver
    if (bus.isAssigned && bus.assignedDriver?.toString() !== driver._id.toString()) {
      return res.status(403).json({ message: "Bus is already assigned to another driver" });
    }

    // 4️⃣ Assign bus to this driver
    bus.isAssigned = true;
    bus.assignedDriver = driver._id;
    bus.driverPhoneNumber = driver.phoneNumber;
    await bus.save();

    // 5️⃣ Update driver info
    driver.busNumber = busNumber;
    driver.isDriving = true;
    await driver.save();

    // 6️⃣ Generate token & set cookie
    const token = genToken(driver._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // 7️⃣ Success response
    res.status(200).json({
      message: "Ride started successfully. Live tracking enabled.",
      driver,
    });
  } catch (error) {
    console.error("Error starting driver ride:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
