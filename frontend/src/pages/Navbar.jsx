import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/authContext.js";
import toast from "react-hot-toast";

export const Navbar = () => {
  const navigate = useNavigate();
  const { currentStudent, currentDriver, driverLogout, studentLogout } = useContext(AuthContext);

  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    "Home",
    "About",
    "How it works",
    "msb Apps",
    "Benefits",
    "Testimonials",
    "Contact",
  ];

  const handleNavClick = (item) => {
    setActiveSection(item.toLowerCase().replace(" ", "-"));
    setMobileMenuOpen(false);
  };

  const handleGetStarted = () => navigate("/register");



  const handleLogout = async () => {
    if (currentStudent) {
      await studentLogout(); // wait for logout to finish
      toast.success(` ${currentStudent}  Logout successfully`);
      navigate("/");
    } else {
      await driverLogout(); // wait for logout to finish
      toast.success(` ${currentDriver}  Logout successfully`);
      navigate("/");
    }
  };


  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled
        ? "bg-white/95 backdrop-blur-md shadow-md"
        : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo / Brand */}
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              pryskeo!
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-600 hidden md:block">
              track easy manage smart
            </p>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex items-center space-x-2">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  onClick={() => handleNavClick(item)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all relative group ${activeSection === item.toLowerCase().replace(" ", "-")
                    ? "text-purple-600 font-semibold"
                    : "text-gray-700 hover:text-purple-500"
                    }`}
                >
                  {item}
                  {activeSection === item.toLowerCase().replace(" ", "-") && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full"></span>
                  )}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>

          {/* CTA / Profile button */}
          <div className="hidden md:block">
            {currentStudent || currentDriver ? (
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
              >
                Get Started
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-purple-600 transition"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ${mobileMenuOpen
          ? "max-h-screen opacity-100 bg-white/95 backdrop-blur-md border-t"
          : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              onClick={() => handleNavClick(item)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all ${activeSection === item.toLowerCase().replace(" ", "-")
                ? "text-purple-600 bg-purple-50 font-semibold"
                : "text-gray-700 hover:text-purple-600 hover:bg-gray-100"
                }`}
            >
              {item}
            </a>
          ))}

          {/* Mobile CTA */}
          {currentStudent || currentDriver ? (
            <button

              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              My Profile
            </button>
          ) : (
            <button
              onClick={handleGetStarted}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
