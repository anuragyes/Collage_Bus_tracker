
import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { User, Phone, BusFront, LogOut, Navigation } from "lucide-react";
import { io } from "socket.io-client";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { useNavigate, useLocation } from "react-router-dom";

const SOCKET_IO_URL = "https://collage-bus-tracker-backend.onrender.com ";
const GOOGLE_MAPS_API_KEY = "AIzaSyCGHZtNx-x6Z0jOJdc2s1O5e0_xA84mX5k";

const mapContainerStyle = { width: "100%", height: "100%", borderRadius: "12px" };
const defaultCenter = { lat: 28.7041, lng: 77.1025 };
const busIcon = { url: "https://maps.google.com/mapfiles/ms/icons/bus.png", scaledSize: { width: 32, height: 32 } };
const userIcon = { url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", scaledSize: { width: 24, height: 24 } };

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

// distance in meters
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const PROXIMITY_THRESHOLD_METERS = 2000; // adjust as you like
const CHECK_INTERVAL_MS = 3000;

const StudentMapDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const studentData = location.state?.studentData;

  const [user, setUser] = useState(studentData || { name: "Student", email: "student@example.com" });
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyBuses, setNearbyBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [lastStopTime, setLastStopTime] = useState(0);

  // refs to avoid stale closures in event handlers
  const socketRef = useRef(null);
  const audioRef = useRef(null);
  const userLocationRef = useRef(userLocation);
  const nearbyBusesRef = useRef(nearbyBuses);
  const selectedBusRef = useRef(selectedBus);

  // keep refs in sync
  useEffect(() => { userLocationRef.current = userLocation; }, [userLocation]);
  useEffect(() => { nearbyBusesRef.current = nearbyBuses; }, [nearbyBuses]);
  useEffect(() => { selectedBusRef.current = selectedBus; }, [selectedBus]);

  useEffect(() => { if (!studentData) navigate("/student-login"); }, [studentData, navigate]);

  const addNotification = (message) => {
    const newNotif = { id: Date.now(), message, timestamp: new Date().toLocaleTimeString() };
    setNotifications((prev) => [newNotif, ...prev]);
    console.log("Notification:", message);
  };

  // ---------- SOCKET SETUP ----------
  useEffect(() => {
    const sock = io(SOCKET_IO_URL, { withCredentials: true });
    socketRef.current = sock;

    sock.on("connect", () => {
      setIsConnected(true);
      console.log("socket connected");
    });

    sock.on("disconnect", () => {
      setIsConnected(false);
      console.log("socket disconnected");
    });

    sock.on("initial_bus_locations", (data) => {
      setNearbyBuses(data.activeBuses || []);
    });

    sock.on("bus_location_update", (data) => {
      setNearbyBuses(prev => {
        const idx = prev.findIndex(b => b.busId === data.busId);
        const updated = {
          busId: data.busId,
          driverName: data.driverName,
          driverPhone: data.driverPhone,
          location: { latitude: data.latitude, longitude: data.longitude },
          timestamp: data.timestamp,
        };
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = updated;
          return copy;
        }
        return [...prev, updated];
      });
    });

    // driver logs out or bus removed
    sock.on("bus_removed", ({ busId }) => {
      setNearbyBuses(prev => prev.filter(bus => bus.busId !== busId));

      // if the removed bus was the currently selected/alerting bus -> stop audio
      if (selectedBusRef.current?.busId === busId) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current = null;
        }
        setIsAudioPlaying(false);
        setSelectedBus(null);
        setLastStopTime(Date.now());
        addNotification(`🚌 Bus ${busId} went offline. Alerts stopped.`);
      } else {
        addNotification(`🚌 Bus ${busId} went offline.`);
      }
    });

    return () => {
      sock.disconnect();
      socketRef.current = null;
    };
    // run once
  }, []);

  // ---------- GEOLOCATION ----------
  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by this browser.");
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setUserLocation(loc);
      },
      (err) => {
        console.error("geo error", err);
        toast.error("Unable to get your location.");
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // emit student location to server when changed
  useEffect(() => {
    if (socketRef.current && userLocation) {
      socketRef.current.emit("student_subscribe", { studentId: user.email || "student123", location: userLocation });
    }
  }, [userLocation, user.email]);

  // ---------- PROXIMITY CHECKER ----------
  useEffect(() => {
    const checkFn = () => {
      const uLoc = userLocationRef.current;
      const buses = nearbyBusesRef.current;

      // stop if no data
      if (!uLoc || !buses || buses.length === 0) {
        // if audio playing, stop it
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current = null;
          setIsAudioPlaying(false);
          setSelectedBus(null);
          addNotification("🛑 No active buses — alert stopped.");
        }
        return;
      }

      // find closest bus with location
      let closest = null;
      let minDist = Infinity;
      for (const b of buses) {
        if (!b.location) continue;
        const d = calculateDistance(uLoc.latitude, uLoc.longitude, b.location.latitude, b.location.longitude);
        if (d < minDist) { minDist = d; closest = b; }
      }

      // if none
      if (!closest) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current = null;
          setIsAudioPlaying(false);
          setSelectedBus(null);
        }
        return;
      }

      // If closest bus within threshold -> ensure audio playing
      if (minDist <= PROXIMITY_THRESHOLD_METERS) {
        // if not already playing or playing for another bus, start
        if (!isAudioPlaying || selectedBusRef.current?.busId !== closest.busId) {
          // stop any previous audio first
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
          }
          // start new audio
          const audio = new Audio("/mixkit-happy-bells-notification-937.wav");
          audio.loop = true;
          audio.play().catch(err => console.warn("Audio play blocked:", err));
          audioRef.current = audio;
          setIsAudioPlaying(true);
          setSelectedBus(closest);
          addNotification(`🚍 Bus ${closest.driverName || closest.busId} is nearby (${(minDist/1000).toFixed(2)} km).`);
        }
      } else {
        // if far and audio is playing -> stop
        if (isAudioPlaying && audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current = null;
          setIsAudioPlaying(false);
          setSelectedBus(null);
          setLastStopTime(Date.now());
          addNotification(`🛑 Bus moved away — alert stopped.`);
        }
      }
    };

    const interval = setInterval(checkFn, CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isAudioPlaying]); // isAudioPlaying included so state updates trigger effect start/stop correctly

  // ---------- STOP if nearbyBuses fully empty ----------
  useEffect(() => {
    if (nearbyBuses.length === 0) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
        setIsAudioPlaying(false);
        setSelectedBus(null);
        addNotification("🛑 All buses offline. Notification stopped.");
      }
    }
  }, [nearbyBuses]);

  // ---------- LOGOUT ----------
  const handleLogout = () => {
    // stop audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsAudioPlaying(false);
    setSelectedBus(null);

    // disconnect socket
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
    setNotifications([]);
    toast.success(`Logged out successfully ${user.name}`);
    navigate("/");
  };

  // ---------- CLEANUP on unmount ----------
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const clearNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  // derive closestBus for UI (non-critical)
  const closestBus = (() => {
    if (!userLocation || nearbyBuses.length === 0) return null;
    let closest = null; let min = Infinity;
    for (const b of nearbyBuses) {
      if (!b.location) continue;
      const d = calculateDistance(userLocation.latitude, userLocation.longitude, b.location.latitude, b.location.longitude);
      if (d < min) { min = d; closest = { bus: b, distance: d }; }
    }
    return closest;
  })();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
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
              socketRef.current?.emit("student_subscribe", { studentId: user.email, location: userLocation });
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

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <InfoCard icon={User} title="Student Name" value={user.name} color="text-blue-600" />
          <InfoCard icon={Phone} title="Email" value={user.email} color="text-yellow-600" />
          <InfoCard icon={BusFront} title="Active Buses" value={nearbyBuses.length} color="text-indigo-600" />
        </div>

        <div className="lg:col-span-2 h-[400px] sm:h-[500px]">
          <LiveMap userLocation={userLocation} nearbyBuses={nearbyBuses} selectedBus={selectedBus} setSelectedBus={setSelectedBus} />
        </div>

        <div className="space-y-6">
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
                      className={`p-3 rounded-lg border-l-4 bg-gray-50 border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer ${selectedBus?.busId === bus.busId ? "ring-2 ring-indigo-200" : ""}`}
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

            {isAudioPlaying && (
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                    audioRef.current = null;
                  }
                  setIsAudioPlaying(false);
                  setLastStopTime(Date.now());
                  addNotification("🚫 Alert stopped manually.");
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
