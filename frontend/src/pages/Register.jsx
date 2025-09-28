

import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../Context/authContext.js";
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const {
    studentLogin,
    driverLogin,
    forgotPassword
  } = useContext(AuthContext);

  const [userType, setUserType] = useState("student");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    email: "", 
    password: ""
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    setAnimationClass("scale-95");
    const timer = setTimeout(() => setAnimationClass("scale-100"), 50);
    return () => clearTimeout(timer);
  }, [userType, showForgotPassword]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) { 
      newErrors.email = "Email is required"; 
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) { 
      newErrors.email = "Email is invalid"; 
    }
    if (!formData.password) { 
      newErrors.password = "Password is required"; 
    } else if (formData.password.length < 6) { 
      newErrors.password = "Password must be at least 6 characters"; 
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (userType === "student") {
        await studentLogin(formData);
        toast.success("Student logged in successfully! 🎉");
        navigate('/'); // Redirect to student dashboard
      } else {
        await driverLogin(formData);
        toast.success("Driver logged in successfully! 🚌");
        navigate('/'); // Redirect to driver dashboard
      }
    } catch (err) {
      toast.error("Login failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail.trim() || !/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(forgotPasswordEmail, userType);
      toast.success(`Password reset instructions sent to ${forgotPasswordEmail} 📧`);
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    } catch (err) {
      toast.error("Failed to send reset email: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: "", password: "" });
    setErrors({});
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    resetForm();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-4 animate-gradient-x">
      <div className={`bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden transition-transform duration-300 ${animationClass}`}>
        
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-3xl z-10">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-600">Logging in...</p>
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {showForgotPassword ? "Reset Password" : "Welcome Back"}
          </h2>
          <p className="text-gray-600 mt-2">
            {showForgotPassword 
              ? "Enter your email to reset password" 
              : `Login as ${userType}`}
          </p>
        </div>

        {!showForgotPassword && (
          <div className="flex justify-center mb-6 bg-gray-100 rounded-full p-1">
            <button
              className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                userType === "student"
                  ? "bg-blue-500 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => handleUserTypeChange("student")}
            >
              Student
            </button>
            <button
              className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                userType === "driver"
                  ? "bg-purple-500 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-purple-500"
              }`}
              onClick={() => handleUserTypeChange("driver")}
            >
              Driver
            </button>
          </div>
        )}

        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg transition-all hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 shadow-lg"
            >
              Send Reset Instructions
            </button>
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full text-gray-600 p-3 rounded-lg transition-all hover:text-blue-500"
            >
              Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none transition-all ${
                  errors.email ? "border-red-500 focus:ring-2 focus:ring-red-400" : "focus:ring-2 focus:ring-blue-400"
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none transition-all ${
                  errors.password ? "border-red-500 focus:ring-2 focus:ring-red-400" : "focus:ring-2 focus:ring-blue-400"
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-blue-500 hover:text-blue-700 transition-colors text-sm"
              >
                Forgot Password?
              </button>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                userType === "student"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              } text-white p-3 rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              Login as {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </button>

            {/* Additional Info */}
            <div className="text-center mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                {userType === "student" 
                  ? "Login to track your bus in real-time"
                  : "Login to start your ride and share location"
                }
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;