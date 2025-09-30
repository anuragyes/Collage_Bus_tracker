

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const BASE_URL = "http://localhost:5000"; // use production URL
  const [currentuser, setCurrentuser] = useState(null);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [driverLocations, setDriverLocations] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true); // useful for initial load

  const isLoggedInStudent = !!currentuser;
  const isLoggedInDriver = !!currentDriver;

  // ---------------- SOCKET ----------------
  useEffect(() => {
    const newSocket = io(BASE_URL, { withCredentials: true });
    setSocket(newSocket);

    newSocket.on("update-location", (data) => {
      setDriverLocations((prev) => {
        //  console.log("this is context" , setDriverLocations)
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

  // ---------------- SESSION RESTORE ----------------
  useEffect(() => {
    const restoreUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/authclient/me`, { withCredentials: true });
        setCurrentuser(res.data.clientData); // backend should return clientData
      } catch (err) {
        setCurrentuser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreUser();
  }, []);

  // ---------------- STUDENT AUTH ----------------
  const AuthSignup = async (formData) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/authclient/signup`, formData, {
        withCredentials: true,
      });
      setCurrentuser(res.data.client || res.data);
      return res.data;
    } catch (error) {
      console.error("Student signup error:", error.response?.data || error.message);
      throw error;
    }
  };

  const AuthLogin = async (formData) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/authclient/login`, formData, {
        withCredentials: true,
      });
      setCurrentuser(res.data.client || res.data);

       console.log("thisnis res data by user " , res);
      return res.data;
    } catch (error) {
      console.error("Student login error:", error.response?.data || error.message);
      throw error;
    }
  };

  const AuthLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/authclient/logout`, {}, { withCredentials: true });
      setCurrentuser(null);
    } catch (error) {
      console.error("Student logout error:", error.response?.data || error.message);
    }
  };

  // ---------------- DRIVER AUTH ----------------
  const driverSignup = async (formData) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/driver/signup`, formData, { withCredentials: true });
      setCurrentDriver(res.data.user || res.data);
      return res.data;
    } catch (error) {
      console.error("Driver signup error:", error.response?.data || error.message);
      throw error;
    }
  };

  const driverLogin = async (formData) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/driver/login`, formData, { withCredentials: true });
      setCurrentDriver(res.data.user || res.data);
      return res.data;
    } catch (error) {
      console.error("Driver login error:", error.response?.data || error.message);
      throw error;
    }
  };

  const driverLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/driver/logout`, {}, { withCredentials: true });
      setCurrentDriver(null);
    } catch (error) {
      console.error("Driver logout error:", error.response?.data || error.message);
    }
  };

  // ---------------- SOCKET FUNCTIONS ----------------
  const sendDriverLocation = (lat, lng) => {
    if (socket && currentDriver) {
      // console.log("current driver" , currentDriver)
      socket.emit("driver-location", {
        driverId: currentDriver._id,
        lat,
        lng,
      });
    }
  };

  const getDriverLocations = () => driverLocations;

  return React.createElement(
    AuthContext.Provider,
    {
      value:{
        currentuser,
        isLoggedInStudent,
        AuthSignup,
        AuthLogin,
        AuthLogout,
        currentDriver,
        isLoggedInDriver,
        driverSignup,
        driverLogin,
        driverLogout,
        sendDriverLocation,
        getDriverLocations,
        driverLocations,
        loading,
      }
    },

    children

  );
};
