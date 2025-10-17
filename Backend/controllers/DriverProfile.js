import bcrypt from "bcrypt";
import { genToken } from "../config/JWTToken.js";
import Bus from "../models/Busmodel.js";
import jwt from "jsonwebtoken";
import DriverProfile from "../models/AccessDriver.js";
import History from "../models/HistoryModel.js";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from "fs";





// ✅ Load .env variables
dotenv.config();

// ✅ Setup Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ DEBUG: Check if Cloudinary config is loading
console.log("Cloudinary ENV CONFIG:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? "Loaded ✅" : "Missing ❌"
});

export const driverSignup = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    // ✅ Basic field validation
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if driver already exists
    const existingDriver = await DriverProfile.findOne({ email });
    if (existingDriver) {
      return res.status(400).json({ message: "Driver already registered" });
    }

    // ✅ Validate phone number
    if (!/^\d{10,}$/.test(phoneNumber)) {
      return res.status(400).json({ message: "Please provide a valid phone number" });
    }

    // ✅ Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Helper to upload file to Cloudinary
    const uploadToCloudinary = async (file, documentType) => {
      if (!file || !file.path) {
        throw new Error(`${documentType} file is missing`);
      }

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "drivers_docs",
        resource_type: "auto",
        use_filename: true,
        unique_filename: true
      });

      // ✅ Delete local file after upload
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.warn(`Could not delete file ${file.path}:`, err.message);
      }

      return result.secure_url;
    };

    // ✅ Upload files if provided
    let aadhaarUrl = null, licenseUrl = null, photoUrl = null;

    if (req.files) {
      console.log("Uploaded files:", {
        aadhaar: req.files["aadhaar"]?.[0]?.originalname,
        license: req.files["license"]?.[0]?.originalname,
        photo: req.files["photo"]?.[0]?.originalname
      });

      try {
        if (req.files["aadhaar"]?.[0]) {
          aadhaarUrl = await uploadToCloudinary(req.files["aadhaar"][0], "aadhaar");
        }
        if (req.files["license"]?.[0]) {
          licenseUrl = await uploadToCloudinary(req.files["license"][0], "license");
        }
        if (req.files["photo"]?.[0]) {
          photoUrl = await uploadToCloudinary(req.files["photo"][0], "photo");
        }
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ message: "File upload failed. Please try again." });
      }
    }

    // ✅ Create driver profile
    const newDriverProfile = new DriverProfile({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      aadhaarUrl,
      licenseUrl,
      photoUrl,
    });

    await newDriverProfile.save();

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: newDriverProfile._id },
      process.env.JWT_SECRET || "WSOUGUUTSETA",
      { expiresIn: "7d" }
    );

    // ✅ Send success response
    res.status(201).json({
      message: "Signup successful",
      token,
      driver: {
        id: newDriverProfile._id,
        name: newDriverProfile.name,
        email: newDriverProfile.email,
        phoneNumber: newDriverProfile.phoneNumber,
        aadhaarUrl,
        licenseUrl,
        photoUrl,
        createdAt: newDriverProfile.createdAt,
      },
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};






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
    const { drivers } = req.body;

    if (!drivers || !Array.isArray(drivers) || drivers.length === 0)
      return res.status(400).json({ message: "Drivers array required" });

    const createdDrivers = [];
    const errors = [];

    for (const d of drivers) {
      const { name, email, password, busNumber, phoneNumber, location, tripHistory } = d;

      if (!name || !email || !password || !phoneNumber) {
        errors.push(`All fields required for ${email || "unknown email"}`);
        continue;
      }

      if (password.length < 6) {
        errors.push(`Password too short for ${email}`);
        continue;
      }

      // Check if driver already exists
      const query = { email };
      if (busNumber) query.busNumber = busNumber;

      const exists = await DriverProfile.findOne(query);
      if (exists) {
        errors.push(`Driver exists: ${email}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const driver = await DriverProfile.create({
        name,
        email,
        password: hashedPassword,
        busNumber: busNumber || null,
        phoneNumber,
        isDriving: false,
        location: location || { lat: null, lng: null },
        tripHistory: tripHistory || [],
      });

      createdDrivers.push(driver);
    }

    res.status(201).json({
      message: "Drivers added successfully",
      drivers: createdDrivers,
      errors: errors.length ? errors : undefined,
    });
  } catch (error) {
    console.error("Bulk driver creation error:", error);
    res.status(500).json({ message: "Bulk driver creation failed", error: error.message });
  }
};



export const DriverLogin = async (req, res) => {
  try {
    const { email, password, busNumber } = req.body;

    if (!email || !password || !busNumber)
      return res
        .status(400)
        .json({ message: "Email, password, busNumber required" });

    // 1️⃣ Find driver
    const driver = await DriverProfile.findOne({ email });
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    // 2️⃣ Check password
    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) return res.status(400).json({ message: "Password incorrect" });

    // 3️⃣ Find bus
    const bus = await Bus.findOne({ busNumber });
    if (!bus)
      return res
        .status(404)
        .json({ message: "Bus number not registered by school" });

    // 4️⃣ Check if bus is already assigned
    if (bus.isAssigned && bus.driver?.toString() !== driver._id.toString()) {
      return res
        .status(403)
        .json({ message: "Bus is already assigned to another driver" });
    }

    // 5️⃣ Assign bus to driver
    bus.isAssigned = true;
    bus.driver = driver._id;
    bus.driverName = driver.name;
    bus.driverPhoneNumber = driver.phoneNumber;
    await bus.save();

    // 6️⃣ Update driver model
    driver.busNumber = busNumber;
    driver.isDriving = true;
    driver.assignedBus = bus._id;
    await driver.save();

    // 7️⃣ Create history record
    const newHistory = new History({
      driverName: driver.name,
      email: driver.email,
      phoneNumber: driver.phoneNumber,
      busNumber: bus.busNumber,
      driverActive: true,
      busActive: true,
      loginTime: new Date(),
      history: [
        {
          status: "Login",
          time: new Date(),
        },
      ],
    });

    await newHistory.save();

    // 8️⃣ Generate token & send response
    const token = genToken(driver._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "Login successful",
      driver: {
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        busNumber: driver.busNumber,
        phoneNumber: driver.phoneNumber,
        isDriving: driver.isDriving,
      },
      bus: {
        busNumber: bus.busNumber,
        isAssigned: bus.isAssigned,
        driverName: bus.driverName,
        driverPhoneNumber: bus.driverPhoneNumber,
      },
    });
  } catch (error) {
    console.error("Driver login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};


export const logoutDriver = async (req, res) => {
  try {
    const { busNumber } = req.body;

    if (!busNumber) {
      return res.status(400).json({
        success: false,
        message: "Bus number is required",
      });
    }

    // 1️⃣ Update Bus model → mark as unassigned
    const bus = await Bus.findOneAndUpdate(
      { busNumber },
      {
        $set: {
          driverName: "Unknown",
          isAssigned: false,
          driver: null,
        },
      },
      { new: true }
    );

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    // 2️⃣ Update DriverProfile model → mark as inactive
    const driver = await DriverProfile.findOneAndUpdate(
      { busNumber }, // find driver with that bus
      {
        $set: {
          isDriving: false,
          isAssigned: false,
        },
        $unset: {
          busNumber: "", // remove the field entirely
        },
      },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    // 3️⃣ Update History model → record logout event
    const lastHistory = await History.findOne({
      email: driver.email,
      busNumber: busNumber,
    }).sort({ createdAt: -1 }); // get most recent entry

    if (lastHistory) {
      lastHistory.driverActive = false;
      lastHistory.busActive = false;
      lastHistory.logoutTime = new Date();
      lastHistory.history.push({
        status: "Logout",
        time: new Date(),
      });
      await lastHistory.save();
    } else {
      // if no login record found, create a fallback
      const newHistory = new History({
        driverName: driver.name,
        email: driver.email,
        phoneNumber: driver.phoneNumber,
        busNumber: busNumber,
        driverActive: false,
        busActive: false,
        loginTime: null,
        logoutTime: new Date(),
        history: [
          {
            status: "Logout (No login record found)",
            time: new Date(),
          },
        ],
      });
      await newHistory.save();
    }

    // 4️⃣ Clear cookie (logout)
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // ✅ 5️⃣ Final response
    return res.json({
      success: true,
      message: "Driver logged out successfully.",
      bus,
      driver,
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout driver.",
      error: error.message,
    });
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






export const getAllDriverDetails = async (req, res) => {

  try {
    const AllDrivers = await DriverProfile.find();
    res.status(200).json(AllDrivers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }

}


// when Driver logs in, they can start their ride by providing their credentials and bus number.  in admin dashboard  

export const updateDriverBusAssignment = async (req, res) => {
  try {
    const driverId = req.driver?._id; // driver ID from middleware/auth
    const { busNumber, isDriving } = req.body;

    if (!driverId) {
      return res.status(401).json({ message: "Unauthorized: driver not found" });
    }

    if (!busNumber) {
      return res.status(400).json({ message: "Bus number is required" });
    }

    // Find driver
    const driver = await DriverProfile.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Update fields
    driver.busNumber = busNumber;
    driver.isDriving = isDriving ?? true; // default true if not provided
    driver.isAssigned = !!isDriving; // optional: set isAssigned same as isDriving

    await driver.save();

    res.status(200).json({
      message: "Driver status updated successfully",
      driver,
    });
  } catch (error) {
    console.error("Error updating driver status:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};





export const getdriverid = async (req, res) => {

  try {
    const driver = await DriverProfile.findById(req.params.id);
    // console.log("thsi sis driver", driver)

    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json({ driver });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

