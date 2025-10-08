import React from "react";
import familyImage from "../assets/for-parents.png"; // Replace with 
// correct path
 import studentImg from "../assets/for-schools.png"
import TestimonialGrid from "./TestimonialGrid";

// ✅ Reusable Section
const ParentSection = ({ reverse }) => {
  return (
    <>
      <section className="bg-gray-50 py-16">
        <div
          className={`container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center ${reverse ? "md:flex-row-reverse" : ""
            }`}
        >
          {/* Image */}
          <div className="flex justify-center">
            <img
              src={familyImage}
              alt="Happy family"
              className="rounded-lg shadow-lg w-full max-w-md object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Benefits <br /> For Parents
            </h2>
            <p className="text-gray-600 mb-6">
              Finder us app keeps all the concerned parties in the loop and saves
              everyone trouble. The benefits of the app are multifold:
            </p>
            <ul className="space-y-3 text-gray-700">
              {[
                "The bus is delayed at any point",
                "5 minutes before the bus arrives at the designated point",
                "Once the child boards the school bus or if he doesn't",
                "Once the child departs the school bus",
                "When the bus has reached school",
                "When the bus crosses the speed limit",
                "If the bus is taking an unusual route",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="w-3 h-3 mt-2 mr-3 bg-yellow-500 rounded-full"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>



  <section className="bg-gray-50 py-16">
  <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
    {/* Content */}
    <div className="relative z-10">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        Benefits <br /> For Students
      </h2>
      <p className="text-gray-600 mb-6">
        Finder us app keeps students informed and ensures a safer, smoother travel experience. Key benefits include:
      </p>
      <ul className="space-y-3 text-gray-700">
        {[
          "Receive notifications when the bus is approaching your stop",
          "Know exactly when you board the school bus",
          "Get alerts when you leave the bus",
          "Track your bus in real-time on the map",
          "Receive warnings if the bus is delayed or taking a different route",
          "Feel safer with updates on speed or unusual behavior of the bus",
        ].map((item, idx) => (
          <li key={idx} className="flex items-start">
            <span className="w-3 h-3 mt-2 mr-3 bg-yellow-500 rounded-full"></span>
            {item}
          </li>
        ))}
      </ul>
    </div>

    {/* Image with subtle perspective */}
    <div className="flex justify-center relative">
      <div className="transform perspective-1000 hover:rotate-y-3 hover:rotate-x-2 transition-transform duration-500">
        <img
          src= {studentImg}
          alt="Happy student"
          className="rounded-2xl  w-full  "
        />
        {/* Optional overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent rounded-lg pointer-events-none"></div>
      </div>
    </div>
  </div>
</section>


    </>
  );
};

const Parent = () => {
  return (
    <>
      <ParentSection />          {/* Normal layout */}
      <TestimonialGrid />
    </>
  );
};

export default Parent;
