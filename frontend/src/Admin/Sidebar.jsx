import React from 'react';
import { MdAdminPanelSettings } from "react-icons/md";

const Sidebar = ({ activeTab, setActiveTab, setSidebarOpen, user = { name: "Admin User" } }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'students', label: 'Student Dashboard', icon: '👨‍🎓' },
    { id: 'buses', label: 'Bus Dashboard', icon: '🚌' },
    { id: 'drivers', label: 'Driver Dashboard', icon: '👨‍✈️' },
  ];

  const handleMenuClick = (tabId) => {
    setActiveTab(tabId);
    if (setSidebarOpen) setSidebarOpen(false);
  };

  return (
    <div className="fixed md:static bg-blue-950 w-64 h-full flex flex-col border-r border-gray-800 z-50">
      {/* Logo */}
      <div className="flex items-center justify-center px-6 py-6 border-b border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-lg"><MdAdminPanelSettings /></span>
          </div>
          <h1 className="text-xl font-bold text-white">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Finder
            </span>{" "}
            Admin
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 text-white">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200
                  ${activeTab === item.id
                    ? 'bg-blue-700 text-white shadow-md'
                    : 'text-gray-300 hover:bg-blue-900 hover:text-white'}
                `}
              >
                <span className={`mr-3 text-xl transition-transform ${activeTab === item.id ? 'scale-110 text-yellow-300' : ''}`}>
                  {item.icon}
                </span>
                <span className="font-medium text-left">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-800 px-6 py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{user.name.slice(0, 2).toUpperCase()}</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-200">{user.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
