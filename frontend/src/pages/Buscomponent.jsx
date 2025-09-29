import React from "react";
import Work from "./Work";

const BusComponent = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-b from-blue-50 to-white px-6 sm:px-10 md:px-20 py-12 gap-10">
        {/* Left Section - Text */}
        <div className="flex-1 max-w-xl text-center md:text-left animate-fadein">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-3">
            <span className="text-yellow-500">my</span>
            <span className="text-gray-800">skoolbus</span>
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extralight mt-4 mb-4 leading-snug">
            Your ticket to peace <br className="hidden sm:block" /> of mind!
          </h2>
          <p className="text-gray-600 text-base sm:text-lg mb-6 animate-slideup">
              <span className="text-xl sm:text-xl md:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Finder</span>
              is a powerful mobile app to track the current whereabouts of the bus and get
            real-time updates. Using GPS tracking, parents and school authorities can locate and
            receive instant notifications regarding the school bus trips. Friendly, easy to use, and
            enormously helpful – a companion in your pocket.
          </p>
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 sm:px-10 py-3 rounded-full font-medium shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300">
            Learn More
          </button>
        </div>

        {/* Right Section - Animated Bus Illustration */}
        <div className="flex-1 flex justify-center items-center mt-10 md:mt-0">
          <div className="relative w-full max-w-sm sm:max-w-md">
            <div className="absolute -top-5 -left-5 w-full h-1/2 rounded-3xl bg-gradient-to-tr from-yellow-200 to-yellow-400 opacity-30 filter blur-3xl"></div>
            
            {/* Example animated bus illustration (replace with your preferred animation/GIF/SVG) */}
            <img
              src="https://sethu.ac.in/wp-content/uploads/2017/01/transport.jpg" // animated style bus image
              alt="Animated School Bus"
              className="w-full h-auto object-contain animate-busfloat"
            />
          </div>
        </div>

        {/* Animations */}
        <style>{`
          .animate-fadein {
            animation: fadeIn 1.2s ease forwards;
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(30px);}
            100% { opacity: 1; transform: translateY(0);}
          }

          .animate-slideup {
            animation: slideUp 1s ease 0.4s forwards;
          }
          @keyframes slideUp {
            0% { opacity: 0; transform: translateY(40px);}
            100% { opacity: 1; transform: translateY(0);}
          }

          .animate-busfloat {
            animation: busFloat 3.5s ease-in-out infinite alternate;
          }
          @keyframes busFloat {
            0% { transform: translateY(0px) rotate(-2deg);}
            100% { transform: translateY(-18px) rotate(2deg);}
          }
        `}</style>
      </div>

      <Work />
    </>
  );
};

export default BusComponent;
