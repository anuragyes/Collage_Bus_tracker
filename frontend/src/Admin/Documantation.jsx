
import React, { useState } from 'react';
import "../Admin/Documantation.css"

const Documentation = () => {
  const [activeTab, setActiveTab] = useState('detailed');
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: "🚌",
      title: "Real-time Bus Tracking",
      description: "Live location updates with Google Maps integration"
    },
    {
      icon: "🔔",
      title: "Smart Notifications",
      description: "Automatic alerts when buses are within 2km radius"
    },
    {
      icon: "👥",
      title: "Multi-role Access",
      description: "Separate dashboards for students, drivers, and admins"
    },
    {
      icon: "🛡️",
      title: "Secure Authentication",
      description: "Role-based access control with admin oversight"
    },
    {
      icon: "📊",
      title: "Admin Dashboard",
      description: "Comprehensive overview of all system operations"
    },
    {
      icon: "⚡",
      title: "Real-time Updates",
      description: "Instant synchronization using Socket.io technology"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">
            Bus Tracking System
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Advanced Real-time Bus Monitoring Solution for Educational Institutions
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Get Started
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:bg-opacity-10 transition-all duration-300">
              View Demo
            </button>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-pink-300 rounded-full opacity-20 animate-bounce"></div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-1 inline-flex">
          <button
            className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'detailed'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('detailed')}
          >
            📖 Detailed Documentation
          </button>
          <button
            className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'concise'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('concise')}
          >
            ⚡ Quick Overview
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Key Features</h2>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Discover the powerful capabilities of our comprehensive bus tracking system
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {activeTab === 'detailed' ? <DetailedDocumentation /> : <ConciseDocumentation />}
        </div>
      </div>

      {/* CTA Section */}
     <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
  {/* Main CTA Container */}
  <div className="relative bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-700 rounded-3xl p-12 text-center text-white overflow-hidden">
    
    {/* Animated Background Elements */}
    <div className="absolute inset-0 bg-black opacity-5"></div>
    
    {/* Floating Shapes */}
    <div className="absolute -top-20 -left-20 w-40 h-40 bg-white rounded-full opacity-10 animate-float"></div>
    <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-yellow-300 rounded-full opacity-20 animate-float-delayed"></div>
    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-300 rounded-full opacity-15 animate-pulse"></div>
    <div className="absolute bottom-10 right-1/3 w-24 h-24 bg-cyan-300 rounded-full opacity-10 animate-bounce-slow"></div>
    
    {/* Grid Pattern Overlay */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
    
    {/* Glow Effects */}
    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
    
    <div className="relative z-10">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/30">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        <span className="text-sm font-semibold">Trusted by 500+ Institutions Worldwide</span>
      </div>

      {/* Main Heading */}
      <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
        Ready to <span className="bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">Transform</span> Your Transportation?
      </h2>

      {/* Subheading */}
      <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed text-blue-100">
        Join the future of smart campus transportation with our AI-powered tracking system that's revolutionizing student mobility
      </p>

      {/* Stats Row */}
      <div className="flex flex-wrap justify-center gap-8 mb-12">
        {[
          { number: "99.9%", label: "System Uptime" },
          { number: "2M+", label: "Trips Tracked" },
          { number: "50+", label: "Countries" },
          { number: "24/7", label: "Support" }
        ].map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
            <div className="text-blue-100 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-8">
        {/* Primary Button */}
        <button className="group relative bg-gradient-to-r from-white to-gray-100 text-emerald-600 px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-2xl min-w-[200px]">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <span className="relative z-10 flex items-center justify-center gap-3">
            🚀 Start Free Trial
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>

        {/* Secondary Button */}
        <button className="group relative border-2 border-white/50 text-white px-10 py-5 rounded-2xl font-bold text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 min-w-[200px]">
          <span className="relative z-10 flex items-center justify-center gap-3">
            📅 Schedule Demo
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
        </button>
      </div>

      {/* Trust Indicators */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4 text-blue-100 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            No credit card required
          </div>
          <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            Setup in 15 minutes
          </div>
          <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            Free onboarding
          </div>
        </div>

        {/* Client Logos */}
        <div className="flex items-center gap-8 mt-6 opacity-80">
          {["🏫", "🎓", "📚", "🌟", "⚡"].map((logo, index) => (
            <div key={index} className="text-2xl opacity-70 hover:opacity-100 transition-opacity duration-300">
              {logo}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>

 
 
</section>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 Bus Tracking System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const DetailedDocumentation = () => {
  return (
    <div className="p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Complete System Documentation</h2>
        
        {/* Project Overview */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border-l-4 border-blue-500">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🚀 Project Overview</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              The <strong>Bus Tracking Website</strong> is a sophisticated MERN stack application designed 
              specifically for educational institutions. Our platform provides real-time bus tracking 
              capabilities with multi-tiered access control, enabling seamless communication between 
              administrators, drivers, and students through advanced Google Maps integration and 
              Socket.io real-time technology.
            </p>
          </div>
        </section>

        {/* User Roles Section */}
        <section className="mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">👥 User Roles & Access Flow</h3>
          
          <div className="space-y-6">
            {/* Client Card */}
            <div className="bg-white border-2 border-blue-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  👤
                </div>
                <h4 className="text-2xl font-bold text-gray-800">Client/Visitor Access</h4>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">✓</div>
                  <span>Access landing page with prominent "Get Started" button</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">✓</div>
                  <span>Complete streamlined registration process (signup → login)</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">✓</div>
                  <span>Gain exclusive access to dedicated contact page post-authentication</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">✓</div>
                  <span>Direct communication channel with our support team</span>
                </li>
              </ul>
            </div>

            {/* Student Card */}
            <div className="bg-white border-2 border-green-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  🎓
                </div>
                <h4 className="text-2xl font-bold text-gray-800">Student Access Portal</h4>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">✓</div>
                  <span>Admin-controlled access system requiring subscription payment</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">✓</div>
                  <span>Unique credentials provided securely by administrator</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">✓</div>
                  <span>Interactive student dashboard with real-time bus tracking</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">✓</div>
                  <span>Smart proximity notifications (2km radius alerts with sound)</span>
                </li>
              </ul>
            </div>

            {/* Driver Card */}
            <div className="bg-white border-2 border-yellow-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  🚗
                </div>
                <h4 className="text-2xl font-bold text-gray-800">Driver Management System</h4>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">✓</div>
                  <span>Secure admin-issued credentials for system access</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">✓</div>
                  <span>Specialized driver dashboard with ride initiation capabilities</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">✓</div>
                  <span>Real-time location sharing (self-visibility only for privacy)</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">✓</div>
                  <span>Advanced bus assignment validation to prevent conflicts</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Technical Architecture */}
      <section className="mb-16 relative">
  {/* Background Decoration */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl -z-10"></div>
  
  <div className="text-center mb-12">
    <div className="inline-flex items-center justify-center mb-4">
      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
        <span className="text-2xl">⚙️</span>
      </div>
      <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Technical Architecture
      </h3>
    </div>
    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
      Powered by cutting-edge technologies for seamless real-time performance
    </p>
  </div>

  {/* Animated Tech Stack Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
    {/* Connecting Lines - Desktop Only */}
    <div className="hidden lg:block absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 transform -translate-y-4"></div>
      <div className="absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-purple-200 to-blue-200 transform -translate-y-4"></div>
    </div>

    {[
      { 
        tech: "React.js", 
        desc: "Modern frontend with responsive design", 
        color: "blue",
        icon: "⚛️",
        features: ["Component-based", "Hooks", "State Management"]
      },
      { 
        tech: "Node.js + Express", 
        desc: "Robust backend API server", 
        color: "green",
        icon: "🚀",
        features: ["RESTful APIs", "Middleware", "Scalable"]
      },
      { 
        tech: "MongoDB", 
        desc: "Scalable NoSQL database", 
        color: "yellow",
        icon: "🗄️",
        features: ["Document Storage", "Flexible Schema", "High Performance"]
      },
      { 
        tech: "Socket.io", 
        desc: "Real-time bidirectional communication", 
        color: "purple",
        icon: "🔌",
        features: ["WebSockets", "Event-driven", "Low Latency"]
      },
      { 
        tech: "Google Maps API", 
        desc: "Advanced mapping and geolocation", 
        color: "red",
        icon: "🗺️",
        features: ["Live Tracking", "Geocoding", "Route Optimization"]
      },
      { 
        tech: "JWT Authentication", 
        desc: "Secure role-based access control", 
        color: "indigo",
        icon: "🔐",
        features: ["Token-based", "Stateless", "Secure"]
      }
    ].map((item, index) => (
      <div 
        key={index}
        className="group relative"
      >
        {/* Hover Effect Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl transform group-hover:scale-105 transition-all duration-500 opacity-0 group-hover:opacity-100 shadow-xl"></div>
        
        {/* Main Card */}
        <div className="relative bg-white rounded-2xl p-8 border-2 border-gray-100 group-hover:border-transparent transition-all duration-500 group-hover:shadow-2xl h-full flex flex-col">
          
          {/* Icon with Gradient Background */}
          <div className={`w-20 h-20 bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
            <span className="text-3xl">{item.icon}</span>
          </div>
          
          {/* Tech Name */}
          <h4 className={`text-2xl font-bold text-${item.color}-700 mb-3 text-center group-hover:text-${item.color}-800 transition-colors duration-300`}>
            {item.tech}
          </h4>
          
          {/* Description */}
          <p className="text-gray-600 text-center mb-6 flex-grow">
            {item.desc}
          </p>
          
          {/* Features List */}
          <div className="space-y-2 mb-6">
            {item.features.map((feature, featureIndex) => (
              <div 
                key={featureIndex}
                className="flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300"
              >
                <div className={`w-2 h-2 bg-${item.color}-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300`}></div>
                {feature}
              </div>
            ))}
          </div>
          
          {/* Animated Border Bottom */}
          <div className={`h-1 bg-gradient-to-r from-${item.color}-400 to-${item.color}-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-100 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 flex items-center justify-center">
          <div className={`w-3 h-3 bg-${item.color}-500 rounded-full animate-ping`}></div>
        </div>
      </div>
    ))}
  </div>

  {/* Architecture Flow Diagram */}
  <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border-2 border-white">
    <h4 className="text-2xl font-bold text-center text-gray-800 mb-8">🚀 System Architecture Flow</h4>
    
    <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
      {/* Frontend */}
      <div className="text-center flex-1">
        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-2xl">⚛️</span>
        </div>
        <h5 className="font-bold text-blue-600 mb-2">Frontend</h5>
        <p className="text-sm text-gray-600">React.js</p>
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-center">
        <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
        <div className="w-4 h-4 border-t-2 border-r-2 border-purple-500 transform rotate-45"></div>
      </div>

      {/* Backend */}
      <div className="text-center flex-1">
        <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-2xl">🚀</span>
        </div>
        <h5 className="font-bold text-green-600 mb-2">Backend</h5>
        <p className="text-sm text-gray-600">Node.js + Express</p>
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-center">
        <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"></div>
        <div className="w-4 h-4 border-t-2 border-r-2 border-yellow-500 transform rotate-45"></div>
      </div>

      {/* Database */}
      <div className="text-center flex-1">
        <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-2xl">🗄️</span>
        </div>
        <h5 className="font-bold text-yellow-600 mb-2">Database</h5>
        <p className="text-sm text-gray-600">MongoDB</p>
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-center">
        <div className="w-12 h-1 bg-gradient-to-r from-yellow-400 to-purple-400 rounded-full"></div>
        <div className="w-4 h-4 border-t-2 border-r-2 border-purple-500 transform rotate-45"></div>
      </div>

      {/* Real-time */}
      <div className="text-center flex-1">
        <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-2xl">🔌</span>
        </div>
        <h5 className="font-bold text-purple-600 mb-2">Real-time</h5>
        <p className="text-sm text-gray-600">Socket.io</p>
      </div>
    </div>
  </div>

  {/* Performance Metrics */}
  <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
    {[
      { metric: "99.9%", label: "Uptime", icon: "📈" },
      { metric: "< 100ms", label: "Response Time", icon: "⚡" },
      { metric: "10k+", label: "Concurrent Users", icon: "👥" },
      { metric: "24/7", label: "Monitoring", icon: "🔍" }
    ].map((item, index) => (
      <div key={index} className="text-center p-6 bg-white rounded-2xl border-2 border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="text-3xl mb-2">{item.icon}</div>
        <div className="text-2xl font-bold text-gray-800 mb-1">{item.metric}</div>
        <div className="text-gray-600 text-sm">{item.label}</div>
      </div>
    ))}
  </div>
</section>
      </div>
    </div>
  );
};

const ConciseDocumentation = () => {
  const quickSteps = [
    {
      step: "1",
      title: "For Clients",
      description: "Get Started → Register → Login → Contact Team",
      color: "from-blue-400 to-blue-600"
    },
    {
      step: "2",
      title: "For Students",
      description: "Pay Subscription → Get Credentials → Access Tracking",
      color: "from-green-400 to-green-600"
    },
    {
      step: "3", 
      title: "For Drivers",
      description: "Receive Credentials → Start Rides → Share Location",
      color: "from-purple-400 to-purple-600"
    },
    {
      step: "4",
      title: "For Admins",
      description: "Manage All Users → Monitor System → Generate Reports",
      color: "from-orange-400 to-orange-600"
    }
  ];

  return (
    <div className="p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">⚡ Quick Start Guide</h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Everything you need to know to get started with our bus tracking system in minutes
        </p>

        {/* Quick Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {quickSteps.map((step, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4`}>
                {step.step}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">🎯 Core Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">✓</div>
              <span className="text-gray-700">Real-time bus location tracking</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">✓</div>
              <span className="text-gray-700">2km proximity alerts with sound</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">✓</div>
              <span className="text-gray-700">Multi-role dashboard access</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">✓</div>
              <span className="text-gray-700">Admin oversight and control</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">✓</div>
              <span className="text-gray-700">Bus assignment conflict prevention</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">✓</div>
              <span className="text-gray-700">Live Google Maps integration</span>
            </div>
          </div>
        </div>

        {/* System Requirements */}
      <div className="group relative">
  {/* Animated Background Effect */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl transform group-hover:scale-105 transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
  
  {/* Glow Border */}
  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500 group-hover:duration-200"></div>

  {/* Main Card */}
  <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-10 border-2 border-gray-100/50 group-hover:border-transparent transition-all duration-500 shadow-lg group-hover:shadow-2xl">
    
    {/* Header with Animated Icon */}
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
        <span className="text-3xl">⚡</span>
      </div>
      <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
        System Requirements
      </h3>
      <p className="text-gray-600 text-lg">
        Everything you need for seamless bus tracking experience
      </p>
    </div>

    {/* Requirements Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[
        {
          icon: "🌐",
          title: "Web Browser",
          requirements: ["Chrome 90+", "Firefox 88+", "Safari 14+", "Edge 90+"],
          status: "Essential",
          color: "blue"
        },
        {
          icon: "📶",
          title: "Connectivity",
          requirements: ["5Mbps Internet", "WiFi/4G/5G", "WebSocket Support"],
          status: "Critical",
          color: "green"
        },
        {
          icon: "📍",
          title: "Location Services",
          requirements: ["GPS Hardware", "Location Permission", "Modern Device"],
          status: "Required",
          color: "purple"
        }
      ].map((item, index) => (
        <div 
          key={index}
          className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-200/50 hover:border-transparent group/item transition-all duration-500 hover:shadow-xl"
        >
          {/* Status Badge */}
          <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 bg-${item.color}-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg`}>
            {item.status}
          </div>
          
          {/* Icon */}
          <div className="text-4xl text-center mb-4 group-hover/item:scale-110 transition-transform duration-300">
            {item.icon}
          </div>
          
          {/* Title */}
          <h4 className="text-xl font-bold text-gray-800 text-center mb-4">
            {item.title}
          </h4>
          
          {/* Requirements List */}
          <ul className="space-y-3">
            {item.requirements.map((req, reqIndex) => (
              <li key={reqIndex} className="flex items-center text-gray-600 text-sm">
                <div className={`w-2 h-2 bg-${item.color}-400 rounded-full mr-3 flex-shrink-0`}></div>
                {req}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Compatibility Section */}
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200/30">
      <h4 className="text-xl font-bold text-gray-800 text-center mb-6 flex items-center justify-center gap-3">
        <span className="text-2xl">✅</span>
        Full Compatibility Assurance
      </h4>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { icon: "📱", label: "Mobile", devices: "iOS & Android" },
          { icon: "💻", label: "Desktop", devices: "Windows & Mac" },
          { icon: "🖥️", label: "Tablet", devices: "iPad & Android" },
          { icon: "🌍", label: "Browser", devices: "All Modern" }
        ].map((device, index) => (
          <div key={index} className="group/device">
            <div className="text-3xl mb-2 group-hover/device:scale-110 transition-transform duration-300">
              {device.icon}
            </div>
            <div className="font-semibold text-gray-800">{device.label}</div>
            <div className="text-sm text-gray-600">{device.devices}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Performance Metrics */}
    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { value: "< 3s", label: "Load Time", icon: "⚡" },
        { value: "99.9%", label: "Reliability", icon: "🛡️" },
        { value: "A Grade", label: "Security", icon: "🔒" },
        { value: "24/7", label: "Support", icon: "🎯" }
      ].map((metric, index) => (
        <div 
          key={index}
          className="bg-white rounded-xl p-4 text-center border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md"
        >
          <div className="text-2xl mb-2">{metric.icon}</div>
          <div className="text-lg font-bold text-gray-800">{metric.value}</div>
          <div className="text-xs text-gray-600">{metric.label}</div>
        </div>
      ))}
    </div>

    {/* Call to Action */}
    <div className="mt-8 text-center">
      <button className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 group/btn">
        <span>Check Compatibility</span>
        <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <p className="text-gray-500 text-sm mt-4">
        Free compatibility check • No installation required
      </p>
    </div>
  </div>

  {/* Floating Elements */}
  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300 animate-ping"></div>
  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-500"></div>
</div>
      </div>
    </div>
  );
};

export default Documentation;