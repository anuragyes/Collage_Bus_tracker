import bcrypt from "bcrypt";

import Client from "../models/authmodel.js"; 
import { genToken } from "../config/JWTToken.js";


export const ClientSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if client already exists
        const existingClient = await Client.findOne({ email });
        if (existingClient) {
            return res.status(400).json({ message: "Email already taken" });
        }

        // 2. Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create new client data
        const newClient = await Client.create({
            name,
            email,
            password: hashedPassword,
        });

        // 5. Generate token using the new client's ID
        // FIX: Used newClient._id instead of client._id
        const token = genToken(newClient._id);

        // 6. Set secure cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            sameSite: "None", // Required for cross-site cookies (e.g., frontend on different port)
            secure: true,     // Required when sameSite is 'None'
        });

        // Return the created client data (excluding password)
        return res.status(201).json({ client: newClient.name, email: newClient.email });
    } catch (error) {
        console.error("Client Signup error:", error);
        res.status(500).json({ message: "Server error during client signup" });
    }
};


export const ClientLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find client by email
        const clientData = await Client.findOne({ email });
        if (!clientData) {
            return res.status(400).json({ message: "Invalid credentials (Email not found)" });
        }

        // 2. Compare passwords
        // FIX: Correctly using clientData.password for comparison
        const isMatch = await bcrypt.compare(password, clientData.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials (Password incorrect)" });
        }

        // 3. Generate token
        // FIX: Correctly using clientData._id for token generation
        const token = genToken(clientData._id);

        // 4. Set secure cookie (matching Sign Up settings)
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "None", 
            secure: true,
        });

        // 5. Return the client data
        // FIX: Return clientData instead of the Mongoose model 'client'
        return res.status(200).json({ client: clientData.name, email: clientData.email });
    } catch (error) {
        console.error("Client Login error:", error);
        res.status(500).json({ message: "Server error during client login" });
    }
};



 
export const GetClient = async (req, res) => {
    try {
        // Assuming your authentication middleware attaches the user ID to req.userId
        const id = req.userId; 
        
        // 1. Find client by ID
        // FIX: Renamed userstudent to clientData for clarity
        const clientData = await Client.findById(id).select("-password"); // Exclude password field
        
        // FIX: Corrected typo userclinet
        if (!clientData) {
            return res.status(404).json({ message: "Client not found" });
        }

        // 2. Return client object
        // FIX: Corrected typo userclinet
        res.status(200).json({ clientData });
    } catch (error) {
        console.error("GetClient error:", error);
        res.status(500).json({ message: "Server error" });
    }
}


export const ClientLogout = async (req, res) => {
    try {
        // Clear the cookie, ensuring options match how it was set (SameSite=None, Secure=true)
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "None", // Must match the setting used when the cookie was created
            secure: true      // Must match the setting used when the cookie was created
        });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Client Logout error:", error);
        res.status(500).json({ message: "Server error during client logout" });
    }
};













































// // =================== DRIVER SIGNUP ===================
// export const DriverSignUp = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         // check if driver already exists
//         const existing = await Driver.findOne({ email });
//         if (existing) {
//             return res.status(400).json({ message: "Email Already Taken" });
//         }

//         if (password.length < 6) {
//             return res.status(400).json({ message: "Password must be at least 6 characters" });
//         }

//         // hash password correctly
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const driver = await Driver.create({
//             name,
//             email,
//             password: hashedPassword,
//         });

//         // generate token
//         const token = await genToken(driver._id);

//         res.cookie("token", token, {
//             httpOnly: true,
//             maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//             sameSite: "None",
//             secure: true,
//         });

//         return res.status(201).json(driver);
//     } catch (error) {
//         console.log("Driver Signup error", error);
//         res.status(500).json({ message: "Driver Signup error" });
//     }
// };

// // =================== DRIVER LOGIN ===================
// export const DriverLogIn = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const driver = await Driver.findOne({ email });
//         if (!driver) {
//             return res.status(400).json({ message: "Driver not Found" });
//         }

//         // compare passwords
//         const isMatch = await bcrypt.compare(password, driver.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: "Password Incorrect" });
//         }

//         const token = await genToken(driver._id);

//         res.cookie("token", token, {
//             httpOnly: true,
//             maxAge: 7 * 24 * 60 * 60 * 1000,
//             sameSite: "strict",
//             secure: false,
//         });

//         return res.status(200).json(driver);
//     } catch (error) {
//         console.log("Driver Login error", error);
//         res.status(500).json({ message: "Driver Login error" });
//     }
// };


// export const DriverLogout = async (req, res) => {
//     try {
//         res.clearCookie("token", {
//             httpOnly: true,
//             sameSite: "strict",
//             secure: false
//         });
//         return res.status(200).json({ message: "Logged out successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Logout error" });
//     }
// };

// export const GetCurrentDriver = async (req, res) => {


//     try {
//         const id = req.userId;
//         const userDriver = await Driver.findById(id);

//         if (!userDriver) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Return user object directly
//         res.status(200).json({ userDriver });
//     } catch (error) {
//         console.error("getCurrentDriver error:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// }



