import express from 'express';
import {  StudentRiding,   StudentLogIn, StudentSignUp, StudentLogout, GetCurrentStudent, StudentsSignUpBulk } from '../controllers/StudentProfile.js';
import { isAuth } from '../Middleware/IsAuth.js'; // Use for protected routes

export const StudentRide = express.Router();

// ------------------ PUBLIC ROUTES ------------------

// Signup a new student (subscription true by default)
StudentRide.post("/signupstudent", StudentSignUp);

// Login student (checks subscription validity)
StudentRide.post("/loginstudent", StudentLogIn);

// ------------------ PROTECTED ROUTES ------------------

// Logout student
// StudentRide.post("/logout", isAuth, StudentLogout);
StudentRide.post("/logout", StudentLogout);

// Get current logged-in student info
// StudentRide.get("/current", isAuth, GetCurrentStudent);
StudentRide.get("/current", GetCurrentStudent);

StudentRide.post("/bulk",StudentsSignUpBulk);

// Student ride endpoint (optional: protected if needed)
StudentRide.post("/ride/studentRide", StudentRiding);
