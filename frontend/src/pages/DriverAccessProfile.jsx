

import React, { useState } from "react";
import { useNavigate, BrowserRouter, Routes, Route } from "react-router-dom"; 
import toast from "react-hot-toast";
import { BusFront, Power, Mail, Lock, Hash } from "lucide-react";
import axios from "axios";




const API_BASE_URL = "http://localhost:5000";
const LOGIN_ENDPOINT = "/api/driverprofile/driver/login";

// Custom Spinner Component for consistency and aesthetics
const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        Processing...
    </div>
);

// We rename the main logic component to avoid confusion with the export name
const DriverAccessProfile = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busNumber, setBusNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 

    // 🚍 Handle Driver Login
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password || !busNumber) {
            return toast.error("All fields (Email, Password, Bus Number) are required.");
        }
        setLoading(true);

        try {
            // Using exponential backoff for API calls to handle throttling/transient errors
            const MAX_RETRIES = 3;
            let response = null;

            for (let i = 0; i < MAX_RETRIES; i++) {
                try {
                    response = await axios.post(
                        `${API_BASE_URL}${LOGIN_ENDPOINT}`,
                        { email, password, busNumber },
                        { withCredentials: true }
                    );
                    break; // Success, exit loop
                } catch (err) {
                    if (i === MAX_RETRIES - 1) throw err; // Re-throw last error
                    await new Promise(resolve => setTimeout(resolve, 2 ** i * 1000)); // Exponential backoff delay
                }
            }


            if (response.data && response.data.driver) {
                toast.success(response.data.message);
                // Navigating to the dashboard path
                //  console.log("this is profile destials of driver ", response);
                navigate("/dashboard", { state: { user: response.data.driver } });
            } else {
                throw new Error("Server response missing driver data.");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                "Login failed. Please check credentials and bus status.";
            toast.error(errorMessage);
            console.error("Login Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-8 flex justify-center items-center min-h-screen bg-gray-100 font-sans">
            {/* Main Container: Responsive width and shadow for desktop */}
            <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden">
                
                {/* Sidebar / Branding Section */}
                {/* Responsive width: full width on mobile, 1/3 to 2/5 on desktop */}
                <div className="w-full md:w-1/3 lg:w-2/5 p-8 flex flex-col justify-center items-center text-center bg-indigo-700 text-white shadow-lg">
                    <BusFront size={64} strokeWidth={1.5} className="mb-4 text-indigo-200" />
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-wide">Bus Tracker</h1>
                    <h2 className="text-xl font-semibold mb-4 border-b border-indigo-500 pb-1">Driver Portal</h2>
                    <p className="text-sm font-light opacity-80 max-w-xs">
                        Authenticate securely to start your route. Your live location will be shared with students and administration upon successful login.
                    </p>
                </div>

                {/* Main Login Form Section */}
                {/* Flexible width for the form on all screens */}
                <div className="flex-1 flex justify-center items-center p-6 sm:p-10 lg:p-12">
                    <div className="w-full">
                        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
                            Access Shift
                        </h2>
                        <p className="text-center text-sm text-gray-500 mb-8">
                            Enter details to begin tracking
                        </p>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative rounded-lg shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                                        placeholder="e.g., driver@busco.com"
                                    />
                                </div>
                            </div>
                            
                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative rounded-lg shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            
                            {/* Bus Number Field */}
                            <div>
                                <label htmlFor="busNumber" className="block text-sm font-medium text-gray-700 mb-1">Bus Number (Required)</label>
                                <div className="relative rounded-lg shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Hash className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="busNumber"
                                        type="text"
                                        required
                                        value={busNumber}
                                        onChange={(e) => setBusNumber(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                                        placeholder="e.g., B-217 or RJ-14-1234"
                                    />
                                </div>
                            </div>
                            
                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-lg text-lg font-bold text-white transition-all duration-300 transform hover:scale-[1.01] ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                                    }`}
                            >
                                {loading ? (
                                    <LoadingSpinner />
                                ) : (
                                    <>
                                        <Power className="w-5 h-5 mr-2" /> Start Shift & Login
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

 export default  DriverAccessProfile