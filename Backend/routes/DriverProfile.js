

import express from "express";
import { isAuth } from "../Middleware/IsAuth.js";
// import { adminAddMultipleDrivers, adminDriver, startDriverRide } from "../controllers/DriverController.js";
<<<<<<< HEAD
import { adminAddMultipleDrivers, adminDriver, DriverLogin, driverSignup, getAllDriverDetails, logoutDriver, startDriverRide, updateDriverBusAssignment } from "../controllers/DriverProfile.js"
=======
import { adminAddMultipleDrivers, adminDriver, DriverLogin, getAllDriverDetails, logoutDriver, startDriverRide, updateDriverBusAssignment,  } from "../controllers/DriverProfile.js"
>>>>>>> e7f726b5c152ba518eb14a77910c101fe42d2cc9

const Driverrouter = express.Router();

// Driver starts ride
Driverrouter.post("/drivers/start-ride", startDriverRide);
Driverrouter.post("/driversignup", driverSignup)
Driverrouter.post("/driver/login", DriverLogin);
Driverrouter.post("/driver/logout", logoutDriver)
// Admin routes (require authentication)
Driverrouter.post("/drivers/admin", isAuth, adminDriver);
<<<<<<< HEAD
Driverrouter.post("/drivers/admin/bulk", adminAddMultipleDrivers);
Driverrouter.get("/Alldriver", getAllDriverDetails)

//  update the bus number assigned where driver used any bus 
Driverrouter.post("/driver/update-bus", updateDriverBusAssignment);
=======
Driverrouter.post("/drivers/admin/bulk", isAuth, adminAddMultipleDrivers);
Driverrouter.get("/Alldriver", getAllDriverDetails)

//  update the bus number assigned where driver used any bus 
 Driverrouter.post("/driver/update-bus",updateDriverBusAssignment);
>>>>>>> e7f726b5c152ba518eb14a77910c101fe42d2cc9



export default Driverrouter;
