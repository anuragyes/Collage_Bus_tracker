import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaBus } from "react-icons/fa";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: ''
  });

  // ✅ Fetch all drivers
  const fetchDrivers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/driverprofile/Alldriver');
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast.error('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // ✅ Submit new driver and refresh list
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/driverprofile/driversignup', formData);
      toast.success('Driver added successfully!');
      setFormData({ name: '', phoneNumber: '', email: '', password: '' });
      setShowModal(false);
      fetchDrivers(); // ✅ Refresh the driver list again
    } catch (error) {
      console.error('Error adding driver:', error);
      toast.error(error.response?.data?.message || 'Failed to add driver');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading drivers...</p>;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 tracking-tight mb-4">
          Driver Management <span className="text-gray-700">| Total Drivers:</span>
          <span className="text-white bg-blue-600 px-3 py-1 rounded text-2xl ml-2 shadow-md">
            {drivers.length}
          </span>
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          Add Driver
        </button>
      </div>

      {/* Driver Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow mt-6">
        <table className="min-w-full text-sm text-gray-700 border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Contact', 'Email', 'BusNumber', 'Is Driving', 'Joining Date', 'Password'].map((header) => (
                <th key={header} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drivers.map((driver) => (
              <tr key={driver._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{driver.name}</td>
                <td className="px-4 py-2">{driver.phoneNumber}</td>
                <td className="px-4 py-2">{driver.email}</td>
                <td className="px-4 py-2">{driver.busNumber || 'N/A'}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-white text-xs ${driver.isDriving ? 'bg-green-600' : 'bg-red-600'}`}>
                    {driver.isDriving ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-2">{new Date(driver.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2">password123</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Driver Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">Add New Driver</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField label="Full Name" value={formData.name} onChange={(val) => setFormData({ ...formData, name: val })} />
              <InputField label="Phone Number" value={formData.phoneNumber} onChange={(val) => setFormData({ ...formData, phoneNumber: val })} />
              <InputField label="Email" value={formData.email} onChange={(val) => setFormData({ ...formData, email: val })} />
              <InputField label="Password" type="password" value={formData.password} onChange={(val) => setFormData({ ...formData, password: val })} />
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded w-full sm:w-auto">Cancel</button>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto">Add Driver</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Input Component
const InputField = ({ label, value, onChange, type = 'text' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>
);

export default DriverManagement;
