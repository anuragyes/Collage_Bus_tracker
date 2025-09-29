


import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Context/authContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const DriverProfilePage = () => {
  const { currentDriver } = useContext(AuthContext);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const BASE_URL = "https://collage-bus-tracker-backend.onrender.com";

  // Check if a driver is logged in; if not, redirect.
  if (!currentDriver) {
    return <p>You must be a driver to access this page.</p>;
  }

  const startTracking = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    const watch = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await axios.post(`${BASE_URL}/api/driver/update-location`, {
            latitude,
            longitude
          }, { withCredentials: true });
          setIsTracking(true);
        } catch (error) {
          toast.error("Failed to update location.");
          console.error("Location update error:", error);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Error getting your location. Please check your settings.");
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    setWatchId(watch);
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setIsTracking(false);
      setWatchId(null);
      // Optional: Send a request to the server to stop the ride
      // axios.post(`${BASE_URL}/api/driver/stop-tracking`, {}, { withCredentials: true });
    }
  };

  useEffect(() => {
    // Start tracking automatically if the user is a driver
    if (currentDriver) {
      startTracking();
    }
    // Clean up the watcher when the component unmounts
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [currentDriver]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Live Bus Tracker</h1>
      {isTracking ? (
        <>
          <p className="text-green-600 font-semibold">Live tracking is active!</p>
          <button onClick={stopTracking} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
            Stop Tracking
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-600">Tracking is currently inactive.</p>
          <button onClick={startTracking} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
            Start Tracking
          </button>
        </>
      )}
    </div>
  );
};

export default DriverProfilePage;
