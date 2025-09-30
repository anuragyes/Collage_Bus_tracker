import bcrypt from "bcrypt";
import { genToken } from "../config/JWTToken.js";
import Student from "../models/StudentModel.js";

// =================== STUDENT SIGNUP ===================
export const StudentSignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: "Student already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = await Student.create({
            name,
            email,
            password: hashedPassword,
            subscription: true, // active subscription by default
        });

        const token = await genToken(newStudent._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false,
        });

        return res.status(201).json({ message: "Signup successful", student: newStudent });
    } catch (error) {
        console.log("Student Signup error", error);
        res.status(500).json({ message: "Student Signup error" });
    }
};

// =================== STUDENT LOGIN WITH SUBSCRIPTION CHECK ===================
export const StudentLogIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ message: "Student not found" });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password incorrect" });
        }

        // Check subscription (1 year from signup)
        const now = new Date();
        const subscriptionEnd = new Date(student.createdAt);
        subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);

        if (!student.subscription || now > subscriptionEnd) {
            student.subscription = false; // mark subscription expired
            await student.save();
            return res.status(403).json({ message: "Subscription expired. Please renew to access dashboard." });
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

// =================== STUDENT LOGOUT ===================
export const StudentLogout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
            secure: false,
        });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Logout error" });
    }
};

// =================== GET CURRENT STUDENT ===================
export const GetCurrentStudent = async (req, res) => {
    try {
        const id = req.userId;
        const userstudent = await Student.findById(id);

        if (!userstudent) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ userstudent });
    } catch (error) {
        console.error("getCurrentStudent error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// =================== STUDENT RIDING LOGIN (SUBSCRIPTION CHECK) ===================
const StudentRiding = async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ email });
        if (!student) return res.status(400).json({ message: "Student not found" });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: "Password incorrect" });

        // Check subscription
        const now = new Date();
        const subscriptionEnd = new Date(student.createdAt);
        subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);

        if (!student.subscription || now > subscriptionEnd) {
            student.subscription = false;
            await student.save();
            return res.status(403).json({ message: "Subscription expired. Please renew to access dashboard." });
        }

        const token = await genToken(student._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true,
        });

        return res.status(200).json(student);
    } catch (error) {
        console.log("Student Login error", error);
        res.status(500).json({ message: "Student Login error" });
    }
};

export default StudentRiding;
