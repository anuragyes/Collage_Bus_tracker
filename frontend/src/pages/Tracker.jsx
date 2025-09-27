
import React from 'react'
import Parent from './Parent';

const PersonIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

// School/Building Icon
const SchoolIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L1 10.5 12 18l11-7.5L12 3zm0 13.06L3.5 10.5 12 5.94 20.5 10.5 12 16.06zM3 19h18v2H3z" />
  </svg>
);

// Bus Icon for "Driver"
const BusIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM18 7H6v3h12V7z" />
  </svg>
);

// Checkmark Icon for "Features"
const CheckIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17l-3.59-3.59L4 14l5 5 10-10-1.41-1.41z" />
  </svg>
);

// --- Logo Card Component (now without box styling) ---

const LogoCard = ({ Icon, title, description, side }) => {
  // Determine alignment based on which side of the phone the card is on
  const isLeft = side === 'left';
  const alignClasses = isLeft ? 'text-left items-start' : 'text-right items-end';

  return (
    // 'group' class remains to enable hover effect on the child icon
    <div className={`group flex flex-col p-0 w-full cursor-pointer h-full justify-center ${isLeft ? 'pr-4' : 'pl-4'}`}>

      {/* Icon and Title Container */}
      <div className={`flex flex-col mb-4 ${alignClasses}`}>
        {/* Icon Wrapper: The icon receives the rotation classes */}
        <div className={`text-yellow-600 mb-2 h-16 w-16 flex items-center justify-center ${isLeft ? 'mr-auto' : 'ml-auto'}`}>
          <Icon
            // Applies a smooth transition and a 360-degree rotation on group hover
            className="h-14 w-14 transition-transform duration-500 ease-in-out group-hover:rotate-[360deg]"
          />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      </div>

      {/* Description and Link */}
      <p className={`text-gray-600 text-base ${isLeft ? 'max-w-xs' : 'ml-auto max-w-xs'}`}>{description}</p>

      <a
        href="#"
        className="mt-4 text-sm font-semibold text-yellow-600 hover:text-yellow-700 transition-colors"
      >
        Learn more
      </a>
    </div>
  );
};
const data = [
  {
    Icon: PersonIcon,
    title: "Parents",
    description: "This is the app that suits the parent's use. SMS notifications or Online App notifications are sent instantly to parents.",
    side: 'left'
  },
  {
    Icon: BusIcon,
    title: "Driver",
    description: "This is the app created for the use of drivers. It is very easy to use and lets the driver to instantly update the whereabouts.",
    side: 'right'
  },
  {
    Icon: SchoolIcon,
    title: "School",
    description: "This is the app designed for school authorities. SMS notifications or Online App notifications are sent.",
    side: 'left'
  },
  {
    Icon: CheckIcon,
    title: "Features",
    description: "msb is packed with features helpful to parents, school authorities and schoolbus drivers too.",
    side: 'right'
  },
];

const Tracker = () => {
  const leftCards = [data[0], data[2]]; // Parents (Top Left), School (Bottom Left)
  const rightCards = [data[1], data[3]]; // Driver (Top Right), Features (Bottom Right)

  // Central Phone Mockup Component
  const phoneMockup = (
    <div className="relative w-48 h-[380px] md:w-64 md:h-[500px] mx-auto my-8 md:my-0 shadow-2xl rounded-[2rem] md:rounded-[3rem] bg-gray-900 overflow-hidden border-[8px] md:border-[12px] border-black">
      {/* Speaker and Camera notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-2 bg-gray-700 rounded-b-md z-10"></div>

      {/* Screen Content (Mock Map - referencing the look from the uploaded image) */}
      <div className="w-full h-full p-1">
        <img
          src="https://placehold.co/600x900/f59e0b/FFFFFF?text=Live+Tracking+Map"
          alt="Mockup of the app's live tracking map"
          className="w-full h-full object-cover rounded-[1.5rem] md:rounded-[2.5rem]"
        />
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-12 font-sans">
        <header className="text-center mb-16">
          <p className="text-base text-gray-500 font-semibold mb-2">For Schools, Parents & Drivers</p>
          <h1 className="text-5xl font-extrabold text-yellow-600 mb-4 tracking-tight">
            myskoolbus Pro
          </h1>
        </header>

        <div className="max-w-7xl mx-auto">

          {/* Desktop Layout: 3 Columns (Left Cards | Phone | Right Cards) */}
          <div className="hidden md:grid md:grid-cols-3 gap-12 items-center min-h-[500px]">

            {/* Left Side Cards (Parents, School) */}
            <div className="flex flex-col justify-between h-full space-y-24">
              {leftCards.map((item, index) => (
                <LogoCard key={index} {...item} side="left" />
              ))}
            </div>

            {/* Center Phone Mockup */}
            <div className="flex justify-center items-center h-full">
              {phoneMockup}
            </div>

            {/* Right Side Cards (Driver, Features) */}
            <div className="flex flex-col justify-between h-full space-y-24">
              {rightCards.map((item, index) => (
                <LogoCard key={index} {...item} side="right" />
              ))}
            </div>
          </div>

          {/* Mobile Layout: Stacked Phone then Cards */}
          <div className="md:hidden flex flex-col items-center">
            {phoneMockup}

            <div className="grid grid-cols-1 gap-12 mt-8 w-full max-w-sm">
              {data.map((item, index) => (
                // On mobile, force all cards to be left-aligned for better stacking
                <LogoCard key={index} {...item} side="left" />
              ))}
            </div>
          </div>
        </div>

        <footer className="mt-20 text-center text-gray-400 text-sm">
          <p>Hover over the icons to see the rotation effect!</p>
        </footer>
      </div>

      <Parent />

    </>
  );
}

export default Tracker