import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Public pages
import Register from './pages/Register';
import HistoryManagement from './Admin/HistoryManagement';
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
import ContactPage from './pages/Contactpage';

// Admin components
import Sidebar from './Admin/Sidebar';
import StudentManagement from './Admin/StudentManagement';
import BusManagement from './Admin/BusManagement';
import DriverManagement from './Admin/DriverManagement';
import DashboardHome from './Admin/DashboardHome';
import Header from './Admin/Header';
import Documentation from './Admin/Documantation';
import DriverDetailsPage from './Admin/DriverDetailspage';

// ✅ Admin Layout
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get current active tab from URL
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') return 'dashboard';
    if (path.includes('/admin/students')) return 'students';
    if (path.includes('/admin/buses')) return 'buses';
    if (path.includes('/admin/drivers')) return 'drivers';
    if(path.includes('/admin/history'))  return 'history';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());

  // Update active tab when route changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  // Handle tab change with navigation
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    // Navigate to the corresponding route
    switch (tabId) {
      case 'dashboard':
        navigate('/admin');
        break;
      case 'students':
        navigate('/admin/students');
        break;
      case 'buses':
        navigate('/admin/buses');
        break;
      case 'drivers':
        navigate('/admin/drivers');
        break;
        case 'history':
        navigate('/admin/history');
        break;
      default:
        navigate('/admin');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 relative overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0"
            onClick={() =>
              setSidebarOpen(false)


            }

          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-md z-50 lg:hidden transition-transform duration-300 transform translate-x-0">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                handleTabChange(tab);
                setSidebarOpen(false);
              }}
              setSidebarOpen={setSidebarOpen}
            />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden z-0">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/students" element={<StudentManagement />} />
              <Route path="/buses" element={<BusManagement />} />
              <Route path="/drivers" element={<DriverManagement />} />
              <Route path="/history"  element={<HistoryManagement/>}/>
              <Route path="/drivers/:driverId" element={<DriverDetailsPage/>} />
              {/* Add more admin routes here */}
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

// ✅ Public Layout
const PublicLayout = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/student-dashboard', '/dashboard', '/register'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
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
          <Route path="/Doc" element={<Documentation/>} />
          
        </Routes>
        <Footer />
      </div>
    </>
  );
};

// ✅ Main App
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Layout for all public routes */}
        <Route path="/*" element={<PublicLayout />} />

        {/* Admin Layout - nested routes handled inside AdminLayout */}
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

