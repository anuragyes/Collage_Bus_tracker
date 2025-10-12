import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    busNumber: "",
    capacity: "",
    route: "",
  });

  // ✅ Fetch all buses
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axios.get("https://collage-bus-tracker-backend.onrender.com/api/bus/allbuses");
        setBuses(response.data);
         console.log(
          "this is the data bus data" , response
         )
      } catch (error) {
        console.error("Error fetching buses:", error);
        toast.error("Failed to load buses");
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  // ✅ Add bus
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://collage-bus-tracker-backend.onrender.com/api/bus/register", {
        busNumber: formData.busNumber,
        capacity: Number(formData.capacity),
        route: formData.route,
      });
      toast.success("Bus registered successfully!");
      setBuses((prev) => [...prev, res.data.bus]);
      setShowModal(false);
      setFormData({ busNumber: "", capacity: "", route: "" });
    } catch (error) {
      console.error("Error registering bus:", error);
      toast.error(error.response?.data?.message || "Failed to register bus");
    }
  };

  // ✅ Delete (frontend only for now)
  const handleDelete = (id) => {
    setBuses(buses.filter((bus) => bus._id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 tracking-tight mb-4">
          Bus Management <span className="text-gray-700">| Total Buses:</span>
          <span className="text-white bg-blue-600 px-3 py-1 rounded text-2xl ml-2 shadow-md">
            {buses.length}
          </span>
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          Add Bus
        </button>
      </div>

      {/* Bus Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {loading && <div>Loading...</div>}
        {!loading &&
          buses.map((bus) => (
            <div key={bus._id} className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    BusNo: {bus.busNumber}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Route: {bus.route || "No route added"}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      bus.status || "Active"
                    )}`}
                  >
                    {bus.status || "Active"}
                  </span>
                  <button
                    onClick={() => handleDelete(bus._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium flex">
                    Capacity: <MdAirlineSeatReclineNormal className="ml-1 mt-0.5" />
                  </span>
                  <span>{bus.capacity} students</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium flex gap-2">
                    Driver: <FaUser className="mt-0.5" />
                  </span>
                  <span>{bus.driverName || "Unknown"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">isAssigned:</span>
                  <span
                    className={
                      bus.isAssigned
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {bus.isAssigned ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="text-blue-600 hover:text-blue-800 text-sm w-full text-center">
                  View Details
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Add Bus Modal */}
          {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" style={{
          backgroundImage:
            "url('https://png.pngtree.com/background/20231030/original/pngtree-conceptual-education-background-for-returning-to-school-picture-image_5783169.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Add New Bus</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Bus Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bus Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter bus number"
                      value={formData.busNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, busNumber: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Route */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Route
                    </label>
                    <input
                      type="text"
                      placeholder="Enter bus route"
                      value={formData.route}
                      onChange={(e) =>
                        setFormData({ ...formData, route: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Capacity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      placeholder="Enter capacity"
                      value={formData.capacity}
                      onChange={(e) =>
                        setFormData({ ...formData, capacity: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
                  >
                    Add Bus
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusManagement;

