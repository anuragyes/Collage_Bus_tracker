import express from 'express';
import { GetCurrentStudent, StudentLogIn, StudentLogout, StudentSignUp } from '../controllers/authControllers.js';
import { isAuth } from '../Middleware/IsAuth.js';

export const StudentRouter = express.Router();


 StudentRouter.get("/getstudent", isAuth ,GetCurrentStudent);

StudentRouter.post("/signup", StudentSignUp)
StudentRouter.post("/login", StudentLogIn);
StudentRouter.get("/logout", StudentLogout)



