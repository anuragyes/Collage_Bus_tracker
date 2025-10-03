
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import toast, { Toaster } from "react-hot-toast";
// import { LogIn, BusFront, Power } from "lucide-react";
// import axios from "axios";

// const API_BASE_URL = "http://localhost:5000";
// const START_RIDE_ENDPOINT = "/api/driverprofile/riding/driver";

// const DriverAccessProfile = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [busNumber, setBusNumber] = useState("");
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!email || !password || !busNumber) {
//             return toast.error("All fields (Email, Password, Bus Number) are required.");
//         }
//         setLoading(true);



//         try {
//             const response = await axios.post(`${API_BASE_URL}${START_RIDE_ENDPOINT}`, {
//                 email,
//                 password,
//                 busNumber
//             }, { withCredentials: true });


//             console.log("thsi is Driver", response.data.driver)

//             if (response.data && response.data.driver) {
//                 toast.success(response.data.message || "Login successful! Redirecting to dashboard.");
//                 // Navigate to the dashboard and pass the user data
//                 navigate("/dashboard", { state: { user: response.data.driver } });
//             } else {
//                 throw new Error("Server response missing driver data.");
//             }
//         } catch (error) {
//             const errorMessage = error.response?.data?.message || "Login failed. Please check credentials and bus status.";
//             toast.error(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="  p-20 flex justify-center items-center min-h-screen bg-gray-100 font-sans ">
//             <Toaster position="top-center" reverseOrder={false} />
//             <div className="w-full max-w-6xl min-h-[90vh] bg-gray-50 shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden">
//                 <div className="w-full md:w-1/3 lg:w-1/4 p-6 flex flex-col justify-center items-center text-center bg-gray-700 text-white">
//                     <BusFront size={48} className="mb-4 text-white" />
//                     <h1 className="text-3xl font-extrabold mb-2">Driver Portal</h1>
//                     <p className="text-sm font-light opacity-80">
//                         Authenticate to start your shift.
//                     </p>
//                 </div>
//                 <div className="flex-1 flex justify-center items-start md:items-center p-6 md:p-10 bg-gray-100">
//                     <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl">
//                         <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
//                             Driver Access
//                         </h2>
//                         <p className="text-center text-sm text-gray-500 mb-6">
//                             Enter your credentials and bus number to start live tracking.
//                         </p>
//                         <form onSubmit={handleSubmit} className="space-y-6">
//                             <div>
//                                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
//                                 <input
//                                     id="email"
//                                     type="email"
//                                     required
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                                     placeholder="e.g., driver@busco.com"
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
//                                 <input
//                                     id="password"
//                                     type="password"
//                                     required
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                                     placeholder="••••••••"
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="busNumber" className="block text-sm font-medium text-gray-700">Bus Number (Required)</label>
//                                 <input
//                                     id="busNumber"
//                                     type="text"
//                                     required
//                                     value={busNumber}
//                                     onChange={(e) => setBusNumber(e.target.value)}
//                                     className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                                     placeholder="e.g., B-217"
//                                 />
//                             </div>
//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-lg font-semibold text-white transition-all duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
//                                     }`}
//                             >
//                                 {loading ? (
//                                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                 ) : (
//                                     <>
//                                         <Power className="w-5 h-5 mr-2" /> Start Ride & Login
//                                     </>
//                                 )}
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DriverAccessProfile
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { BusFront, Power } from "lucide-react";
import axios from "axios";


const API_BASE_URL = "http://localhost:5000"; 
const LOGIN_ENDPOINT = "/api/driverprofile/driver/login";
const LOGOUT_ENDPOINT = "/api/driverprofile/driver/logout";

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
            const response = await axios.post(
                `${API_BASE_URL}${LOGIN_ENDPOINT}`,
                { email, password, busNumber },
                { withCredentials: true }
            );

            if (response.data && response.data.driver) {
                toast.success(response.data.message || "Login successful! Redirecting...");
                navigate("/dashboard", { state: { user: response.data.driver } });
            } else {
                throw new Error("Server response missing driver data.");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                "Login failed. Please check credentials and bus status.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // 🚪 Handle Driver Logout (useful if you add logout button here later)
    const handleLogout = async () => {
        try {
            await axios.post(
                `${API_BASE_URL}${LOGOUT_ENDPOINT}`,
                { busNumber },
                { withCredentials: true }
            );
            toast.success("Logged out successfully!");
            navigate("/");
        } catch (error) {
            toast.error("Logout failed. Please try again.");
        }
    };

    return (
        <div className="p-20 flex justify-center items-center min-h-screen bg-gray-100 font-sans">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="w-full max-w-6xl min-h-[90vh] bg-gray-50 shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden">
                {/* Sidebar */}
                <div className="w-full md:w-1/3 lg:w-1/4 p-6 flex flex-col justify-center items-center text-center bg-gray-700 text-white">
                    <BusFront size={48} className="mb-4 text-white" />
                    <h1 className="text-3xl font-extrabold mb-2">Driver Portal</h1>
                    <p className="text-sm font-light opacity-80">
                        Authenticate to start your shift.
                    </p>
                </div>

                {/* Main Login Form */}
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
                                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-lg font-semibold text-white transition-all duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
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

export default DriverAccessProfile;
