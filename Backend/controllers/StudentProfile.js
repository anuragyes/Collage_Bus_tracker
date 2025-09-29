import bcrypt from "bcrypt";
import { genToken } from "../config/JWTToken.js";
import Student from "../models/StudentModel.js";
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

  export default StudentRiding
