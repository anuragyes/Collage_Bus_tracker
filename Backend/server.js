
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import connectionDb from "./config/db.js";
import ProfileDriver from "./routes/DriverProfile.js";
import router from "./routes/BusRouter.js";
import { StudentRide } from "./routes/StudentRide.js";
import { AuthRouter } from "./routes/AuthClient.js";
// import DriverProfile from "./models/DriverProfile.js"; // make sure this import exists
import DriverProfile from "./models/AccessDriver.js";
import Driverrouter from "./routes/DriverProfile.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS setup for deployed frontend
app.use(
  cors({
    origin: "https://collage-bus-tracker-frontend.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// HTTP server + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://collage-bus-tracker-frontend.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Store live buses and their details
const busLocations = new Map(); // Using Map instead of object for better performance


// Store connected users
const connectedUsers = new Map();

// // --- SOCKET.IO EVENTS ---



// --- SOCKET.IO EVENTS ---
io.on("connection", (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  // Add to connected users
  connectedUsers.set(socket.id, {
    id: socket.id,
    type: "unknown",
    connectedAt: new Date()
  });

  // DRIVER LOGIN
  socket.on("driver_login", async (data) => {
    try {
      const { busId, driverName, initialLocation, route = "R1" } = data;

      if (!busId) return socket.emit("error", { message: "Bus ID is required" });

      console.log(`🚗 Driver ${driverName} (${busId}) logged in`);

      connectedUsers.set(socket.id, {
        ...connectedUsers.get(socket.id),
        type: "driver",
        busId,
        driverName
      });

      socket.join(`route-${route}`);

      // Save to busLocations
      busLocations.set(busId, {
        busId,
        driverName,
        driverPhone: (await DriverProfile.findOne({ busNumber: busId }))?.phoneNumber || "N/A",
        location: initialLocation || { latitude: 28.7041, longitude: 77.1025 },
        active: true,
        timestamp: new Date(),
        driverSocket: socket.id,
        route,
        lastUpdate: new Date()
      });

      // Notify students
      io.to(`route-${route}`).emit("bus_location_update", {
        busId,
        driverName,
        driverPhone: busLocations.get(busId).driverPhone,
        latitude: initialLocation?.latitude || 28.7041,
        longitude: initialLocation?.longitude || 77.1025,
        route,
        timestamp: new Date().toISOString()
      });

      socket.emit("ride_started", { busId, status: "active", message: "Ride started successfully" });

    } catch (error) {
      console.error("Error in driver_login:", error);
      socket.emit("error", { message: "Failed to start ride" });
    }
  });

  // DRIVER LOCATION UPDATE
  socket.on("driver_location_update", async (data) => {
    try {
      const { busId, latitude, longitude, route = "R1" } = data;
      if (!busId || latitude === undefined || longitude === undefined) return;

      let busData = busLocations.get(busId);

      // If driver info missing, fetch from DB
      if (!busData) {
        const driver = await DriverProfile.findOne({ busNumber: busId });
        busData = {
          busId,
          driverName: driver?.name || "Unknown",
          driverPhone: driver?.phoneNumber || "N/A",
          route,
          active: true,
          driverSocket: socket.id
        };
      }

      busLocations.set(busId, {
        ...busData,
        location: { latitude, longitude },
        timestamp: new Date(),
        lastUpdate: new Date(),
        active: true
      });

      io.to(`route-${route}`).emit("bus_location_update", {
        busId,
        driverName: busData.driverName,
        driverPhone: busData.driverPhone,
        latitude,
        longitude,
        route,
        timestamp: new Date().toISOString()
      });

      console.log(`📍 Bus ${busId} | Driver: ${busData.driverName} | Location updated: ${latitude}, ${longitude}`);

    } catch (err) {
      console.error("Error in driver_location_update:", err);
    }
  });

  // STUDENT SUBSCRIBE
  socket.on("student_subscribe", (data) => {
    try {
      const { route = "R1", studentId } = data || {};
      if (!route) return socket.emit("error", { message: "Route is required" });

      connectedUsers.set(socket.id, {
        ...connectedUsers.get(socket.id),
        type: "student",
        studentId: studentId || socket.id,
        route
      });

      socket.join(`route-${route}`);
      console.log(`🎓 Student ${studentId || socket.id} subscribed to route: ${route}`);

      // Send current buses
      const activeBusesOnRoute = Array.from(busLocations.values())
        .filter(bus => bus.route === route && bus.active)
        .map(bus => ({
          busId: bus.busId,
          driverName: bus.driverName,
          driverPhone: bus.driverPhone || "N/A",
          location: bus.location,
          route: bus.route,
          lastUpdate: bus.lastUpdate
        }));

      socket.emit("initial_bus_locations", { activeBuses: activeBusesOnRoute, route });
      console.log(`📨 Sent ${activeBusesOnRoute.length} active buses to student`);

    } catch (error) {
      console.error("Error in student_subscribe:", error);
      socket.emit("error", { message: "Failed to subscribe to bus updates" });
    }
  });

  // DRIVER LOGOUT
  socket.on("driver_logout", (data) => {
    try {
      const { busId } = data || {};
      if (!busId) return socket.emit("error", { message: "Bus ID is required" });

      const busData = busLocations.get(busId);
      if (busData) {
        const { route } = busData;
        busLocations.delete(busId);
        io.to(`route-${route}`).emit("bus_removed", { busId });
        console.log(`🚫 Driver logged out: Bus ${busId} removed from route ${route}`);

        socket.emit("ride_ended", { busId, status: "inactive", message: "Ride ended successfully" });
      }
    } catch (error) {
      console.error("Error in driver_logout:", error);
      socket.emit("error", { message: "Failed to logout" });
    }
  });



  // DISCONNECT HANDLER
  socket.on("disconnect", (reason) => {
    console.log(`❌ Client disconnected: ${socket.id} - Reason: ${reason}`);
    const userData = connectedUsers.get(socket.id);

    if (userData?.type === "driver" && userData.busId) {
      const busId = userData.busId;
      const busData = busLocations.get(busId);
      if (busData) {
        const { route } = busData;
        busLocations.delete(busId);
        io.to(`route-${route}`).emit("bus_removed", { busId });
        console.log(`🚫 Bus ${busId} removed (driver disconnected)`);
      }
    }

    connectedUsers.delete(socket.id);
    console.log(`📊 Active connections: ${connectedUsers.size}, Active buses: ${busLocations.size}`);
  });
});



// --- API ROUTES ---
app.use("/api/authclient", AuthRouter)
app.use("/api/bus", router);

app.use("/api/student", StudentRide);
app.use('/api/driverprofile', Driverrouter)


app.use("/api/adminDriverProfile", ProfileDriver);

// Get all bus routes
app.get("/api/bus/routes", (req, res) => {
  try {
    res.json({
      success: true,
      routes: busRoutes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch routes"
    });
  }
});

// Get active buses
app.get("/api/bus/active", (req, res) => {
  try {
    const activeBuses = Array.from(busLocations.values())
      .filter(bus => bus.active)
      .map(bus => ({
        busId: bus.busId,
        driverName: bus.driverName,
        location: bus.location,
        route: bus.route,
        lastUpdate: bus.lastUpdate
      }));

    res.json({
      success: true,
      activeBuses,
      count: activeBuses.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching active buses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch active buses"
    });
  }
});

// Get server status
app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    timestamp: new Date().toISOString(),
    connections: connectedUsers.size,
    activeBuses: busLocations.size,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Bus Tracker API"
  });
});

// Default route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Bus Tracker Server Running...",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: [
      "/api/bus/routes",
      "/api/bus/active",
      "/api/status",
      "/health"
    ]
  });
});

// 404 handler


// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

// Start server
const startServer = async () => {
  try {
    await connectionDb();
    console.log("✅ Database connected successfully");

    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('🆘 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🆘 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

startServer();
