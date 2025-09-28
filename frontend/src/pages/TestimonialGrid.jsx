import React from 'react';

// You would typically fetch this data from an API
const testimonials = [
  {
    text: "Exceptional customer support! We had a minor issue, and their team was quick to resolve it, ensuring our operations weren't disrupted.",
    name: "Ben Carter",
    handle: "@bencarterco",
    avatar: "https://randomuser.me/api/portraits/men/25.jpg"
  },
  {
    text: "The real-time tracking feature is a game-changer! Our customers can now see exactly where their bus is, reducing wait times and improving satisfaction.",
    name: "Aisha Sharma",
    handle: "@aishatech",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    text: "Your platform's route optimization has saved our company thousands. We've significantly reduced fuel costs and improved on-time arrivals.",
    name: "David Chen",
    handle: "@dchenlogistics",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    text: "The user interface is so intuitive! Even our non-technical staff find it easy to use for scheduling and monitoring our fleet.",
    name: "Emily Rodriguez",
    handle: "@emily_routes",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    text: "Exceptional customer support! We had a minor issue, and their team was quick to resolve it, ensuring our operations weren't disrupted.",
    name: "Ben Carter",
    handle: "@bencarterco",
    avatar: "https://randomuser.me/api/portraits/men/25.jpg"
  },
  {
    text: "The reporting features are incredibly detailed. We can now analyze performance metrics with ease and make data-driven decisions.",
    name: "Olivia White",
    handle: "@olivia_data",
    avatar: "https://randomuser.me/api/portraits/women/50.jpg"
  },
  {
    text: "Fleet management has never been simpler. The GPS accuracy is top-notch, and we have a clear overview of all our vehicles at all times.",
    name: "Liam Patel",
    handle: "@liampatel_fleet",
    avatar: "https://randomuser.me/api/portraits/men/77.jpg"
  },
  {
    text: "A truly reliable and robust solution. The system has handled our growing fleet without any performance issues.",
    name: "Sophia Lee",
    handle: "@sophialee_inc",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg"
  },
  {
    text: "We integrated your API into our existing app, and it worked flawlessly. The documentation was clear and concise, making the process smooth.",
    name: "Mason Hall",
    handle: "@mason_dev",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    text: "Exceptional customer support! We had a minor issue, and their team was quick to resolve it, ensuring our operations weren't disrupted.",
    name: "Ben Carter",
    handle: "@bencarterco",
    avatar: "https://randomuser.me/api/portraits/men/25.jpg"
  },
  {
    text: "The passenger app integration is fantastic. Our riders love the ability to track their bus and receive real-time notifications.",
    name: "Isabella Garcia",
    handle: "@isabella_trans",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg"
  },
  {
    text: "From trip planning to live tracking, this platform has revolutionized how we manage our bus services. Highly recommended!",
    name: "Jacob Kim",
    handle: "@jacobkim_transport",
    avatar: "https://randomuser.me/api/portraits/men/19.jpg"
  },
];

const TestimonialCard = ({ testimonial }) => (
  <div className="bg-[#1a1c2a] rounded-xl p-8 shadow-md">
    <p className="text-gray-300 leading-relaxed mb-6">"{testimonial.text}"</p>
    <div className="flex items-center">
      <img src={testimonial.avatar} alt={`${testimonial.name}'s avatar`} className="w-12 h-12 rounded-full mr-4 object-cover" />
      <div>
        <span className="block text-white font-bold">{testimonial.name}</span>
        <span className="block text-gray-400 text-sm">{testimonial.handle}</span>
      </div>
    </div>
  </div>
);

const TestimonialGrid = () => {
  return (
    <div className="bg-[#0b0c16] text-white py-16 px-4 font-sans rounded-2xl text-center">
      <h3 className="text-indigo-400 text-base font-medium mb-1">Testimonials</h3>
      <h2 className="text-white text-4xl sm:text-5xl font-bold mb-10">We have worked with thousands of amazing people</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
};

export default TestimonialGrid;