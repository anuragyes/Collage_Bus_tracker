import express from 'express';
import { DriverLogIn, DriverLogout, DriverSignUp, GetCurrentDriver } from '../controllers/authControllers.js';
import { isAuth } from '../Middleware/IsAuth.js';

export const DriverRouter = express.Router();


 DriverRouter.get("/currentDriver"  , isAuth,GetCurrentDriver);

DriverRouter.post("/signup", DriverSignUp);
DriverRouter.post("/login", DriverLogIn);
DriverRouter.get("/logout", DriverLogout);

