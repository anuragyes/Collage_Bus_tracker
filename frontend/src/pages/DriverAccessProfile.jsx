// import React, { useState, useEffect } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { LogIn, User, MapPin, BusFront, Phone, Power, Check, X, History } from "lucide-react"; 
// import axios from "axios";

// const API_BASE_URL = "http://localhost:5000";
// const START_RIDE_ENDPOINT = "/api/driverprofile/riding/driver";

// const INITIAL_DRIVER_DATA = {
//     _id: "driver_default",
//     name: "Loading Driver...",
//     email: "loading@busco.com",
//     phoneNumber: "N/A",
//     busNumber: "N/A",
//     location: { lat: 0, lng: 0 }, 
//     isDriving: false,
//     tripHistory: [],
// };

// const InfoCard = ({ icon: Icon, title, value, color }) => (
//     <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-l-gray-300 transition-all duration-300 hover:shadow-2xl">
//         <div className="flex items-center space-x-3">
//             <Icon className={`w-6 h-6 ${color}`} />
//             <div>
//                 <p className="text-xs font-semibold uppercase text-gray-500">{title}</p>
//                 <p className="text-lg font-bold text-gray-800 break-words">{value}</p>
//             </div>
//         </div>
//     </div>
// );

// const DrivingStatusDisplay = ({ isDriving, onToggleStatus, loading }) => (
//     <div className="bg-white p-5 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between border-l-4 border-l-blue-600">
//         <div className="flex items-center space-x-3 mb-4 md:mb-0">
//             {isDriving ? (
//                 <Check className="w-8 h-8 text-green-600 bg-green-50 p-1 rounded-full" />
//             ) : (
//                 <X className="w-8 h-8 text-red-500 bg-red-50 p-1 rounded-full" />
//             )}
//             <div>
//                 <p className="text-xl font-bold text-gray-800">Operational Status</p>
//                 <span className={`text-sm font-semibold ${isDriving ? 'text-green-600' : 'text-red-600'}`}>
//                     {isDriving ? "ON DUTY (LIVE TRACKING ACTIVE)" : "OFF DUTY"}
//                 </span>
//             </div>
//         </div>
        
//         <button
//             onClick={onToggleStatus}
//             disabled={loading || isDriving === false}
//             className={`flex items-center justify-center px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 w-full md:w-auto ${
//                 loading ? 'bg-gray-400 cursor-not-allowed' : isDriving
//                     ? 'bg-red-600 hover:bg-red-700' 
//                     : 'bg-gray-500 cursor-not-allowed'
//             }`}
//             title={isDriving ? "Click to end the ride and go offline" : "Start ride via Login Form"}
//         >
//             {loading ? (
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//             ) : (
//                 <>
//                     <Power className="w-5 h-5 mr-2" />
//                     {"End Ride / Go Offline"}
//                 </>
//             )}
//         </button>
//     </div>
// );

