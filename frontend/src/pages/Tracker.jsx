
import React from 'react';
import Parent from './Parent';


// Icons
const PersonIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const SchoolIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L1 10.5 12 18l11-7.5L12 3zm0 13.06L3.5 10.5 12 5.94 20.5 10.5 12 16.06zM3 19h18v2H3z" />
  </svg>
);

const BusIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM18 7H6v3h12V7z" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17l-3.59-3.59L4 14l5 5 10-10-1.41-1.41z" />
  </svg>
);

// Simple Rounded Card Component
const LogoCard = ({ Icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all">
    <div className="bg-yellow-500 w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 ease-in-out hover:rotate-[360deg]">
      <Icon className="w-10 h-10 text-white" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

// Data
const data = [
  { Icon: PersonIcon, title: "Parents", description: "Notifications sent instantly to parents." },
  { Icon: BusIcon, title: "Driver", description: "Easy for drivers to update whereabouts." },
  { Icon: SchoolIcon, title: "School", description: "Designed for school authorities." },
  { Icon: CheckIcon, title: "Features", description: "Packed with features for everyone." },
];

const Tracker = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-12 font-sans">
      <header className="text-center mb-12">
        <p className="text-gray-500 font-semibold mb-2">For Schools, Parents & Drivers</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-yellow-600 mb-6">
          Finder Pro
        </h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((item, index) => (
          <LogoCard key={index} {...item} />
        ))}
      </div>

      <footer className="mt-12 text-center text-gray-400 text-sm">
        <p>Hover over the icons to see the rotation effect!</p>
      </footer>

      <Parent />
    </div>
  );
};

export default Tracker;
