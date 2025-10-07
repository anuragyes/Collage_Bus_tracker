
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { User, MapPin, BusFront, Phone, LogOut, Navigation, ClockFading } from "lucide-react";
import { io } from "socket.io-client";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { useNavigate, useLocation } from "react-router-dom";

const SOCKET_IO_URL = "https://collage-bus-tracker-backend.onrender.com";
const GOOGLE_MAPS_API_KEY = "AIzaSyCGHZtNx-x6Z0jOJdc2s1O5e0_xA84mX5k";
const socket = io(SOCKET_IO_URL, { withCredentials: true });

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
};

const defaultCenter = { lat: 28.7041, lng: 77.1025 };
const busIcon = { url: "https://maps.google.com/mapfiles/ms/icons/bus.png", scaledSize: { width: 32, height: 32 } };
const userIcon = { url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", scaledSize: { width: 24, height: 24 } };

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

const LiveMap = ({ userLocation, nearbyBuses, selectedBus, setSelectedBus }) => {
  const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });
  const mapRef = useRef(null);
  const onMapLoad = (map) => { mapRef.current = map; };

  
  useEffect(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.panTo({ lat: userLocation.latitude, lng: userLocation.longitude });
    }
  }, [userLocation]);

  if (loadError) return <div className="bg-white p-6 rounded-2xl shadow-xl text-center text-red-500 py-8">Error loading Google Maps.</div>;
  if (!isLoaded) return (
    <div className="bg-white p-6 rounded-2xl shadow-xl text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading maps...</p>
    </div>
  );

  return (
    <div className="bg-white p-2 sm:p-4 rounded-2xl shadow-xl h-full">
      <div className="flex items-center space-x-2 mb-4">
        <MapPin className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-bold text-gray-800">Live Bus Tracking</h2>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : defaultCenter}
        onLoad={onMapLoad}
        options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: true, zoomControl: true }}
      >
        {userLocation && <Marker position={{ lat: userLocation.latitude, lng: userLocation.longitude }} icon={userIcon} title="Your Location" />}
        {nearbyBuses.map(bus => bus.location && (
          <Marker
            key={bus.busId}
            position={{ lat: bus.location.latitude, lng: bus.location.longitude }}
            icon={busIcon}
            onClick={() => setSelectedBus(bus)}
            title={`Bus ${bus.busId}`}
          />
        ))}
        {selectedBus && selectedBus.location && (
          <InfoWindow
            position={{ lat: selectedBus.location.latitude, lng: selectedBus.location.longitude }}
            onCloseClick={() => setSelectedBus(null)}
          >
            <div className="p-2">
              <h3 className="font-bold text-lg">{selectedBus.busId}</h3>
              <p className="text-sm">Driver: {selectedBus.driverName || "Unknown"} ({selectedBus.driverPhone || "N/A"})</p>
              <p className="text-sm text-gray-600">Last update: {new Date(selectedBus.timestamp).toLocaleTimeString()}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

const StudentMapDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const studentData = location.state?.studentData;
      // console.log("studentdata" , studentData)

  const [user, setUser] = useState(studentData);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyBuses, setNearbyBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);




  useEffect(() => { if (!studentData) navigate('/student-login'); }, [studentData, navigate]);

  useEffect(() => {
    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => setUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
        (error) => { console.error(error); toast.error("Unable to get your location."); },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000, distanceFilter: 10 }
      );
    }
    return () => { if (watchId) navigator.geolocation.clearWatch(watchId); };
  }, []);

  useEffect(() => {
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    socket.emit("student_subscribe", { studentId: user.email || "student123", location: userLocation });

    socket.on("initial_bus_locations", (data) => {
      setNearbyBuses(data.activeBuses || []);
    });
  
    socket.on("bus_location_update", (data) => {
      setNearbyBuses(prev => {
         
        const idx = prev.findIndex(bus => bus.busId === data.busId);
        const busData = {
          busId: data.busId,
          driverName: data.driverName || "",
          driverPhone: data.driverPhone || "N/A",
          location: { latitude: data.latitude, longitude: data.longitude },
          timestamp: data.timestamp
        };
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = busData;
          return updated;
        } else {
          return [...prev, busData];
        }
      });
    });

    socket.on("bus_removed", ({ busId }) => {
      setNearbyBuses(prev => prev.filter(bus => bus.busId !== busId));
      if (selectedBus?.busId === busId) setSelectedBus(null);
    });

    return () => socket.off();
  }, [user.email, userLocation, selectedBus]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2-lat1)*Math.PI/180;
    const Δλ = (lon2-lon1)*Math.PI/180;
    const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };


    // console.log("tis is neaby bus" , nearbyBuses)
  const getClosestBus = () => {
    if (!userLocation || nearbyBuses.length === 0) return null;
    return nearbyBuses.reduce((closest, bus) => {
      if (!bus.location) return closest;
      const distance = calculateDistance(userLocation.latitude, userLocation.longitude, bus.location.latitude, bus.location.longitude);
      return !closest || distance < closest.distance ? { bus, distance } : closest;
    }, null);
      
  };



  const closestBus = getClosestBus();
  // console.log("this is closestbu" , closestBus)
  const handleLogout = () => { socket.disconnect(); navigate('/'); toast.success("Logged out successfully!"); };
  const clearNotification = (id) => setNotifications(prev => prev.filter(notif => notif.id !== id));
  const refreshBuses = () => { socket.emit("student_subscribe", { studentId: user.email || "student123", location: userLocation }); toast.success("Refreshing bus locations..."); };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}!</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className={`px-3 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <button onClick={refreshBuses} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <Navigation className="w-4 h-4 mr-2" />Refresh
            </button>
            <button onClick={handleLogout} className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
              <LogOut className="w-4 h-4 mr-2" />Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Info Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <InfoCard icon={User} title="Student Name" value={user.name} color="text-blue-600" />
          <InfoCard icon={Phone} title="Email" value={user.email} color="text-yellow-600" />
          <InfoCard icon={BusFront} title="Active Buses" value={nearbyBuses.length} color="text-indigo-600" />
        </div>

        {/* Main Map */}
        <div className="lg:col-span-2 h-[300px] sm:h-[400px] md:h-[500px]">
          <LiveMap userLocation={userLocation} nearbyBuses={nearbyBuses} selectedBus={selectedBus} setSelectedBus={setSelectedBus} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Closest Bus */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
            <h3 className="font-semibold text-lg mb-3">Closest Bus</h3>
            {closestBus ? (
              <div className="space-y-2">
                <div className="flex justify-between"><span>Bus ID:</span><span className="font-semibold">{closestBus.bus.busId}</span></div>
                <div className="flex justify-between"><span>Driver:</span><span className="font-semibold">{closestBus.bus.driverName} ({closestBus.bus.driverPhone})</span></div>
                <div className="flex justify-between"><span>Distance:</span><span className="font-semibold text-blue-600">{(closestBus.distance / 1000).toFixed(2)} km</span></div>
                <div className="flex justify-between"><span>ETA:</span><span className="font-semibold">{Math.round((closestBus.distance / 1000) * 3)} min</span></div>
              </div>
            ) : <p className="text-gray-500 text-center py-4">No buses nearby</p>}
          </div>

          {/* Active Buses */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
            <h3 className="font-semibold text-lg mb-3">Active Buses ({nearbyBuses.filter(bus => bus.location).length})</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {nearbyBuses.filter(bus => bus.location).map(bus => (
                <div key={bus.busId} className="flex justify-between items-center p-2 sm:p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-100" onClick={() => setSelectedBus(bus)}>
                  <div>
                    <span className="font-medium block">{bus.busId}</span>
                    <span className="text-sm text-gray-500">{bus.driverName || "Driver"} ({bus.driverPhone || "N/A"})</span>
                  </div>
                  <span className="text-sm text-green-600 font-semibold">Live</span>
                </div>
              ))}
              {nearbyBuses.filter(bus => bus.location).length === 0 && <p className="text-gray-500 text-center py-4">No active buses in your area</p>}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">Notifications</h3>
              {notifications.length > 0 && <button onClick={() => setNotifications([])} className="text-sm text-blue-600 hover:text-blue-800">Clear All</button>}
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {notifications.length > 0 ? notifications.map(notif => (
                <div key={notif.id} className="p-2 sm:p-3 rounded-lg border-l-4 bg-blue-50 border-blue-400">
                  <div className="flex justify-between items-start">
                    <p className="text-sm flex-1">{notif.message}</p>
                    <button onClick={() => clearNotification(notif.id)} className="text-gray-400 hover:text-gray-600 ml-2">×</button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{notif.timestamp}</p>
                </div>
              )) : <p className="text-gray-500 text-center py-4">No notifications</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMapDashboard;