// const LoginForm = ({ onLoginSuccess }) => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [busNumber, setBusNumber] = useState("");
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!email || !password || !busNumber) {
//             return toast.error("All fields (Email, Password, Bus Number) are required.");
//         }
//         setLoading(true);
        
//         try {
//             // Updated to include withCredentials: true
//             const response = await axios.post(`${API_BASE_URL}${START_RIDE_ENDPOINT}`, {
//                 email,
//                 password,
//                 busNumber
//             }, { withCredentials: true }); // <-- Added withCredentials

//             if (response.data && response.data.driver) {
//                 toast.success(response.data.message || "Ride started successfully. Welcome!");
//                 onLoginSuccess(response.data.driver);
//             } else {
//                  throw new Error("Server response missing driver data.");
//             }
//         } catch (error) {
//             const errorMessage = error.response?.data?.message || "Login failed. Please check credentials and bus status.";
//             toast.error(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl">
//             <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
//                 Driver Access
//             </h2>
//             <p className="text-center text-sm text-gray-500 mb-6">
//                 Authenticate and assign a bus to start tracking.
//             </p>
//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
//                     <input
//                         id="email"
//                         type="email"
//                         required
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                         placeholder="e.g., driver@busco.com"
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
//                     <input
//                         id="password"
//                         type="password"
//                         required
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                         placeholder="••••••••"
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="busNumber" className="block text-sm font-medium text-gray-700">Bus Number (Required for ride start)</label>
//                     <input
//                         id="busNumber"
//                         type="text"
//                         required
//                         value={busNumber}
//                         onChange={(e) => setBusNumber(e.target.value)}
//                         className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                         placeholder="e.g., B-217"
//                     />
//                 </div>
//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-lg font-semibold text-white transition-all duration-300 ${
//                         loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.01]'
//                     }`}
//                 >
//                     {loading ? (
//                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     ) : (
//                         <>
//                             <Power className="w-5 h-5 mr-2" /> Start Ride & Login
//                         </>
//                     )}
//                 </button>
//             </form>
//         </div>
//     );
// };

// const DriverDashboard = ({ user, setUser, onLogout }) => {
//     const [statusLoading, setStatusLoading] = useState(false);
//     const [location, setLocation] = useState(user.location || INITIAL_DRIVER_DATA.location); 
//     const isDriving = user.isDriving;

//     useEffect(() => {
//         let interval;
//         if (isDriving) {
//             interval = setInterval(() => {
//                 const newLat = location.lat + (Math.random() * 0.001 - 0.0005);
//                 const newLng = location.lng + (Math.random() * 0.001 - 0.0005);

//                 setLocation({ lat: newLat, lng: newLng });
//             }, 2000);
//         }
//         return () => clearInterval(interval);
//     }, [isDriving, location.lat, location.lng]);

//     const handleToggleStatus = async () => {
//         setStatusLoading(true);

//         if (isDriving) {
//             try {
//                 // In a real application, replace this with an axios.post to /api/driver/endRide
//                 await new Promise(resolve => setTimeout(resolve, 500)); 
                
//                 setUser(prev => ({ ...prev, isDriving: false }));
//                 toast.success("Ride ended. You are now Off Duty.");
//             } catch (error) {
//                  toast.error("Failed to end ride status.");
//             }
//         } else {
//             toast.error("You are already Off Duty. Please use the Login form to start a new shift.");
//         }
//         setStatusLoading(false);
//     };

//     return (
//         <div className="w-full h-full p-4 md:p-8 overflow-y-auto">
//             <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">
//                 {user.name}'s Driver Profile
//             </h1>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                 <div className="lg:col-span-3">
//                     <DrivingStatusDisplay
//                         isDriving={isDriving}
//                         onToggleStatus={handleToggleStatus}
//                         loading={statusLoading}
//                     />
//                 </div>
                
//                 <InfoCard icon={User} title="Driver Name" value={user.name} color="text-blue-600" />
//                 <InfoCard icon={BusFront} title="Assigned Bus" value={user.busNumber || "N/A"} color="text-indigo-600" />
//                 <InfoCard icon={Phone} title="Contact" value={user.phoneNumber || "N/A"} color="text-yellow-600" />
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="bg-white p-6 rounded-2xl shadow-xl">
//                     <div className="flex items-center space-x-2 mb-4">
//                         <MapPin className="w-6 h-6 text-green-600" />
//                         <h2 className="text-xl font-bold text-gray-800">Live Location Feed</h2>
//                     </div>
//                     <div className="space-y-3 font-mono text-sm">
//                         <p className={`text-xl font-bold ${isDriving ? 'text-green-600' : 'text-red-600'}`}>
//                             Status: {isDriving ? "Sending Updates" : "Tracking Disabled"}
//                         </p>
//                         <p className="text-gray-700">Latitude: <span className="font-semibold">{location.lat.toFixed(5)}</span></p>
//                         <p className="text-gray-700">Longitude: <span className="font-semibold">{location.lng.toFixed(5)}</span></p>
                        
//                         <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg mt-4 text-gray-500 font-light text-xs">
//                             [Map Interface Placeholder: Simulating GPS updates every 2 seconds]
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-white p-6 rounded-2xl shadow-xl">
//                     <div className="flex items-center space-x-2 mb-4">
//                         <History className="w-6 h-6 text-gray-600" />
//                         <h2 className="text-xl font-bold text-gray-800">Trip History</h2>
//                     </div>
//                     <div className="space-y-3 overflow-y-auto max-h-[300px]">
//                         {(user.tripHistory || []).length > 0 ? (
//                             user.tripHistory.map((trip, index) => (
//                                 <div key={index} className="border-b border-gray-100 pb-2">
//                                     <p className="text-sm font-medium text-blue-700">{trip.route}</p>
//                                     <p className="text-xs text-gray-500">
//                                         {new Date(trip.startTime).toLocaleTimeString()} - {new Date(trip.endTime).toLocaleTimeString()}
//                                     </p>
//                                 </div>
//                             ))
//                         ) : (
//                             <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
//                                 No trip history recorded.
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             <div className="mt-8 text-center">
//                 <button
//                     onClick={onLogout}
//                     className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
//                 >
//                     Log Out
//                 </button>
//             </div>
//         </div>
//     );
// };


// const DriverAccessProfile = () => {
//     const [user, setUser] = useState(null); 

//     const handleLoginSuccess = (driverData) => {
//         setUser(driverData);
//         // Note: toast.success is now handled inside LoginForm
//     };

//     const handleLogout = () => {
//         setUser(null);
//         toast.success("Logged out successfully!");
//     };
    
//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans p-4">
//             <Toaster position="top-center" reverseOrder={false} />
//             <div className="w-full max-w-6xl min-h-[90vh] bg-gray-50 shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden">
                
//                 <div className={`w-full md:w-1/3 lg:w-1/4 p-6 flex flex-col justify-center items-center text-center transition-all duration-500 ${user ? 'bg-gray-900 text-white' : 'bg-gray-700 text-white'}`}>
//                     <BusFront size={48} className={`mb-4 ${user ? 'text-blue-400' : 'text-white'}`} />
//                     <h1 className="text-3xl font-extrabold mb-2">Driver Portal</h1>
//                     <p className="text-sm font-light opacity-80">
//                         {user ? "Live Tracking and Status Control" : "Authenticate to start your shift."}
//                     </p>
//                 </div>

//                 <div className="flex-1 flex justify-center items-start md:items-center p-6 md:p-10 bg-gray-100">
//                     {user ? (
//                         <DriverDashboard 
//                             user={user} 
//                             setUser={setUser} 
//                             onLogout={handleLogout} 
//                         />
//                     ) : (
//                         <LoginForm onLoginSuccess={handleLoginSuccess} />
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DriverAccessProfile;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { LogIn, BusFront, Power } from "lucide-react"; 
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";
const START_RIDE_ENDPOINT = "/api/driverprofile/riding/driver";

const DriverAccessProfile = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busNumber, setBusNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password || !busNumber) {
            return toast.error("All fields (Email, Password, Bus Number) are required.");
        }
        setLoading(true);
        
        try {
            const response = await axios.post(`${API_BASE_URL}${START_RIDE_ENDPOINT}`, {
                email,
                password,
                busNumber
            }, { withCredentials: true });

            if (response.data && response.data.driver) {
                toast.success(response.data.message || "Login successful! Redirecting to dashboard.");
                // Navigate to the dashboard and pass the user data
                navigate("/dashboard", { state: { user: response.data.driver } });
            } else {
                 throw new Error("Server response missing driver data.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed. Please check credentials and bus status.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans p-4">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="w-full max-w-6xl min-h-[90vh] bg-gray-50 shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:w-1/3 lg:w-1/4 p-6 flex flex-col justify-center items-center text-center bg-gray-700 text-white">
                    <BusFront size={48} className="mb-4 text-white" />
                    <h1 className="text-3xl font-extrabold mb-2">Driver Portal</h1>
                    <p className="text-sm font-light opacity-80">
                        Authenticate to start your shift.
                    </p>
                </div>
                <div className="flex-1 flex justify-center items-start md:items-center p-6 md:p-10 bg-gray-100">
                    <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl">
                        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
                            Driver Access
                        </h2>
                        <p className="text-center text-sm text-gray-500 mb-6">
                            Enter your credentials and bus number to start live tracking.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="e.g., driver@busco.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label htmlFor="busNumber" className="block text-sm font-medium text-gray-700">Bus Number (Required)</label>
                                <input
                                    id="busNumber"
                                    type="text"
                                    required
                                    value={busNumber}
                                    onChange={(e) => setBusNumber(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="e.g., B-217"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-lg font-semibold text-white transition-all duration-300 ${
                                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Power className="w-5 h-5 mr-2" /> Start Ride & Login
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverAccessProfile