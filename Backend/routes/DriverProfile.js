import express from "express";

 import { isAuth } from "../Middleware/IsAuth.js";
import { adminAddMultipleDrivers, adminDriver, startDriverRide } from "../controllers/DriverProfile.js";



const ProfileDriver = express.Router();
ProfileDriver.post("/riding/driver" , isAuth ,  startDriverRide)
ProfileDriver.post("/AdminDriver", isAuth , adminDriver);
ProfileDriver.post("/multipleProfile" , isAuth , adminAddMultipleDrivers)

export default ProfileDriver;
