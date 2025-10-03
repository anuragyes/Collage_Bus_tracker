
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { User, MapPin, BusFront, Phone, Power, Check, X, LogOut } from "lucide-react"; 
import { io } from "socket.io-client";
import { FaBus } from "react-icons/fa";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const SOCKET_IO_URL = "https://collage-bus-tracker-backend.onrender.com";
const GOOGLE_MAPS_API_KEY = "AIzaSyCGHZtNx-x6Z0jOJdc2s1O5e0_xA84mX5k";

const socket = io(SOCKET_IO_URL, { withCredentials: true });

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
            className={`flex items-center justify-center px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 w-full md:w-auto ${
                loading ? 'bg-gray-400 cursor-not-allowed' : isDriving
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

const LiveMap = ({ busId, isDriving, currentLocation, setCurrentLocation }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });


    //   console.log("this is nus id" , busId)
    const watchId = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    const mapContainerStyle = {
        width: "100%",
        height: "50vh", // responsive height for mobile & desktop
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
    };



    const defaultCenter = { lat: 28.7041, lng: 77.1025 };

    const driverBusIcon = {
        url: <FaBus />,
        scaledSize: { width: 48, height: 48 }
    };

    useEffect(() => {
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
                { enableHighAccuracy: true, maximumAge: 0, timeout: 5000, distanceFilter: 10 }
            );
        } else {
            if (watchId.current) {
                navigator.geolocation.clearWatch(watchId.current);
                watchId.current = null;
            }
        }

        return () => {
            if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
        };
    }, [isDriving, busId, setCurrentLocation]);

    const onMapLoad = (map) => { mapRef.current = map; };

    if (loadError) return <div className="text-red-500 p-4">Error loading maps. Please check your connection.</div>;
    if (!isLoaded) return (
        <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading maps...</p>
        </div>
    );

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={15}
            center={currentLocation ? { lat: currentLocation.latitude, lng: currentLocation.longitude } : defaultCenter}
            onLoad={onMapLoad}
            options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: true, zoomControl: true, draggable: true }}
        >
            {currentLocation && isDriving && (
                <Marker
                    position={{ lat: currentLocation.latitude, lng: currentLocation.longitude }}
                    icon={driverBusIcon}
                    title={`Your Bus: ${busId}`}
                    ref={markerRef}
                />
            )}
        </GoogleMap>
    );
};

const Bus = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(location.state?.user || {
        name: "Driver Name",
        busNumber: "BUS-001",
        phoneNumber: "N/A",
        isDriving: false
    });

    const [statusLoading, setStatusLoading] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        if (!location.state?.user) {
            toast.error("You must be logged in to view this page.");
            navigate("/", { replace: true });
        }
    }, [location.state, navigate]);

    useEffect(() => {
        socket.on("ride_started", (data) => {
            if (data.busId === user.busNumber) toast.success("Ride started! Live tracking is now active.");
        });
        socket.on("ride_ended", (data) => {
            if (data.busId === user.busNumber) toast.success("Ride ended successfully.");
        });
        return () => {
            socket.off("ride_started");
            socket.off("ride_ended");
        };
    }, [user.busNumber]);

    const handleToggleStatus = async () => {
        setStatusLoading(true);
        try {
            if (user.isDriving) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setUser(prev => ({ ...prev, isDriving: false }));
                socket.emit("driver_logout", { busId: user.busNumber });
                toast.success("Ride ended. You are now Off Duty.");
            } else {
                if (!navigator.geolocation) {
                    toast.error("Geolocation is not supported by this browser.");
                    setStatusLoading(false);
                    return;
                }
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setCurrentLocation({ latitude, longitude });
                        setUser(prev => ({ ...prev, isDriving: true }));
                        socket.emit("driver_login", { busId: user.busNumber, driverName: user.name, initialLocation: { latitude, longitude } });
                        toast.success("Ride started! Live tracking activated.");
                        setStatusLoading(false);
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                        toast.error("Unable to get your location. Please enable location services.");
                        setStatusLoading(false);
                    }
                );
            }
        } catch (error) {
            toast.error("Failed to update ride status.");
            setStatusLoading(false);
        }
    };

    // const handleLogout = () => {
    //     if (user?.isDriving) socket.emit("driver_logout", { busId: user.busNumber });
    //     socket.disconnect();
    //     toast.success("Logged out successfully!");
    //     navigate("/");
    // };

    const handleLogout = async () => {
    try {
        if (user?.isDriving) {
            socket.emit("driver_logout", { busId: user.busNumber });
        }

          console.log("this is user" , user);

        // Call backend to update DB
        await fetch("http://localhost:5000/api/driverprofile/driver/logout", {
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
            <Toaster position="top-center" reverseOrder={false} />
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-3">
                        <DrivingStatusDisplay isDriving={user.isDriving} onToggleStatus={handleToggleStatus} loading={statusLoading} />
                    </div>
                    <InfoCard icon={User} title="Driver Name" value={user.name} color="text-blue-600" />
                    <InfoCard icon={BusFront} title="Assigned Bus" value={user.busNumber || "N/A"} color="text-indigo-600" />
                    <InfoCard icon={Phone} title="Contact" value={user.phoneNumber || "N/A"} color="text-yellow-600" />
                </div>

                <div className="grid grid-cols-1 gap-6 w-full">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full">
                        <div className="flex items-center space-x-2 mb-4">
                            <MapPin className="w-6 h-6 text-green-600" />
                            <h2 className="text-xl font-bold text-gray-800">Live Location Tracker</h2>
                        </div>

                        <div className="space-y-3 font-mono text-sm mb-4">
                            <p className={`text-xl font-bold ${user.isDriving ? 'text-green-600' : 'text-red-600'}`}>
                                Status: {user.isDriving ? "LIVE TRACKING ACTIVE" : "TRACKING DISABLED"}
                            </p>
                            <p className="text-gray-700">
                                Latitude: <span className="font-semibold">{currentLocation?.latitude?.toFixed(6) || "N/A"}</span>
                            </p>
                            <p className="text-gray-700">
                                Longitude: <span className="font-semibold">{currentLocation?.longitude?.toFixed(6) || "N/A"}</span>
                            </p>
                            {currentLocation && (
                                <p className="text-gray-700">
                                    Last Update: <span className="font-semibold">{new Date().toLocaleTimeString()}</span>
                                </p>
                            )}
                        </div>

                        <div className="mt-4 w-full">
                            <LiveMap busId={user.busNumber} isDriving={user.isDriving} currentLocation={currentLocation} setCurrentLocation={setCurrentLocation} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bus;
