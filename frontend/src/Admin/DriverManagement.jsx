import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaBus } from "react-icons/fa";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    isDriving: false,
  });

  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://collage-bus-tracker-backend.onrender.com/api/driverprofile/Alldriver");
        setDrivers(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch drivers");
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  // Add driver
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://collage-bus-tracker-backend.onrender.com/api/driverprofile/driversignup", formData);
      toast.success("Driver added successfully!");
      setDrivers((prev) => [...prev, res.data.driver]);
      setShowModal(false);
      setFormData({ name: "", phoneNumber: "", email: "", password: "", isDriving: false });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add driver");
    }
  };

  if (loading) return <p className="text-center mt-8 text-gray-600">Loading Driver List...</p>;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
          <FaBus className="inline mr-2" />
          Driver Management{" "}
          <span className="text-gray-700 text-lg font-semibold">| Total:</span>
          <span className="text-white bg-blue-600 px-3 py-1 rounded text-lg ml-1 shadow-md">
            {drivers.length}
          </span>
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto shadow-md transition"
        >
          Add Driver
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto border border-gray-100">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
            <tr>
              {["Name", "Contact", "Email", "Bus Number", "Is Driving", "Joining Date", "Password"].map(
                (header) => (
                  <th key={header} className="px-6 py-3 text-left">{header}</th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {drivers.map((driver) => (
              <tr key={driver._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">{driver.name}</td>
                <td className="px-6 py-4">{driver.phoneNumber}</td>
                <td className="px-6 py-4 break-all">{driver.email}</td>
                <td className="px-6 py-4">{driver.busNumber || "N/A"}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      driver.isDriving ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {driver.isDriving ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(driver.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">password123</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {drivers.map((driver) => (
          <div key={driver._id} className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{driver.name}</h3>
            <p className="text-sm text-gray-600 mb-1"><strong>Email:</strong> {driver.email}</p>
            <p className="text-sm text-gray-600 mb-1"><strong>Phone:</strong> {driver.phoneNumber}</p>
            <p className="text-sm text-gray-600 mb-1"><strong>Bus Number:</strong> {driver.busNumber || "N/A"}</p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Is Driving:</strong>{" "}
              <span className={`${driver.isDriving ? "text-green-600" : "text-red-600"} font-semibold`}>
                {driver.isDriving ? "Yes" : "No"}
              </span>
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Joined:</strong>{" "}
              {new Date(driver.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-sm text-gray-600"><strong>Password:</strong> password123</p>
          </div>
        ))}
      </div>

      {/* Add Driver Modal */}
     {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" style={{
      backgroundImage:
        "url('https://png.pngtree.com/thumb_back/fh260/background/20231008/pngtree-vibrant-small-bus-in-yellow-perfect-for-urban-and-suburban-travel-image_13598158.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Add New Driver</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField label="Full Name" value={formData.name} onChange={(val) => setFormData({ ...formData, name: val })} />
              <InputField label="Phone Number" value={formData.phoneNumber} onChange={(val) => setFormData({ ...formData, phoneNumber: val })} />
              <InputField label="Email" value={formData.email} onChange={(val) => setFormData({ ...formData, email: val })} />
              <InputField label="Password" type="password" value={formData.password} onChange={(val) => setFormData({ ...formData, password: val })} />

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg w-full sm:w-auto">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto">
                  Add Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Input Component
const InputField = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Enter ${label.toLowerCase()}`}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      required
    />
  </div>
);

export default DriverManagement;
