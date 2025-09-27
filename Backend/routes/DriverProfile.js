import express from "express";
 

 import { isAuth } from "../Middleware/IsAuth.js";
import { startDriverRide } from "../controllers/DriverProfile.js";

const ProfileDriver = express.Router();
ProfileDriver.post("/riding" , isAuth , startDriverRide)

export default ProfileDriver;
