import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Bell } from 'lucide-react'; // Using Lucide icons for a clean look
import Work from './Work';


const Buscomponent = () => {
  // Simple state to control visibility/animation start if needed, but primarily driven by CSS
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set loaded state to trigger any delayed/conditional animations if necessary
    setIsLoaded(true);
  }, []);

  // Inline SVG for a stylized school bus
  const BusSVG = () => (
    <svg
      className="w-full  h-auto drop-shadow-xl animate-bus-drive"
      viewBox="0 0 500 200"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Road/Ground Shadow */}
      <rect x="0" y="160" width="500" height="40" fill="#E5E7EB" />
      {/* Bus Body - Yellow/Orange Gradient */}
      <rect
        x="50"
        y="50"
        width="400"
        height="100"
        rx="15"
        fill="url(#busGradient)"
        className="shadow-2xl"
      />
      {/* Windows - Blue */}
      <rect x="70" y="60" width="40" height="30" rx="5" fill="#A0E0FF" />
      <rect x="120" y="60" width="40" height="30" rx="5" fill="#A0E0FF" />
      <rect x="170" y="60" width="40" height="30" rx="5" fill="#A0E0FF" />
      <rect x="220" y="60" width="40" height="30" rx="5" fill="#A0E0FF" />
      <rect x="270" y="60" width="40" height="30" rx="5" fill="#A0E0FF" />
      <rect x="320" y="60" width="40" height="30" rx="5" fill="#A0E0FF" />
      <rect x="370" y="60" width="40" height="30" rx="5" fill="#A0E0FF" />
      {/* Stop Sign/Roof Light */}
      <circle cx="435" cy="45" r="10" fill="#EF4444" className="animate-pulse" />
      {/* Wheels - Black with Silver Hubs */}
      <circle cx="120" cy="150" r="20" fill="#1F2937" />
      <circle cx="380" cy="150" r="20" fill="#1F2937" />
      <circle cx="120" cy="150" r="10" fill="#D1D5DB" />
      <circle cx="380" cy="150" r="10" fill="#D1D5DB" />
      {/* Headlights */}
      <rect x="440" y="100" width="10" height="15" rx="3" fill="#FBBF24" />
      {/* Bus Number */}
      <text x="250" y="125" textAnchor="middle" fontSize="20" fill="#1F2937" fontWeight="bold">
        FINDER
      </text>
      {/* Gradient Definition */}
      <defs>
        <linearGradient id="busGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FBBF24', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#F59E0B', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  );

  const FeatureCard = ({ icon, title, description }) => (
    <div className="flex items-start space-x-4 p-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:scale-[1.02]">
      <div className="p-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 text-white flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screenflex flex-col items-center justify-center bg-gray-300 overflow-hidden relative">
        {/* Background Gradients and Clouds */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-r from-blue-100/50 via-purple-50/50 to-white/50 animate-gradient-shift"></div>
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>

        <main className="relative z-10 w-full max-w-7xl px-6 sm:px-10 md:px-20 py-12 flex flex-col md:flex-row items-center justify-between gap-16">
          {/* Left Section - Text Content */}
          <div className="md:w-1/2 max-w-xl text-center md:text-left">
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-up">
              <span className="text-yellow-500">F</span>
              <span className="text-xl sm:text-2xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">inder</span>
            </h1>
            <h2 className="text-3xl sm:text-4xl font-light text-gray-700 mb-6 animate-fade-in-up animation-delay-300">
              Your ticket to **peace of mind**.
            </h2>
            <p className="text-gray-600 text-lg mb-8 animate-fade-in-up animation-delay-600">
             <span className='text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>Finder!</span> is the powerful mobile app that provides **real-time GPS tracking**
              of your child's school bus. Parents and school administrators get instant,
              reliable location updates and notification alerts. Friendly, secure, and essential
              for modern school safety.
            </p>
            <button className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:scale-[1.03] transition-all duration-300 transform animate-pulse-once">
              Get Started Today
            </button>
          </div>

          {/* Right Section - Animated Bus SVG */}
          <div className="md:w-1/2 flex justify-center items-center mt-12 md:mt-0 relative">
            <div className="w-full max-w-lg p-4">
              <BusSVG />
            </div>
          </div>
        </main>

        {/* Feature Section */}
        <section className="relative z-10 w-full max-w-7xl px-6 sm:px-10 md:px-20 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-fade-in-up animation-delay-900">
            Why Parents Trust Finder
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="w-6 h-6" />}
              title="Real-Time GPS Tracking"
              description="Know the exact location of the bus at all times on a live map."
            />
            <FeatureCard
              icon={<Bell className="w-6 h-6" />}
              title="Instant Alerts"
              description="Receive notifications when the bus is near pickup/drop-off points."
            />
            <FeatureCard
              icon={<Truck className="w-6 h-6" />}
              title="Safety & Reliability"
              description="Monitor routes and driver status for complete peace of mind."
            />
          </div>
        </section>

      </div>

      {/* Global Styles and Keyframe Animations */}
      <style>{`
        /* Tailwind Utilities for Animation Delay */
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .animation-delay-900 {
          animation-delay: 0.9s;
        }

        /* 1. Fade In Up Animation */
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* 2. Bus Driving Animation (Horizontal and Vertical float) */
        .animate-bus-drive {
          animation: busDrive 4s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate,
                     busFloat 3s ease-in-out infinite alternate;
        }
        /* Subtle horizontal motion */
        @keyframes busDrive {
          0% { transform: translateX(0); }
          100% { transform: translateX(10px); }
        }
        /* Vertical float for a 'bumpy' road feel */
        @keyframes busFloat {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.01); }
          100% { transform: translateY(0) scale(1); }
        }

        /* 3. Button Pulse Animation */
        .animate-pulse-once {
            animation: pulseOnce 2s ease-out 1.2s 1;
        }
        @keyframes pulseOnce {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); box-shadow: 0 20px 25px -5px rgba(245, 158, 11, 0.5), 0 10px 10px -5px rgba(245, 158, 11, 0.4); }
          100% { transform: scale(1); }
        }

        /* 4. Background Gradient Shift */
        .animate-gradient-shift {
            animation: gradientShift 15s ease-in-out infinite alternate;
            background-size: 400% 400%;
        }
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }

        /* 5. Cloud Animation */
        .cloud {
            position: absolute;
            background: #fff;
            border-radius: 50%;
            opacity: 0.6;
            filter: blur(5px);
            z-index: 5;
            animation: cloudMove 20s linear infinite;
        }
        .cloud-1 { top: 10%; left: -10%; width: 150px; height: 50px; animation-duration: 25s; }
        .cloud-2 { top: 25%; right: -15%; width: 120px; height: 40px; animation-duration: 35s; animation-delay: 5s; }
        .cloud-3 { top: 5%; left: 30%; width: 200px; height: 60px; animation-duration: 30s; }

        @keyframes cloudMove {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(100vw + 200px)); }
        }
        /* Mobile adjustment for clouds */
        @media (max-width: 768px) {
             .cloud {
                display: none; /* Hide clouds on mobile for simplicity */
             }
        }
      `}</style>

       <Work/>
    </>
  );
};


 export default Buscomponent;