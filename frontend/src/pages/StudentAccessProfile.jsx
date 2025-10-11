



import React, { useState } from "react";
import toast from "react-hot-toast";
import { LogIn, User } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

 const BASE_URL = "https://collage-bus-tracker-backend.onrender.com";

const StudentAccessProfile = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please enter email and password.");
    }
    setLoading(true);
    try {
      const response = await axios.post(
  `${BASE_URL}/api/student/ride/studentRide`,
  { email, password },
  { withCredentials: true } // ✅ important to send cookies
);

      console.log("this is resposne from stduent profile ", response)
       console.log("this is respose from student progile resposne emai", response.data.email)
      toast.success("Student Login Successful!");
      // Navigate to dashboard with student data
      navigate('/student-dashboard', { state: { studentData: response.data } });

    } catch (error) {
      console.error("Login error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans p-4">
    
      <div className="w-full max-w-4xl min-h-[80vh] bg-gray-50 shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden">

        <div className="w-full md:w-1/3 lg:w-2/5 p-8 flex flex-col justify-center items-center text-center bg-purple-600 text-white">
          <User size={64} className="mb-6 text-white" />
          <h1 className="text-4xl font-extrabold mb-4">Student Portal</h1>
          <p className="text-lg font-light opacity-90">
            Access your bus tracking and subscription services
          </p>
        </div>

        <div className="flex-1 flex justify-center items-center p-8 md:p-12 bg-white">
          <div className="max-w-md w-full">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
              Welcome Back
            </h2>
            <p className="text-center text-gray-500 mb-8">
              Sign in to track your bus in real-time
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="student@school.edu"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-lg font-semibold text-white transition-all duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 transform hover:scale-[1.02]'
                  }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" /> Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold">
                  Contact administrator
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default  StudentAccessProfile;
