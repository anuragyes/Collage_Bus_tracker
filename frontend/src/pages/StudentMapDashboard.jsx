
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { User, Phone, BusFront, LogOut, Navigation } from "lucide-react";
import { io } from "socket.io-client";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { useNavigate, useLocation } from "react-router-dom";

const SOCKET_IO_URL = "http://localhost:5000";
const GOOGLE_MAPS_API_KEY = "AIzaSyCGHZtNx-x6Z0jOJdc2s1O5e0_xA84mX5k";

const mapContainerStyle = { width: "100%", height: "100%", borderRadius: "12px" };
const defaultCenter = { lat: 28.7041, lng: 77.1025 };
const busIcon = { url: "https://maps.google.com/mapfiles/ms/icons/bus.png", scaledSize: { width: 32, height: 32 } };
const userIcon = { url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", scaledSize: { width: 24, height: 24 } };

// InfoCard Component
const InfoCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-l-gray-300 hover:shadow-2xl transition-all">
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
    if (mapRef.current && userLocation)
      mapRef.current.panTo({ lat: userLocation.latitude, lng: userLocation.longitude });
  }, [userLocation]);

  if (loadError) return <div className="p-6 text-red-500">Error loading Google Maps.</div>;
  if (!isLoaded) return <div className="p-6 text-gray-500">Loading Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={15}
      center={userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : defaultCenter}
      onLoad={onMapLoad}
      options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: true, zoomControl: true }}
    >
      {userLocation && <Marker position={{ lat: userLocation.latitude, lng: userLocation.longitude }} icon={userIcon} title="You" />}
      {nearbyBuses.map(bus => bus.location && (
        <Marker
          key={bus.busId}
          position={{ lat: bus.location.latitude, lng: bus.location.longitude }}
          icon={busIcon}
          title={`Bus ${bus.busId}`}
          onClick={() => setSelectedBus(bus)}
        />
      ))}
      {selectedBus && selectedBus.location && (
        <InfoWindow
          position={{ lat: selectedBus.location.latitude, lng: selectedBus.location.longitude }}
          onCloseClick={() => setSelectedBus(null)}
        >
          <div className="p-2">
            <h3 className="font-bold text-lg">{selectedBus.busId}</h3>
            <p className="text-sm">
              Driver: {selectedBus.driverName || "Unknown"} ({selectedBus.driverPhone || "N/A"})
            </p>
            <p className="text-xs text-gray-600">
              Last update: {new Date(selectedBus.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

// Distance calculator
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const StudentMapDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const studentData = location.state?.studentData;

  const [user, setUser] = useState(studentData);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyBuses, setNearbyBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [audioAlert, setAudioAlert] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [lastStopTime, setLastStopTime] = useState(0);

  useEffect(() => { if (!studentData) navigate("/student-login"); }, [studentData, navigate]);

  // Socket setup
  useEffect(() => {
    const newSocket = io(SOCKET_IO_URL, { withCredentials: true });
    setSocket(newSocket);
    newSocket.on("connect", () => setIsConnected(true));
    newSocket.on("disconnect", () => setIsConnected(false));
    newSocket.on("initial_bus_locations", (data) => setNearbyBuses(data.activeBuses || []));
    newSocket.on("bus_location_update", (data) => {
      setNearbyBuses((prev) => {
        const idx = prev.findIndex(bus => bus.busId === data.busId);
        const updatedBus = {
          busId: data.busId,
          driverName: data.driverName,
          driverPhone: data.driverPhone,
          location: { latitude: data.latitude, longitude: data.longitude },
          timestamp: data.timestamp,
        };
        if (idx >= 0) { const copy = [...prev]; copy[idx] = updatedBus; return copy; }
        return [...prev, updatedBus];
      });
    });
    newSocket.on("bus_removed", ({ busId }) => {
      setNearbyBuses(prev => prev.filter(bus => bus.busId !== busId));
      if (selectedBus?.busId === busId) setSelectedBus(null);
    });
    return () => newSocket.disconnect();
  }, [selectedBus]);

  // Watch user location
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => toast.error("Unable to get your location."),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Emit student location
  useEffect(() => {
    if (socket && userLocation)
      socket.emit("student_subscribe", { studentId: user.email || "student123", location: userLocation });
  }, [socket, userLocation, user.email]);

  const getClosestBus = () => {
    if (!userLocation || nearbyBuses.length === 0) return null;
    return nearbyBuses.reduce((closest, bus) => {
      if (!bus.location) return closest;
      const distance = calculateDistance(userLocation.latitude, userLocation.longitude, bus.location.latitude, bus.location.longitude);
      return !closest || distance < closest.distance ? { bus, distance } : closest;
    }, null);
  };
  const closestBus = getClosestBus();

  // ✅ Fixed addNotification
  const addNotification = (message) => {
    const newNotif = { id: Date.now(), message, timestamp: new Date().toLocaleTimeString() };
    console.log("✅ Notification:", message);
    setNotifications((prev) => [ newNotif]);
  };

  const handleLogout = () => { socket?.disconnect(); navigate("/"); toast.success(`Logged out successfully ${user.name}`); };
  const clearNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  // 🚨 Check proximity every few seconds
  useEffect(() => {
    const checkProximity = () => {
      if (!closestBus || !userLocation) return;
      const now = Date.now();
      const twoMinPassed = now - lastStopTime >  60000; // 1 minutes  means 6000 miliSeconds

      if (closestBus.distance <= 2000 && twoMinPassed) {
        addNotification(`🚍 Bus ${closestBus.bus.driverName} (${closestBus.bus.driverPhone}) is within ${(closestBus.distance / 1000).toFixed(2)} km!`);

        if (!isAudioPlaying) {
          const audio = new Audio("/mixkit-happy-bells-notification-937.wav");
          audio.loop = true;
          audio.play().catch((err) => console.warn("Audio play blocked:", err));
          setAudioAlert(audio);
          setIsAudioPlaying(true);
        }
      }
    };

    const interval = setInterval(checkProximity, 5000);
    return () => clearInterval(interval);
  }, [closestBus, userLocation, isAudioPlaying]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}!</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <button onClick={() => {
              socket?.emit("student_subscribe", { studentId: user.email, location: userLocation });
              addNotification("Refreshing bus locations...");
            }} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <Navigation className="w-4 h-4 mr-2" />Refresh
            </button>
            <button onClick={handleLogout} className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
              <LogOut className="w-4 h-4 mr-2" />Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <InfoCard icon={User} title="Student Name" value={user.name} color="text-blue-600" />
          <InfoCard icon={Phone} title="Email" value={user.email} color="text-yellow-600" />
          <InfoCard icon={BusFront} title="Active Buses" value={nearbyBuses.length} color="text-indigo-600" />
        </div>

        {/* Map */}
        <div className="lg:col-span-2 h-[400px] sm:h-[500px]">
          <LiveMap userLocation={userLocation} nearbyBuses={nearbyBuses} selectedBus={selectedBus} setSelectedBus={setSelectedBus} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Closest bus */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
            <h3 className="font-semibold text-lg mb-3">Closest Bus</h3>
            {closestBus ? (
              <div className="space-y-2">
                <div className="flex justify-between"><span>Bus ID:</span><span className="font-semibold">{closestBus.bus.busId}</span></div>
                <div className="flex justify-between"><span>Driver:</span><span className="font-semibold">{closestBus.bus.driverName} ({closestBus.bus.driverPhone})</span></div>
                <div className="flex justify-between"><span>Distance:</span><span className="font-semibold text-blue-600">{(closestBus.distance / 1000).toFixed(2)} km</span></div>
              </div>
            ) : <p className="text-gray-500 text-center py-4">No buses nearby</p>}
          </div>

            {/* Nearby Buses List */}
<div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
  <h3 className="font-semibold text-lg mb-3">Nearby Buses</h3>
  {nearbyBuses.length > 0 ? (
    <div className="space-y-3 max-h-60 overflow-y-auto">
      {nearbyBuses.map((bus) => {
        if (!bus.location || !userLocation) return null;
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          bus.location.latitude,
          bus.location.longitude
        );
        return (
          <div
            key={bus.busId}
            className="p-3 rounded-lg border-l-4 bg-gray-50 border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer"
            onClick={() => setSelectedBus(bus)}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">Bus {bus.busId}</span>
              <span className="text-xs text-blue-600 font-semibold">
                {(distance / 1000).toFixed(2)} km
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Driver: {bus.driverName || "Unknown"}
            </p>
            <p className="text-xs text-gray-500">
              📞 {bus.driverPhone || "N/A"}
            </p>
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-gray-500 text-center py-4">No active buses nearby</p>
  )}
</div>


          {/* Notifications */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">Notifications</h3>
              {notifications.length > 0 && (
                <button onClick={() => setNotifications([])} className="text-sm text-blue-600 hover:text-blue-800">Clear All</button>
              )}
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <div key={notif.id} className="p-2 sm:p-3 rounded-lg border-l-4 bg-blue-50 border-blue-400">
                    <div className="flex justify-between items-start">
                      <p className="text-sm flex-1">{notif.message}</p>
                      <button onClick={() => clearNotification(notif.id)} className="text-gray-400 hover:text-gray-600 ml-2">×</button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{notif.timestamp}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No notifications</p>
              )}
            </div>

            {/* Stop alert button */}
            {isAudioPlaying && (
              <button
                onClick={() => {
                  if (audioAlert) {
                    audioAlert.pause();
                    audioAlert.currentTime = 0;
                  }
                  setIsAudioPlaying(false);
                  setAudioAlert(null);
                  setLastStopTime(Date.now());
                  addNotification("🚫 Alert stopped. Will auto-resume after 1 minutes.");
                }}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full"
              >
                Stop Alert
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMapDashboard;

