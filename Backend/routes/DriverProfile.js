

import express from "express";
import { isAuth } from "../Middleware/IsAuth.js";
// import { adminAddMultipleDrivers, adminDriver, startDriverRide } from "../controllers/DriverController.js";
import { adminAddMultipleDrivers, adminDriver, DriverLogin, getAllDriverDetails, logoutDriver, startDriverRide } from "../controllers/DriverProfile.js"

const Driverrouter = express.Router();

// Driver starts ride
Driverrouter.post("/drivers/start-ride", startDriverRide);
Driverrouter.post("/driver/login", DriverLogin);
Driverrouter.post("/driver/logout", logoutDriver)
// Admin routes (require authentication)
Driverrouter.post("/drivers/admin", isAuth, adminDriver);
Driverrouter.post("/drivers/admin/bulk", isAuth, adminAddMultipleDrivers);


 Driverrouter.get("/Alldriver" , getAllDriverDetails)

export default Driverrouter;
