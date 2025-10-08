

import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, MapPin, BusFront, Phone, Power, Check, X, LogOut } from "lucide-react"; 
import { io } from "socket.io-client";
import { FaBus } from "react-icons/fa";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const SOCKET_IO_URL = "http://localhost:5000";
const GOOGLE_MAPS_API_KEY = "AIzaSyCGHZtNx-x6Z0jOJdc2s1O5e0_xA84mX5k";

const InfoCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-l-gray-300 transition-all duration-300 hover:shadow-2xl">
    <div className="flex items-center space-x-3">
      <Icon className={`w-6 h-6 ${color}`} />
      <div>
        <p className="text-xs font-semibold uppercase text-gray-500">{title}</p>
        <p className="text-lg font-bold text-gray-800 break-words">{value}</p>
      </div>
    </div>
  </div>
);

const DrivingStatusDisplay = ({ isDriving, onToggleStatus, loading }) => (
  <div className="bg-white p-5 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between border-l-4 border-l-blue-600">
    <div className="flex items-center space-x-3 mb-4 md:mb-0">
      {isDriving ? (
        <Check className="w-8 h-8 text-green-600 bg-green-50 p-1 rounded-full" />
      ) : (
        <X className="w-8 h-8 text-red-500 bg-red-50 p-1 rounded-full" />
      )}
      <div>
        <p className="text-xl font-bold text-gray-800">Operational Status</p>
        <span className={`text-sm font-semibold ${isDriving ? 'text-green-600' : 'text-red-600'}`}>
          {isDriving ? "ON DUTY (LIVE TRACKING ACTIVE)" : "OFF DUTY"}
        </span>
      </div>
    </div>

    <button
      onClick={onToggleStatus}
      disabled={loading}
      className={`flex items-center justify-center px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 w-full md:w-auto ${loading ? 'bg-gray-400 cursor-not-allowed' : isDriving
          ? 'bg-red-600 hover:bg-red-700'
          : 'bg-green-600 hover:bg-green-700'
        }`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : isDriving ? (
        <>
          <Power className="w-5 h-5 mr-2" />
          End Ride / Go Offline
        </>
      ) : (
        <>
          <Power className="w-5 h-5 mr-2" />
          Start Ride
        </>
      )}
    </button>
  </div>
);

const LiveMap = ({ busId, isDriving, currentLocation, setCurrentLocation, socket }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const watchId = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const mapContainerStyle = { width: "100%", height: "50vh", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" };
  const defaultCenter = { lat: 28.7041, lng: 77.1025 };

  const driverBusIcon = { url: <FaBus />, scaledSize: { width: 48, height: 48 } };

  useEffect(() => {
    if (!socket) return;

    if (isDriving && navigator.geolocation) {
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { latitude, longitude, timestamp: new Date().toISOString() };
          setCurrentLocation(newLocation);

          socket.emit("driver_location_update", { busId, latitude, longitude, timestamp: newLocation.timestamp });

          if (markerRef.current) markerRef.current.setPosition({ lat: latitude, lng: longitude });
          if (mapRef.current) mapRef.current.panTo({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Geolocation access denied or failed.");
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    } else if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }

    return () => { if (watchId.current) navigator.geolocation.clearWatch(watchId.current); };
  }, [isDriving, busId, setCurrentLocation, socket]);

  const onMapLoad = (map) => { mapRef.current = map; };

  if (loadError) return <div className="text-red-500 p-4">Error loading maps.</div>;
  if (!isLoaded) return <div className="flex items-center justify-center h-64">Loading maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={15}
      center={currentLocation ? { lat: currentLocation.latitude, lng: currentLocation.longitude } : defaultCenter}
      onLoad={onMapLoad}
      options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: true, zoomControl: true }}
    >
      {currentLocation && isDriving && <Marker position={{ lat: currentLocation.latitude, lng: currentLocation.longitude }} icon={driverBusIcon} title={`Your Bus: ${busId}`} ref={markerRef} />}
    </GoogleMap>
  );
};

const Bus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(location.state?.user || { name: "Driver", busNumber: "BUS-001", phoneNumber: "N/A", isDriving: false });
  const [statusLoading, setStatusLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [socket, setSocket] = useState(null);

  // Redirect if no user
  useEffect(() => { if (!location.state?.user) navigate("/", { replace: true }); }, [location, navigate]);

  // Initialize socket
  useEffect(() => {
    if (!user) return;

    const newSocket = io(SOCKET_IO_URL, { withCredentials: true });
    setSocket(newSocket);

    newSocket.emit("driver_login", { busId: user.busNumber, driverName: user.name, initialLocation: { latitude: 28.7041, longitude: 77.1025 } });
    console.log("this is drive name 147" , user.name)
    newSocket.on("ride_started", (data) => { if (data.busId === user.busNumber) toast.success(` ${user.name} started Drive!`); });   //*******addddeddd */
    newSocket.on("ride_ended", (data) => { if (data.busId === user.busNumber);});

    return () => { newSocket.disconnect(); };    //  chnage Ride end 
  }, [user]);

  const handleToggleStatus = () => {
    setStatusLoading(true);
    if (user.isDriving) {
     
      setUser(prev => ({ ...prev, isDriving: false }));
      socket?.emit("driver_logout", { busId: user.busNumber });
      toast.success("Ride ended. Off Duty.");
      setStatusLoading(false);
    } else {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentLocation({ latitude, longitude });
        setUser(prev => ({ ...prev, isDriving: true }));
        socket?.emit("driver_login", { busId: user.busNumber, driverName: user.name, 
          initialLocation: { latitude, longitude } });
            console.log("this is driver name " , user.name)
        toast.success("Ride started!");
        setStatusLoading(false);
      }, () => { toast.error("Unable to get location."); setStatusLoading(false); });
    }
  };

    const handleLogout = async () => {
    try {
        if (user?.isDriving) {
            socket.emit("driver_logout", { busId: user.busNumber });
        }

          console.log("this is user" , user);

        // Call backend to update DB
        await fetch("https://collage-bus-tracker-backend.onrender.com/api/driverprofile/driver/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ busNumber: user.busNumber })
        });

        socket.disconnect();
        toast.success("Logged out successfully!");
        navigate("/");
    } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Failed to logout. Try again.");
    }
};

  if (!location.state?.user) return null;

    return (
        <div className="min-h-screen bg-gray-100 font-sans p-4">
          
            <div className="w-full max-w-6xl mx-auto bg-gray-50 shadow-2xl rounded-2xl p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900 border-b pb-2 w-full md:w-auto">
                        {user.name}'s Driver Dashboard
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Log Out
                    </button>
                </div>

        <DrivingStatusDisplay isDriving={user.isDriving} onToggleStatus={handleToggleStatus} loading={statusLoading} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <InfoCard icon={User} title="Driver Name" value={user.name} color="text-blue-600" />
          <InfoCard icon={BusFront} title="Bus Number" value={user.busNumber} color="text-indigo-600" />
          <InfoCard icon={Phone} title="Phone" value={user.phoneNumber} color="text-yellow-600" />
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold flex items-center mb-2"><MapPin className="mr-2 w-6 h-6 text-green-600"/>Live Location</h2>
          <LiveMap busId={user.busNumber} isDriving={user.isDriving} currentLocation={currentLocation} setCurrentLocation={setCurrentLocation} socket={socket} />
        </div>
      </div>
    </div>
  );
};

export default Bus;
