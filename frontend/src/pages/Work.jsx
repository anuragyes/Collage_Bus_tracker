
import React from "react";
import Tracker from "./Tracker";
import { useNavigate } from "react-router-dom";


const Work = () => {
   const navigate = useNavigate();

     const handlestudent = ()=>{
      navigate("/studentaccess")
     }
       const driverhandle = ()=>{
        navigate("/driveraccess")
       }
  return (
    <>
      {/* Hero Section */}
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></span>
            <span className="text-yellow-400 text-sm font-medium">Live Tracking Active</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Never Miss Your
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              School Bus Again
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-3xl text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
            Real-time bus tracking solution that connects students, drivers, and parents 
            for a seamless and safe transportation experience
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button className="group bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg flex items-center gap-2">
              <span>🚌 Track Your Bus Now</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button className="border-2 border-white/30 hover:border-white/60 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              Watch Demo Video
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "500+", label: "Students Tracking" },
              { number: "50+", label: "Active Buses" },
              { number: "99%", label: "On-time Rate" },
              { number: " 9-5", label: "Live Support" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problem Statement Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Problem We Solve
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every day, thousands of students face uncertainty about their school bus location, 
              leading to missed rides, anxious waiting, and safety concerns.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "⏰",
                title: "Uncertain Waiting",
                description: "Students wait endlessly without knowing when their bus will arrive"
              },
              {
                icon: "📍",
                title: "No Live Location",
                description: "No real-time tracking leads to missed buses and confusion"
              },
              {
                icon: "📱",
                title: "Poor Communication",
                description: "No direct connection between students, drivers, and parents"
              }
            ].map((problem, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-4">{problem.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{problem.title}</h3>
                <p className="text-gray-600">{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How BusTracker Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple three-step process that revolutionizes school transportation
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Driver Registration & Route Start",
                description: "Bus drivers register and start their routes through the driver dashboard. They enter their details and begin sharing live location data.",
                icon: "👨‍💼",
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "02",
                title: "Real-time Location Sharing",
                description: "Driver's location, contact details, and bus information are automatically shared with registered students in real-time.",
                icon: "📍",
                color: "from-green-500 to-emerald-500"
              },
              {
                step: "03",
                title: "Student Access & Tracking",
                description: "Students log in to see all nearby buses, track their specific bus, and get accurate arrival times with live location updates.",
                icon: "👨‍🎓",
                color: "from-purple-500 to-pink-500"
              }
            ].map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center gap-8 mb-16 last:mb-0">
                <div className={`flex-shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white text-3xl shadow-lg`}>
                  {step.icon}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <span className="text-sm font-bold text-gray-500">STEP {step.step}</span>
                    <div className="w-8 h-px bg-gray-300"></div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Showcase */}
      <div className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose BusTracker?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive features designed for students, drivers, and educational institutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: "🎯",
                title: "Live Bus Locations",
                description: "See exactly where your bus is in real-time with GPS accuracy"
              },
              {
                icon: "⏱️",
                title: "Accurate ETAs",
                description: "Get precise arrival times so you never miss your bus"
              },
              {
                icon: "👨‍👩‍👧‍👦",
                title: "Parent Notifications",
                description: "Automatic updates sent to parents for complete peace of mind"
              },
              {
                icon: "🛡️",
                title: "Safe & Secure",
                description: "Verified drivers and secure platform for student safety"
              },
              {
                icon: "📊",
                title: "Route Management",
                description: "Efficient route planning and management for institutions"
              },
              {
                icon: "🔔",
                title: "Instant Alerts",
                description: "Get notified about delays, route changes, or emergencies"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-yellow-500">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Ready to Transform Your Commute?
          </h2>
          <p className="text-xl text-black/80 mb-10 max-w-2xl mx-auto">
            Join thousands of students and drivers already using BusTracker for a stress-free transportation experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button  onClick={handlestudent} className="bg-black text-white hover:bg-gray-900 font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg">
              Get Started as Student
            </button>
            <button  onChange={driverhandle} className="bg-white text-black hover:bg-gray-100 font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg">
              Register as Driver
            </button>
          </div>
        </div>
      </div>

      <Tracker />
    </>
  );
};

export default Work;
