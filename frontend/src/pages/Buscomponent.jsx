import React from "react";
import image from "../assets/mybus.jpg"; // Local bus image
import Work from "./Work";

const BusComponent = () => {
  return (
    <>
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-b from-blue-50 to-white px-6 md:px-20 py-12 gap-10">
      
      {/* Left Section - Text */}
      <div className="flex-1 max-w-xl text-center md:text-left animate-fadein">
        <h1 className="text-5xl font-bold leading-tight mb-3">
          <span className="text-yellow-500">my</span>
          <span className="text-gray-800">skoolbus</span>
        </h1>
        <h2 className="text-4xl md:text-5xl font-extralight mt-4 mb-4">
          Your ticket to peace <br /> of mind!
        </h2>
        <p className="text-gray-600 text-lg mb-6 animate-slideup">
          myskoolbus is a powerful mobile app to track the current whereabouts of the bus and get real-time updates. Using GPS tracking, parents and school authorities can locate and receive instant notifications regarding the school bus trips. Friendly, easy to use, and enormously helpful – a companion in your pocket.
        </p>
        <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-10 py-3 rounded-full font-medium shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300">
          Learn More
        </button>
      </div>

      {/* Right Section - Bus Image */}
      <div className="flex-1 flex justify-center items-center mt-10 md:mt-0">
        <div className="relative">
          <div className="absolute -top-5 -left-5 w-[480px] h-[240px] rounded-3xl bg-gradient-to-tr from-yellow-200 to-yellow-400 opacity-30 filter blur-3xl"></div>
          {/* <img
            src=
            alt="School Bus"
            className="w-[460px] h-[220px] object-cover rounded-3xl shadow-2xl border-4 border-white animate-busfloat"
          /> */}
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

    <Work/>
    </>
  );
};

export default BusComponent;
