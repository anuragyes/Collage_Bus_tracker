// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import http from "http";
// import { Server } from "socket.io";
// import connectionDb from "./config/db.js";
// import { StudentRouter } from "./routes/StudentRoutes.js";
// import { DriverRouter } from "./routes/DriverRoutes.js";
// import ProfileDriver from "./routes/DriverProfile.js";
// import router from "./routes/BusRouter.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));

// // Create HTTP server & bind Socket.IO
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// // This object will hold the latest location for each bus
// const busLocations = {};

// // Socket.IO event handling
// io.on("connection", (socket) => {
//   console.log(`A user connected with ID: ${socket.id}`);

//   // When a client (e.g., a bus driver's device) sends its location
//   // We'll use the event name "send_location"
//   socket.on("send_location", (data) => {
//     console.log(`Received location update from bus ${data.busId}:`, data);
    
//     // Store the latest location
//     busLocations[data.busId] = data;

//     // Broadcast the new location to ALL connected clients
//     io.emit("busLocation", data);
//   });

//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });

// // busId routes
// app.use("/api/bus", router);

// // Routes
// app.use("/api/student", StudentRouter);
// app.use("/api/driver", DriverRouter);
// app.use("/api/driverprofile", ProfileDriver);

// // Default route
// app.use("/", (req, res) => {
//   res.send("Server is running");
// });

// // Start server after DB connection
// connectionDb()
//   .then(() => {
//     server.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("Database connection failed:", err);
//   });
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import connectionDb from "./config/db.js";
import { StudentRouter } from "./routes/StudentRoutes.js";
import { DriverRouter } from "./routes/DriverRoutes.js";
import ProfileDriver from "./routes/DriverProfile.js";
import router from "./routes/BusRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Create HTTP server & bind Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// An object to store the latest location for each bus
const busLocations = {};

// Socket.IO event handling
io.on("connection", (socket) => {
  console.log(`A new client connected with ID: ${socket.id}`);

  // When a client (e.g., a driver's device) sends its live location
  socket.on("send_location", (data) => {
    // Data is expected to be in the format: { busId: "...", latitude: ..., longitude: ... }
    const { busId, latitude, longitude } = data;

    if (busId && latitude && longitude) {
      console.log(`Location update from bus ${busId}: [${latitude}, ${longitude}]`);
      
      // Store the latest location in the server's memory
      busLocations[busId] = { latitude, longitude, timestamp: new Date() };

      // Broadcast the location update to all other connected clients
      // `socket.broadcast.emit` sends to everyone EXCEPT the sender
      socket.broadcast.emit("busLocation", { busId, latitude, longitude });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    // You could also add logic here to remove the bus from the map if it's a driver's client
  });
});

// Routes
app.use("/api/bus", router);
app.use("/api/student", StudentRouter);
app.use("/api/driver", DriverRouter);
app.use("/api/driverprofile", ProfileDriver);

// Default route
app.use("/", (req, res) => {
  res.send("Server is running");
});

// Start server after DB connection
connectionDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });