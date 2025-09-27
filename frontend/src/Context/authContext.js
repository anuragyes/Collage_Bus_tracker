
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const BASE_URL = "http://localhost:5000";
  const [currentStudent, setCurrentStudent] = useState(null);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [driverLocations, setDriverLocations] = useState([]); // For students
  const [socket, setSocket] = useState(null);

  const isLoggedInStudent = !!currentStudent;
  const isLoggedInDriver = !!currentDriver;

  // Initialize socket connection once
  useEffect(() => {
    const newSocket = io(BASE_URL, { withCredentials: true });
    setSocket(newSocket);

    // Listen to all driver location updates (for students)
    newSocket.on("update-location", (data) => {
      setDriverLocations((prev) => {
        // Update or add driver location
        const exists = prev.find((d) => d.driverId === data.driverId);
        if (exists) {
          return prev.map((d) => (d.driverId === data.driverId ? data : d));
        } else {
          return [...prev, data];
        }
      });
    });

    return () => newSocket.disconnect();
  }, []);

  // ---------------- STUDENT AUTH ----------------
  const studentSignup = async (formData) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/student/signup`, formData, {
        withCredentials: true,
      });
      setCurrentStudent(res.data.user || res.data);
      return res.data;
    } catch (error) {
      console.error("Student signup error:", error.response?.data || error.message);
      throw error;
    }
  };

  const studentLogin = async (formData) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/student/login`, formData, {
        withCredentials: true,
      });
      setCurrentStudent(res.data.user || res.data);
      return res.data;
    } catch (error) {
      console.error("Student login error:", error.response?.data || error.message);
      throw error;
    }
  };

  const studentLogout = async () => {
    try {
      await axios.get(`${BASE_URL}/api/student/logout`, { withCredentials: true });
      setCurrentStudent(null);
    } catch (error) {
      console.error("Student logout error:", error.response?.data || error.message);
    }
  };

  // ---------------- DRIVER AUTH ----------------
  const driverSignup = async (formData) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/driver/signup`, formData, {
        withCredentials: true,
      });
      setCurrentDriver(res.data.user || res.data);
      return res.data;
    } catch (error) {
      console.error("Driver signup error:", error.response?.data || error.message);
      throw error;
    }
  };

  const driverLogin = async (formData) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/driver/login`, formData, {
        withCredentials: true,
      });
      setCurrentDriver(res.data.user || res.data);
      return res.data;
    } catch (error) {
      console.error("Driver login error:", error.response?.data || error.message);
      throw error;
    }
  };

  const driverLogout = async () => {
    try {
      await axios.get(`${BASE_URL}/api/driver/logout`, { withCredentials: true });
      setCurrentDriver(null);
    } catch (error) {
      console.error("Driver logout error:", error.response?.data || error.message);
    }
  };

  // ---------------- SOCKET FUNCTIONS ----------------
  // Send driver location
  const sendDriverLocation = (lat, lng) => {
    if (socket && currentDriver) {
      socket.emit("driver-location", {
        driverId: currentDriver._id,
        lat,
        lng,
      });
    }
  };

  // Get all driver locations (for students)
  const getDriverLocations = () => {
    return driverLocations;
  };

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        isLoggedInStudent,
        currentStudent,
        studentSignup,
        studentLogin,
        studentLogout,
        isLoggedInDriver,
        currentDriver,
        driverSignup,
        driverLogin,
        driverLogout,
        sendDriverLocation,  // For drivers
        getDriverLocations,  // For students
        driverLocations,     // reactive state if needed
      },
    },
    children
  );
};
