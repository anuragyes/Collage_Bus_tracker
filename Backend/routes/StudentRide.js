import express from 'express';


// import { isAuth } from '../Middleware/IsAuth.js';
import StudentRiding from '../controllers/StudentProfile.js';

export const StudentRide = express.Router();


StudentRide.post("/studentRide",  StudentRiding);




