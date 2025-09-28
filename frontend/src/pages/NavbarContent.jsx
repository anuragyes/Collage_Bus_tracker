import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import BusComponent from "./Buscomponent";
import { AuthContext } from "../Context/authContext.js";
import toast from "react-hot-toast";

const NavbarContent = () => {
  const navigate = useNavigate();
  const { currentStudent, currentDriver } = useContext(AuthContext);

  const handleStudent = () => {
    if (currentStudent) {
      navigate("/studentaccess");
    } else {
      toast.error("Please log in as a Student to track the bus.");
    }
  };

  const handleDriver = () => {
    if (currentDriver) {
      navigate("/driveraccess");
    } else {
      toast.error("Please log in as a Bus Driver to set the tracker.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 font-sans">
        <Navbar />

        {/* Hero Section */}
        <section className="pt-20 md:pt-32 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Finder!
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-2xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
              Track easy, manage smart – Your ultimate solution for intelligent
              tracking and management
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2">
              {/* Student Button */}
              <button
                onClick={handleStudent}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 sm:px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl text-sm sm:text-lg min-w-[160px] sm:min-w-[200px]"
              >
                Start Tracking as Student Now
              </button>

              {/* Driver Button */}
              <button
                onClick={handleDriver}
                className="w-full sm:w-auto border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-5 sm:px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105 text-sm sm:text-lg min-w-[160px] sm:min-w-[200px]"
              >
                Set Tracker as Driver
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-10 sm:py-12 md:py-16 bg-white">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-12 px-2"
              id="how-it-works"
            >
              How Finder Works
            </h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[
                {
                  title: "Track Easy",
                  desc: "Simple and intuitive tracking interface",
                  icon: "📍",
                },
                {
                  title: "Manage Smart",
                  desc: "Advanced management tools for efficiency",
                  icon: "⚡",
                },
                {
                  title: "Analyze Deep",
                  desc: "Comprehensive analytics and insights",
                  icon: "📊",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-4 sm:p-6 bg-gray-50 rounded-xl shadow-md transform transition duration-300 hover:scale-[1.02] mx-2 sm:mx-0"
                >
                  <div className="text-3xl sm:text-5xl mb-3 sm:mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mobile-Only Features */}
        <section className="py-8 md:py-12 bg-gradient-to-r from-purple-50 to-pink-50 lg:hidden">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h3 className="text-lg sm:text-2xl font-bold text-center text-gray-900 mb-6">
              Perfect for Mobile Use
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              {[
                { icon: "📱", text: "Mobile Optimized" },
                { icon: "🚌", text: "Real-time Tracking" },
                { icon: "🔔", text: "Live Notifications" },
                { icon: "⚡", text: "Fast & Reliable" },
              ].map((f, i) => (
                <div
                  key={i}
                  className="p-3 bg-white rounded-lg shadow-sm flex flex-col items-center justify-center"
                >
                  <div className="text-xl sm:text-2xl mb-2">{f.icon}</div>
                  <p className="text-xs sm:text-sm font-medium">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 sm:py-12 md:py-16 bg-gray-900 text-white">
          <div className="container mx-auto max-w-4xl text-center px-4 sm:px-6">
            <h3 className="text-lg sm:text-2xl md:text-3xl font-bold mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-sm sm:text-base md:text-lg mb-6 opacity-90">
              Join thousands of students and drivers using Finder for seamless
              bus tracking
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleStudent}
                className="border border-white text-white hover:bg-white hover:text-gray-900 px-5 py-3 rounded-full font-semibold transition-colors duration-300 text-sm sm:text-base"
              >
                Student Login
              </button>
              <button
                onClick={handleDriver}
                className="border border-white text-white hover:bg-white hover:text-gray-900 px-5 py-3 rounded-full font-semibold transition-colors duration-300 text-sm sm:text-base"
              >
                Driver Login
              </button>
            </div>
          </div>
        </section>
      </div>

      <BusComponent />
    </>
  );
};

export default NavbarContent;
