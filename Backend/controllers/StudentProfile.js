import bcrypt from "bcrypt";
import { genToken } from "../config/JWTToken.js";
import Student from "../models/StudentModel.js";




//   subscription by collage student 


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



 const StudentRiding = async (req, res) => {
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
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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


