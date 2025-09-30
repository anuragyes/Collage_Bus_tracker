// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { AuthContext } from "../Context/authContext.js";
// import toast from "react-hot-toast";

// export const Navbar = () => {
//   const navigate = useNavigate();
//   const { currentuser,  AuthLogout } =
//     useContext(AuthContext);

//   const [activeSection, setActiveSection] = useState("home");
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const navItems = [
//     { name: "Home", path: "/" },
//     { name: "About", path: "/BusComponent" },
//     { name: "How it works", path: "/Work" },
//     { name: "Benefits", path: "/Parent" },
//     { name: "Testimonials", path: "/Testimonials" },
//     { name: "Contact", path: "" },
//   ];

//   const handleNavClick = (path) => {
//     navigate(path);
//     setMobileMenuOpen(false);
//   };

//   const handleGetStarted = () => {
//     navigate("/register");
//     setMobileMenuOpen(false);
//   };

//   const handleLogout = async () => {
//     try {
//       if (currentStudent) {
//         await AuthLogout();
//         toast.success(`Student Logout successfully`);
//         navigate("/");
//       } else if (currentDriver) {
//         await driverLogout();
//         toast.success(`Driver Logout successfully`);
//         navigate("/");
//       }
//       setMobileMenuOpen(false);
//     } catch (error) {
//       toast.error("Logout failed. Please try again.");
//     }
//   };

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(!mobileMenuOpen);
//   };

//   const renderAuthButtons = (isMobile = false) => {
//     const baseClasses =
//       "font-medium shadow-md transition-all duration-300 rounded-full";
//     const gradientClasses =
//       "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white";

//     if ( currentuser ) {
//       return (
//         <button
//           onClick={handleLogout}
//           className={`${baseClasses} ${gradientClasses} ${
//             isMobile ? "w-full py-3 rounded-lg" : "px-5 py-2"
//           }`}
//         >
//           Logout
//         </button>
//       );
//     } else {
//       return (
//         <button
//           onClick={handleGetStarted}
//           className={`${baseClasses} ${gradientClasses} ${
//             isMobile ? "w-full py-3 rounded-lg" : "px-5 py-2"
//           }`}
//         >
//           Get Started
//         </button>
//       );
//     }
//   };

//   return (
//     <nav
//       className={`fixed w-full z-50 transition-all duration-300 ${
//         scrolled
//           ? "bg-white/90 backdrop-blur-md shadow-md"
//           : "bg-transparent"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16 md:h-20">
//           {/* Logo */}
//           <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
//             <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//               Finder!
//             </h1>
//             <p className="hidden sm:block text-[11px] text-gray-500">
//               track easy • manage smart
//             </p>
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden lg:flex flex-1 justify-center">
//             <div className="flex items-center space-x-1 xl:space-x-2">
//               {navItems.map((item) => (
//                 <button
//                   key={item.name}
//                   onClick={() => handleNavClick(item.path)}
//                   className={`px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition ${
//                     activeSection === item.path
//                       ? "text-purple-600 font-semibold bg-purple-50"
//                       : "text-gray-700 hover:text-purple-600 hover:bg-gray-100"
//                   }`}
//                 >
//                   {item.name}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Desktop CTA */}
//           <div className="hidden md:flex items-center space-x-4">
//             {renderAuthButtons()}
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="lg:hidden flex items-center space-x-2">
//             <button
//               onClick={toggleMobileMenu}
//               className="p-2 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gray-100 transition"
//               aria-label="Toggle mobile menu"
//             >
//               {mobileMenuOpen ? (
//                 <svg
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               ) : (
//                 <svg
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <div
//         className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
//           mobileMenuOpen ? "max-h-screen opacity-100 bg-white/95 backdrop-blur-md border-t" : "max-h-0 opacity-0"
//         }`}
//       >
//         <div className="px-4 pt-2 pb-6 space-y-2">
//           {navItems.map((item) => (
//             <button
//               key={item.name}
//               onClick={() => handleNavClick(item.path)}
//               className={`block px-4 py-3 rounded-lg text-base font-medium transition ${
//                 activeSection === item.path
//                   ? "text-purple-600 bg-purple-50 font-semibold"
//                   : "text-gray-700 hover:text-purple-600 hover:bg-gray-100"
//               }`}
//             >
//               {item.name}
//             </button>
//           ))}

//           {/* Auth Buttons */}
//           <div className="pt-4 border-t border-gray-200">
//             {renderAuthButtons(true)}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };



import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/authContext.js";
import toast from "react-hot-toast";

export const Navbar = () => {
  const navigate = useNavigate();
  const { currentuser, logout } = useContext(AuthContext);

  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  console.log("this is cireent user n=fom navbar " , currentuser);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/BusComponent" },
    { name: "How it works", path: "/Work" },
    { name: "Benefits", path: "/Parent" },
    { name: "Testimonials", path: "/Testimonials" },
    { name: "Contact", path: "" },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleGetStarted = () => {
    navigate("/register");
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
      setMobileMenuOpen(false);
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const renderAuthButtons = (isMobile = false) => {
    const baseClasses = "font-medium shadow-md transition-all duration-300 rounded-full";
    const gradientClasses =
      "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white";

    if (currentuser) {
      return (
        <button
          onClick={handleLogout}
          className={`${baseClasses} ${gradientClasses} ${isMobile ? "w-full py-3 rounded-lg" : "px-5 py-2"}`}
        >
          Logout
        </button>
      );
    } else {
      return (
        <button
          onClick={handleGetStarted}
          className={`${baseClasses} ${gradientClasses} ${isMobile ? "w-full py-3 rounded-lg" : "px-5 py-2"}`}
        >
          Get Started
        </button>
      );
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Finder!
            </h1>
            <p className="hidden sm:block text-[11px] text-gray-500">track easy • manage smart</p>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex items-center space-x-2 xl:space-x-3">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.path)}
                  className={`px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition ${activeSection === item.path ? "text-purple-600 font-semibold bg-purple-50" : "text-gray-700 hover:text-purple-600 hover:bg-gray-100"
                    }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">{renderAuthButtons()}</div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button onClick={toggleMobileMenu} className="p-2 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gray-100 transition" aria-label="Toggle mobile menu">
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? "max-h-screen opacity-100 bg-white/95 backdrop-blur-md border-t" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.path)}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition ${activeSection === item.path ? "text-purple-600 bg-purple-50 font-semibold" : "text-gray-700 hover:text-purple-600 hover:bg-gray-100"
                }`}
            >
              {item.name}
            </button>
          ))}

          {/* Auth Buttons */}
          <div className="pt-4 border-t border-gray-200">{renderAuthButtons(true)}</div>
        </div>
      </div>
    </nav>
  );
};
