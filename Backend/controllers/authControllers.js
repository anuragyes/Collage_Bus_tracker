import bcrypt from "bcrypt";
import { genToken } from "../config/JWTToken.js";
import Student from "../models/StudentModel.js"
import Driver from "../models/DriverModel.js"

// =================== STUDENT SIGNUP ===================
export const StudentSignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check if student already exists
        const existing = await Student.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email Already Taken" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await Student.create({
            name,
            email,
            password: hashedPassword,
        });

        // generate token
        const token = await genToken(student._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: "strict",
            secure: false,
        });

        return res.status(201).json(student);
    } catch (error) {
        console.log("Student Signup error", error);
        res.status(500).json({ message: "Student Signup error" });
    }
};

// =================== STUDENT LOGIN ===================
export const StudentLogIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ message: "Student not Found" });
        }

        // compare passwords
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password Incorrect" });
        }

        const token = await genToken(student._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false,
        });

        return res.status(200).json(student);
    } catch (error) {
        console.log("Student Login error", error);
        res.status(500).json({ message: "Student Login error" });
    }
};



//   logout Student 


export const StudentLogout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
            secure: false
        });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Logout error" });
    }
};

export const GetCurrentStudent = async (req, res) => {


    try {
        const id = req.userId;
        const userstudent = await Student.findById(id);

        if (!userstudent) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return user object directly
        res.status(200).json({ userstudent });
    } catch (error) {
        console.error("getCurrentstudent error:", error);
        res.status(500).json({ message: "Server error" });
    }
}







// =================== DRIVER SIGNUP ===================
export const DriverSignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check if driver already exists
        const existing = await Driver.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email Already Taken" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // hash password correctly
        const hashedPassword = await bcrypt.hash(password, 10);

        const driver = await Driver.create({
            name,
            email,
            password: hashedPassword,
        });

        // generate token
        const token = await genToken(driver._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: "None",
            secure: true,
        });

        return res.status(201).json(driver);
    } catch (error) {
        console.log("Driver Signup error", error);
        res.status(500).json({ message: "Driver Signup error" });
    }
};

// =================== DRIVER LOGIN ===================
export const DriverLogIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const driver = await Driver.findOne({ email });
        if (!driver) {
            return res.status(400).json({ message: "Driver not Found" });
        }

        // compare passwords
        const isMatch = await bcrypt.compare(password, driver.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password Incorrect" });
        }

        const token = await genToken(driver._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false,
        });

        return res.status(200).json(driver);
    } catch (error) {
        console.log("Driver Login error", error);
        res.status(500).json({ message: "Driver Login error" });
    }
};


export const DriverLogout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
            secure: false
        });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Logout error" });
    }
};

export const GetCurrentDriver = async (req, res) => {


    try {
        const id = req.userId;
        const userDriver = await Driver.findById(id);

        if (!userDriver) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return user object directly
        res.status(200).json({ userDriver });
    } catch (error) {
        console.error("getCurrentDriver error:", error);
        res.status(500).json({ message: "Server error" });
    }
}



