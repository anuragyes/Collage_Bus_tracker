
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
import { StudentRide } from "./routes/StudentRide.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "https://collage-bus-tracker-frontend.onrender.com",
    credentials: true,
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
io.on("connection", (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  // Add to connected users
  connectedUsers.set(socket.id, {
    id: socket.id,
    type: 'unknown',
    connectedAt: new Date()
  });

  // Driver login event
  socket.on("driver_login", (data) => {
    try {
      const { busId, driverName, initialLocation, route = "R1" } = data;

      if (!busId) {
        socket.emit("error", { message: "Bus ID is required" });
        return;
      }

      console.log(`🚗 Driver ${driverName} (${busId}) logged in`);

      // Update user type
      connectedUsers.set(socket.id, {
        ...connectedUsers.get(socket.id),
        type: 'driver',
        busId,
        driverName
      });

      // Join route room
      socket.join(`route-${route}`);

      // Store bus location
      busLocations.set(busId, {
        busId,
        driverName: driverName || "Unknown Driver",
        location: initialLocation || { latitude: 28.7041, longitude: 77.1025 },
        active: true,
        timestamp: new Date(),
        driverSocket: socket.id,
        route: route,
        lastUpdate: new Date()
      });

      // Notify students on this route
      io.to(`route-${route}`).emit("bus_location_update", {
        busId,
        driverName: driverName || "Unknown Driver",
        latitude: initialLocation?.latitude || 28.7041,
        longitude: initialLocation?.longitude || 77.1025,
        route,
        timestamp: new Date().toISOString()
      });

      socket.emit("ride_started", {
        busId,
        status: 'active',
        message: 'Ride started successfully'
      });

    } catch (error) {
      console.error("Error in driver_login:", error);
      socket.emit("error", { message: "Failed to start ride" });
    }
  });



  // Driver sends location updates
  socket.on("driver_location_update", (data) => {
    try {
      const { busId, latitude, longitude, route = "R1" } = data;

      if (!busId || latitude === undefined || longitude === undefined) {
        console.error("Invalid location data:", data);
        return;
      }

      // Update bus location
      const busData = busLocations.get(busId) || {
        busId,
        driverName: "Unknown Driver",
        route,
        active: true,
        driverSocket: socket.id
      };

      busLocations.set(busId, {
        ...busData,
        location: { latitude, longitude },
        timestamp: new Date(),
        lastUpdate: new Date(),
        active: true
      });

      // Broadcast to all students subscribed to this route
      io.to(`route-${route}`).emit("bus_location_update", {
        busId,
        driverName: busData.driverName,
        latitude,
        longitude,
        route,
        timestamp: new Date().toISOString()
      });

      console.log(`📍 Bus ${busId} location updated: ${latitude}, ${longitude}`);

    } catch (error) {
      console.error("Error in driver_location_update:", error);
    }
  });

  // Student subscribes to bus updates
  socket.on("student_subscribe", (data) => {
    try {
      const { route = "R1", studentId } = data || {};

      if (!route) {
        socket.emit("error", { message: "Route is required" });
        return;
      }

      // Update user type
      connectedUsers.set(socket.id, {
        ...connectedUsers.get(socket.id),
        type: 'student',
        studentId: studentId || socket.id,
        route
      });

      // Join the route room
      socket.join(`route-${route}`);
      console.log(`🎓 Student ${studentId || socket.id} subscribed to route: ${route}`);

      // Send current active buses for this route
      const activeBusesOnRoute = Array.from(busLocations.values())
        .filter(bus => bus.route === route && bus.active)
        .map(bus => ({
          busId: bus.busId,
          driverName: bus.driverName,
          location: bus.location,
          route: bus.route,
          lastUpdate: bus.lastUpdate
        }));

      socket.emit("initial_bus_locations", {
        activeBuses: activeBusesOnRoute,
        route
      });

      console.log(`📨 Sent ${activeBusesOnRoute.length} active buses to student`);

    } catch (error) {
      console.error("Error in student_subscribe:", error);
      socket.emit("error", { message: "Failed to subscribe to bus updates" });
    }
  });

  // Driver logout
  socket.on("driver_logout", (data) => {
    try {
      const { busId } = data || {};

      if (!busId) {
        socket.emit("error", { message: "Bus ID is required" });
        return;
      }

      const busData = busLocations.get(busId);
      if (busData) {
        const { route } = busData;

        // Remove bus from tracking
        busLocations.delete(busId);

        // Notify students on the route
        io.to(`route-${route}`).emit("bus_removed", { busId });

        console.log(`🚫 Driver logged out: Bus ${busId} removed from route ${route}`);

        socket.emit("ride_ended", {
          busId,
          status: 'inactive',
          message: 'Ride ended successfully'
        });
      }

    } catch (error) {
      console.error("Error in driver_logout:", error);
      socket.emit("error", { message: "Failed to logout" });
    }
  });

  // Bus nearby alert (for notifications)
  socket.on("bus_nearby_alert", (data) => {
    try {
      const { busId, studentId, distance, studentLocation } = data;

      if (busId && studentId) {
        // Notify the specific student
        socket.emit("bus_nearby", {
          busId,
          distance,
          message: `Bus ${busId} is ${(distance / 1000).toFixed(1)}km away! Be ready.`,
          timestamp: new Date().toISOString()
        });

        console.log(`🔔 Bus ${busId} is ${distance}m from student ${studentId}`);
      }
    } catch (error) {
      console.error("Error in bus_nearby_alert:", error);
    }
  });

  // Get current bus status
  socket.on("get_bus_status", (data) => {
    try {
      const { busId } = data || {};

      if (busId) {
        const busData = busLocations.get(busId);
        socket.emit("bus_status", {
          busId,
          exists: !!busData,
          data: busData || null
        });
      }
    } catch (error) {
      console.error("Error in get_bus_status:", error);
    }
  });

  // Heartbeat/ping
  socket.on("ping", () => {
    socket.emit("pong", { timestamp: new Date().toISOString() });
  });

  // Error handling
  socket.on("error", (error) => {
    console.error(`Socket error from ${socket.id}:`, error);
  });

  // Disconnect handler
  socket.on("disconnect", (reason) => {
    console.log(`❌ Client disconnected: ${socket.id} - Reason: ${reason}`);

    const userData = connectedUsers.get(socket.id);

    // Clean up bus locations if a driver disconnects
    if (userData && userData.type === 'driver' && userData.busId) {
      const busId = userData.busId;
      const busData = busLocations.get(busId);

      if (busData) {
        const { route } = busData;
        busLocations.delete(busId);
        io.to(`route-${route}`).emit("bus_removed", { busId });
        console.log(`🚫 Bus ${busId} removed (driver disconnected)`);
      }
    }

    // Remove from connected users
    connectedUsers.delete(socket.id);

    console.log(`📊 Active connections: ${connectedUsers.size}, Active buses: ${busLocations.size}`);
  });
});



// --- API ROUTES ---

app.use("/api/bus", router);
app.use("/api/student", StudentRouter);
app.use("/api/driver", DriverRouter);
app.use("/api/driverprofile", ProfileDriver);
app.use("/api/student/ride", StudentRide);

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
