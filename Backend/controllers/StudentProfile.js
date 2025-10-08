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
      subscription: true, // active by default
    });

    const token = await genToken(newStudent._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None", // ✅ works with cross-site
      secure: true,     // ✅ must be true on HTTPS
    });

    return res.status(201).json({
      message: "Signup successful",
      student: {
        _id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
        subscription: newStudent.subscription,
        createdAt: newStudent.createdAt,
      },
    });
  } catch (error) {
    console.log("Student Signup error", error);
    res.status(500).json({ message: "Student Signup error" });
  }
};



// =================== MULTIPLE STUDENT SIGNUP ===================
export const StudentsSignUpBulk = async (req, res) => {
  try {
    const studentsData = req.body.students; // expect array: [{name, email, password}, ...]

    if (!Array.isArray(studentsData) || studentsData.length === 0) {
      return res.status(400).json({ message: "No student data provided" });
    }

    const createdStudents = [];

    for (const student of studentsData) {
      const { name, email, password } = student;

      // Check if already exists
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        continue; // skip existing
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newStudent = await Student.create({
        name,
        email,
        password: hashedPassword,
        subscription: true, // active by default
      });

      const token = await genToken(newStudent._id);

      // Optionally, set a cookie per student (or skip for bulk)
      // res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: "None", secure: true });

      createdStudents.push({
        _id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
        subscription: newStudent.subscription,
        createdAt: newStudent.createdAt,
        token, // if you want to return token
      });
    }

    if (createdStudents.length === 0) {
      return res.status(400).json({ message: "All students already exist" });
    }

    return res.status(201).json({
      message: "Students signup successful",
      students: createdStudents,
    });
  } catch (error) {
    console.log("Bulk Student Signup error", error);
    res.status(500).json({ message: "Bulk Student Signup error" });
  }
};

// =================== STUDENT LOGIN ===================
export const StudentLogIn = async (req, res) => {
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
      return res.status(403).json({ message: "Subscription expired. Please renew." });
    }

    const token = await genToken(student._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false
    });
   console.log("Student Login successful for:", student.email);
    return res.status(200).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      subscription: student.subscription,
      createdAt: student.createdAt,
    });
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
      sameSite: "None",
      secure: true,
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
    const userstudent = await Student.findById(id).select("-password");
    if (!userstudent) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ userstudent });
  } catch (error) {
    console.error("getCurrentStudent error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =================== STUDENT RIDING LOGIN ===================
export const StudentRiding = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: "Student not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Password incorrect" });

    const now = new Date();
    const subscriptionEnd = new Date(student.createdAt);
    subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);

    if (!student.subscription || now > subscriptionEnd) {
      student.subscription = false;
      await student.save();
      return res.status(403).json({ message: "Subscription expired. Please renew." });
    }

    const token = await genToken(student._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      subscription: student.subscription,
    });
  } catch (error) {
    console.log("Student Riding error", error);
    res.status(500).json({ message: "Student Riding error" });
  }
};
