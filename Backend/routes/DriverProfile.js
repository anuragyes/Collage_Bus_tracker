

import express from "express";
import multer from "multer";
import DriverProfile from "../models/AccessDriver.js";
import { isAuth } from "../Middleware/IsAuth.js";
// import { adminAddMultipleDrivers, adminDriver, startDriverRide } from "../controllers/DriverController.js";
import { adminAddMultipleDrivers, adminDriver, DriverLogin, driverSignup, getAllDriverDetails, getdriverid, logoutDriver, startDriverRide, updateDriverBusAssignment } from "../controllers/DriverProfile.js"

const Driverrouter = express.Router();
// Multer config: store temporary files in 'uploads/'
const upload = multer({ dest: "uploads/" });

Driverrouter.post(
    "/driversignup",
    upload.fields([
        { name: "aadhaar", maxCount: 1 },
        { name: "license", maxCount: 1 },
        { name: "photo", maxCount: 1 },
    ]),
    driverSignup
);

// Driver starts ride
Driverrouter.post("/drivers/start-ride", startDriverRide);
// Driverrouter.post("/driversignup", driverSignup)
Driverrouter.post("/driver/login", DriverLogin);
Driverrouter.post("/driver/logout", logoutDriver)
// Admin routes (require authentication)
Driverrouter.post("/drivers/admin", isAuth, adminDriver);
Driverrouter.post("/drivers/admin/bulk", adminAddMultipleDrivers);
Driverrouter.get("/Alldriver", getAllDriverDetails)

//  update the bus number assigned where driver used any bus 
Driverrouter.post("/driver/update-bus", updateDriverBusAssignment);


// GET single driver
Driverrouter.get("/admin/drivers/:id" , getdriverid);
    



export default Driverrouter;
