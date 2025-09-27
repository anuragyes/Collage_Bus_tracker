// src/components/HowItWorks.jsx
import React from "react";
import Tracker from "./Tracker";

const Work = () => {
  return (
   <>
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 py-16 text-center">
      <p className="text-sm mb-2 text-gray-400">Regular notifications sent to parents</p>
      <h1 className="text-4xl md:text-5xl font-semibold mb-6">How It Works</h1>
      <p className="max-w-3xl text-gray-300 mb-10">
        msb pro streamlines the entire school transportation process by integrating real-time tracking and communication for all parties involved. School administrators use the platform to monitor bus routes, track attendance, and manage schedules. Parents receive live updates about their child's journey, including pick-up and drop-off notifications, ensuring transparency and safety. Drivers benefit from clear route instructions, student lists, and the ability to alert school authorities in case of emergencies, creating a seamless and safe experience for everyone.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-full transition">
          msb For Parents
        </button>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-full transition">
          msb For Schools
        </button>
      </div>
    </div>
    <Tracker/>
   </>
  );
};

export default Work;
