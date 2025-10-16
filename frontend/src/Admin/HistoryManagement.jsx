
import React, { useEffect, useState } from "react";
import axios from "axios";

const HistoryManagement = () => {
  const [historyData, setHistoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch history data
  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get("https://collage-bus-tracker-backend.onrender.com/api/History/AllHistory");
      const data = res.data?.allDetails || res.data || [];
      setHistoryData(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load history data. Please try again.");
      setHistoryData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredData = historyData.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item?.driverName?.toLowerCase().includes(search) ||
      item?.email?.toLowerCase().includes(search) ||
      item?.busNumber?.toLowerCase().includes(search)
    );
  });

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 animate-pulse"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="space-y-3 flex-1">
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Driver History
          </h1>
          <p className="text-gray-600 text-lg">View and manage driver activity logs</p>
        </div>

        {/* Search and Controls */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by driver name, email, or bus number..."
              className="w-full pl-10 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white focus:scale-[1.02] hover:shadow-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={fetchHistory}
            disabled={isLoading}
            className="inline-flex items-center px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-600 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg 
              className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isLoading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 shadow-lg transition-all duration-300 animate-fade-in">
            <div className="flex items-center">
              <div className="text-red-500 mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-red-800 flex-1">{error}</div>
              <button
                onClick={fetchHistory}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <h2 className="text-3xl font-bold text-gray-800 mt-2">{historyData.length}</h2>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Drivers</p>
                <h2 className="text-3xl font-bold text-green-600 mt-2">
                  {historyData.filter((item) => item?.driverActive).length}
                </h2>
              </div>
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-300">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Buses</p>
                <h2 className="text-3xl font-bold text-blue-600 mt-2">
                  {historyData.filter((item) => item?.busActive).length}
                </h2>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Filtered Results</p>
                <h2 className="text-3xl font-bold text-purple-600 mt-2">{filteredData.length}</h2>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors duration-300">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-3xl">
          {isLoading ? (
            <div className="p-6">
              <LoadingSkeleton />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
              <p className="text-gray-600 max-w-sm mx-auto">
                {searchTerm ? "Try adjusting your search terms" : "No history data available"}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <tr>
                      {["Driver Name", "Email", "Phone", "Bus Number", "Driver Active", "Bus Active", "Login", "Logout"].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider transition-colors duration-200 hover:bg-white/10"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50">
                    {filteredData.map((item, index) => (
                      <tr
                        key={item?._id || index}
                        className="transition-all duration-200 hover:bg-blue-50/50 hover:scale-[1.01] group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                            {item?.driverName || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item?.email || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item?.phoneNumber || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            {item?.busNumber || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                            item?.driverActive 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {item?.driverActive ? "✅ Active" : "❌ Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                            item?.busActive 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {item?.busActive ? "✅ Active" : "❌ Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {item?.loginTime ? new Date(item.loginTime).toLocaleString() : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {item?.logoutTime ? new Date(item.logoutTime).toLocaleString() : (
                            <span className="text-orange-500 italic animate-pulse">Still active</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4 p-4">
                {filteredData.map((item, index) => (
                  <div
                    key={item?._id || index}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{item?.driverName || "N/A"}</h3>
                          <p className="text-gray-600 text-sm">{item?.email || "N/A"}</p>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {item?.busNumber || "N/A"}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-gray-600">Phone:</span>
                          <p className="text-gray-800">{item?.phoneNumber || "N/A"}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-600">Driver:</span>
                          <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs border ${
                            item?.driverActive 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {item?.driverActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-600">Bus:</span>
                          <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs border ${
                            item?.busActive 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {item?.busActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-gray-600">Login:</span>
                          <span className="text-gray-800 text-right">
                            {item?.loginTime ? new Date(item.loginTime).toLocaleString() : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-gray-600">Logout:</span>
                          <span className="text-gray-800 text-right">
                            {item?.logoutTime ? new Date(item.logoutTime).toLocaleString() : (
                              <span className="text-orange-500 italic animate-pulse">Still active</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryManagement;
