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
      // Ensure we have an array, even if the API response structure is different
      const data = res.data?.allDetails || res.data || [];
      setHistoryData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching history:", err);
      setError("Failed to load history data. Please try again later.");
      setHistoryData([]); // Ensure it's always an array
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Safe filter function with null checks
  const filteredData = (historyData || []).filter((item) => {
    if (!item) return false;
    
    const driverName = item.driverName?.toLowerCase() || "";
    const email = item.email?.toLowerCase() || "";
    const busNumber = item.busNumber?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return driverName.includes(search) || 
           email.includes(search) || 
           busNumber.includes(search);
  });

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow p-4 animate-pulse"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20 mt-2 md:mt-0"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Safe data access helper functions
  const getDriverName = (item) => item?.driverName || "N/A";
  const getEmail = (item) => item?.email || "N/A";
  const getPhoneNumber = (item) => item?.phoneNumber || "N/A";
  const getBusNumber = (item) => item?.busNumber || "N/A";
  const getDriverActive = (item) => item?.driverActive || false;
  const getBusActive = (item) => item?.busActive || false;
  const getLoginTime = (item) => item?.loginTime ? new Date(item.loginTime).toLocaleString() : "N/A";
  const getLogoutTime = (item) => item?.logoutTime ? new Date(item.logoutTime).toLocaleString() : "Still active";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Driver History
          </h1>
          <p className="text-gray-600">Manage and track driver activities</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="relative group">
            <input
              type="text"
              placeholder="🔍 Search by Name, Email, Bus Number..."
              className="w-full p-4 pl-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white focus:scale-[1.02] group-hover:shadow-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <div className="text-sm text-gray-600">Total Records</div>
            <div className="text-2xl font-bold text-gray-800">{historyData?.length || 0}</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <div className="text-sm text-gray-600">Active Drivers</div>
            <div className="text-2xl font-bold text-green-600">
              {(historyData || []).filter(item => item?.driverActive).length}
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <div className="text-sm text-gray-600">Active Buses</div>
            <div className="text-2xl font-bold text-blue-600">
              {(historyData || []).filter(item => item?.busActive).length}
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <div className="text-sm text-gray-600">Filtered</div>
            <div className="text-2xl font-bold text-purple-600">{filteredData.length}</div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="text-red-500 mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-red-800">{error}</div>
              <button
                onClick={fetchHistory}
                className="ml-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {isLoading ? (
            <div className="p-6">
              <LoadingSkeleton />
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
                            {getDriverName(item)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{getEmail(item)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{getPhoneNumber(item)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {getBusNumber(item)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            getDriverActive(item) 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {getDriverActive(item) ? "✅ Active" : "❌ Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            getBusActive(item) 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {getBusActive(item) ? "✅ Active" : "❌ Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {getLoginTime(item)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {item?.logoutTime ? getLogoutTime(item) : (
                            <span className="text-orange-500 italic">Still active</span>
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
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{getDriverName(item)}</h3>
                          <p className="text-gray-600 text-sm">{getEmail(item)}</p>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {getBusNumber(item)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-gray-600">Phone:</span>
                          <p className="text-gray-800">{getPhoneNumber(item)}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-600">Driver:</span>
                          <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            getDriverActive(item) 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {getDriverActive(item) ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-600">Bus:</span>
                          <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            getBusActive(item) 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {getBusActive(item) ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-gray-600">Login:</span>
                          <span className="text-gray-800">{getLoginTime(item)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-gray-600">Logout:</span>
                          <span className="text-gray-800">
                            {item?.logoutTime ? getLogoutTime(item) : (
                              <span className="text-orange-500 italic">Still active</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredData.length === 0 && !isLoading && (
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
              )}
            </>
          )}
        </div>

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchHistory}
            disabled={isLoading}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-2xl shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-600 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </div>
  );
};

export default HistoryManagement;
