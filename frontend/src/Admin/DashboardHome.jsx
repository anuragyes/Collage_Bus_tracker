


import React from 'react';

const DashboardHome = () => {
  const stats = [
    { 
      label: 'Total Students', 
      value: '1,234', 
      icon: '👨‍🎓', 
      color: 'blue',
      change: '+12%',
      description: 'From last month'
    },
    { 
      label: 'Total Buses', 
      value: '24', 
      icon: '🚌', 
      color: 'green',
      change: '+2',
      description: 'Active vehicles'
    },
    { 
      label: 'Active Drivers', 
      value: '22', 
      icon: '👨‍✈️', 
      color: 'purple',
      change: '100%',
      description: 'All drivers active'
    },
    { 
      label: 'Active Routes', 
      value: '15', 
      color: 'orange',
      icon: '🗺️',
      change: '+1',
      description: 'New route added'
    },
  ];

  const recentActivities = [
    { time: '2 hours ago', action: 'New student registered', user: 'John Doe' },
    { time: '4 hours ago', action: 'Bus assignment updated', user: 'BUS-001' },
    { time: '1 day ago', action: 'Driver schedule modified', user: 'Mike Johnson' },
    { time: '2 days ago', action: 'New bus added to fleet', user: 'BUS-025' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
        <p className="text-blue-100 opacity-90">Here's what's happening with your school transportation today.</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium ${
                    stat.change.includes('+') ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">{stat.description}</span>
                </div>
              </div>
              <div className="text-3xl opacity-80">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

    

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Add Student', icon: '➕', color: 'blue', description: 'Register new student' },
            { label: 'Assign Bus', icon: '🚌', color: 'green', description: 'Manage routes' },
            { label: 'View Reports', icon: '📊', color: 'purple', description: 'Generate insights' },
            { label: 'System Settings', icon: '⚙️', color: 'gray', description: 'Configure system' },
          ].map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{action.icon}</span>
              <span className="text-sm font-medium text-gray-700 text-center">{action.label}</span>
              <span className="text-xs text-gray-500 text-center mt-1">{action.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;