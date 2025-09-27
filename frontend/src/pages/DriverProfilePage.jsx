// import React, { useState, useEffect, useContext } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { AuthContext } from "../Context/authContext";

// // Leaflet icon fix
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// });

// const DriverProfilePage = () => {
//   const { currentDriver, sendDriverLocation } = useContext(AuthContext);

//   const [busNumber, setBusNumber] = useState("");
//   const [phone, setPhone] = useState("");
//   const [location, setLocation] = useState({ lat: 12.9716, lng: 77.5946 });
//   const [isRiding, setIsRiding] = useState(false);

//   // Load driver info
//   useEffect(() => {
//     if (currentDriver) {
//       setBusNumber(currentDriver.busNumber || "");
//       setPhone(currentDriver.phone || "");
//     }
//   }, [currentDriver]);

//   // Live location tracking
//   useEffect(() => {
//     let watchId;

//     if (isRiding && navigator.geolocation) {
//       watchId = navigator.geolocation.watchPosition(
//         (pos) => {
//           const newLoc = {
//             lat: pos.coords.latitude,
//             lng: pos.coords.longitude,
//           };
//           setLocation(newLoc); // Update map for driver

//           // Send location to backend via socket
//           if (sendDriverLocation) {
//             sendDriverLocation(newLoc.lat, newLoc.lng);
//           }
//         },
//         (err) => console.error("Geolocation error:", err),
//         { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
//       );
//     }

//     return () => {
//       if (watchId) navigator.geolocation.clearWatch(watchId);
//     };
//   }, [isRiding, sendDriverLocation]);

//   const handleStartRide = (e) => {
//     e.preventDefault();
//     setIsRiding(true);
//     console.log("🚍 Ride Started:", { busNumber, phone });
//   };

//   return React.createElement(
//     "div",
//     { className: "min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6" },

//     // Form
//     React.createElement(
//       "div",
//       { className: "bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg text-center" },
//       React.createElement("h1", { className: "text-3xl font-bold mb-6" }, "Driver Profile 🚍"),
//       React.createElement(
//         "form",
//         { onSubmit: handleStartRide, className: "space-y-5" },
//         React.createElement("input", {
//           type: "text",
//           placeholder: "Enter Bus Number",
//           value: busNumber,
//           onChange: (e) => setBusNumber(e.target.value),
//           className: "w-full p-3 border rounded-lg",
//           required: true,
//         }),
//         React.createElement("input", {
//           type: "text",
//           placeholder: "Enter Phone Number",
//           value: phone,
//           onChange: (e) => setPhone(e.target.value),
//           className: "w-full p-3 border rounded-lg",
//           required: true,
//         }),
//         React.createElement(
//           "button",
//           {
//             type: "submit",
//             className: "w-full bg-yellow-500 text-white py-3 rounded-lg",
//           },
//           isRiding ? "Riding Live..." : "Start Ride"
//         )
//       )
//     ),

//     // Map showing driver location
//     React.createElement(
//       "div",
//       { className: "mt-8 w-full max-w-4xl h-[400px] rounded-xl overflow-hidden shadow-lg border" },
//       React.createElement(
//         MapContainer,
//         { center: [location.lat, location.lng], zoom: 15, style: { height: "100%", width: "100%" } },
//         React.createElement(TileLayer, {
//           url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//           attribution: "&copy; OpenStreetMap contributors",
//         }),
//         React.createElement(
//           Marker,
//           { position: [location.lat, location.lng] },
//           React.createElement(
//             Popup,
//             null,
//             `🚍 Bus ${busNumber || "Unknown"} \n📞 ${phone || "N/A"} \n📍 You are here`
//           )
//         )
//       )
//     )
//   );
// };

// export default DriverProfilePage;


import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Context/authContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const DriverProfilePage = () => {
  const { currentDriver } = useContext(AuthContext);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const BASE_URL = "http://localhost:5000";

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