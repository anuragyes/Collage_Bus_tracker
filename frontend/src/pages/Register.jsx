import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import { LogIn, UserPlus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/authContext.js";

const Register = () => {
  const { AuthLogin, AuthSignup } = useContext(AuthContext);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Only for signup
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!email || !password || (isSignup && !name)) {
    return toast.error("Please fill all required fields.");
  }

  setLoading(true);
  try {
    if (isSignup) {
      await AuthSignup({ name, email, password });
      toast.success("Account created successfully! 🎉");
    } else {
      await AuthLogin({ email, password });
      toast.success("Login successful! 🎉");
    }

    // Navigate only after successful auth
    navigate("/");
  } catch (error) {
    toast.error(error.response?.data?.message || "Authentication failed.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans p-4" style={{
      backgroundImage:
        "url('https://png.pngtree.com/background/20231030/original/pngtree-conceptual-education-background-for-returning-to-school-picture-image_5783169.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>
      
      <div className="w-full max-w-4xl min-h-[80vh] bg-gray-50 shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden">

        {/* Left Section */}
        <div className="w-full md:w-1/3 lg:w-2/5 p-8 flex flex-col justify-center items-center text-center bg-purple-600 text-white">
          <User size={64} className="mb-6 text-white" />
          <h1 className="text-4xl font-extrabold mb-4">
            {isSignup ? "Create Account" : "User Portal"}
          </h1>
          <p className="text-lg font-light opacity-90">
            {isSignup
              ? "Join us to access services and features"
              : "Login to continue and manage your profile"}
          </p>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex justify-center items-center p-8 md:p-12 bg-white">
          <div className="max-w-md w-full">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
              {isSignup ? "Sign Up" : "Welcome Back"}
            </h2>
            <p className="text-center text-gray-500 mb-8">
              {isSignup
                ? "Create your account to get started"
                : "Sign in to your account"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-lg font-semibold text-white transition-all duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 transform hover:scale-[1.02]"
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isSignup ? (
                      <>
                        <UserPlus className="w-5 h-5 mr-2" /> Sign Up
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 mr-2" /> Sign In
                      </>
                    )}
                  </>
                )}
              </button>
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  {isSignup ? "Login" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
