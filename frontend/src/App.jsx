import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import Register from './pages/Register';
import NavbarContent from './pages/NavbarContent';
import BusMap from './pages/BusMap';
import StudentMapDashboard from './pages/StudentMapDashboard';
import StudentAccessPage from './pages/StudentAccessProfile';
import DriverAccessPage from './pages/DriverAccessProfile';
import TestimonialGrid from './pages/TestimonialGrid';
import BusComponent from './pages/Buscomponent';
import Work from './pages/Work';
import Parent from './pages/Parent';
import { Navbar } from './pages/Navbar';
import Footer from './pages/Footer';
import { ContactRound } from 'lucide-react';
import ContactPage from './pages/Contactpage';

const Layout = () => {
  const location = useLocation();

  // Hide Navbar on these pages
  const hideNavbarPaths = ['/student-dashboard', '/dashboard', '/Footer', '/register'];

  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}

      {/* Wrapper div to add top padding when navbar is visible */}
      <div style={{ paddingTop: showNavbar ? '80px' : '0px' }}>
        <Routes>
          <Route path="/" element={<NavbarContent />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<BusMap />} />
          <Route path="/BusComponent" element={<BusComponent />} />
          <Route path="/Work" element={<Work />} />
          <Route path="/Parent" element={<Parent />} />
          <Route path="/student-dashboard" element={<StudentMapDashboard />} />
          <Route path="/studentaccess" element={<StudentAccessPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/driveraccess" element={<DriverAccessPage />} />
          <Route path="/Testimonials" element={<TestimonialGrid />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default App;

