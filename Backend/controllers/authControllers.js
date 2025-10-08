import bcrypt from "bcrypt";
import client from "../models/authmodel.js";
import { genToken } from "../config/JWTToken.js";

// =================== CLIENT SIGNUP ===================
export const ClientSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if client already exists
    const existingClient = await client.findOne({ email });
    if (existingClient) return res.status(400).json({ message: "Email already taken" });

    // 2. Validate password length
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create new client
    const newClient = await client.create({ name, email, password: hashedPassword });

    // 5. Generate token
    const token = genToken(newClient._id);

    // 6. Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "None",
      secure: true,
    });

    return res.status(201).json({ name: newClient.name, email: newClient.email });
  } catch (error) {
    console.error("Client Signup error:", error);
    res.status(500).json({ message: "Server error during client signup" });
  }
};

// =================== CLIENT LOGIN ===================
export const ClientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find client
    const clientData = await client.findOne({ email });
    if (!clientData) return res.status(400).json({ message: "Invalid credentials (Email not found)" });

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, clientData.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials (Password incorrect)" });

    // 3. Generate token
    const token = genToken(clientData._id);

    // 4. Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json({ name: clientData.name, email: clientData.email });
  } catch (error) {
    console.error("Client Login error:", error);
    res.status(500).json({ message: "Server error during client login" });
  }
};

// =================== GET CURRENT CLIENT ===================
export const GetClient = async (req, res) => {
  try {
    const id = req.userId; // assuming middleware sets req.userId

    const clientData = await client.findById(id).select("-password"); // exclude password
    if (!clientData) return res.status(404).json({ message: "Client not found" });

    res.status(200).json({ clientData });
  } catch (error) {
    console.error("GetClient error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =================== CLIENT LOGOUT ===================
export const ClientLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Client Logout error:", error);
    res.status(500).json({ message: "Server error during client logout" });
  }
};
