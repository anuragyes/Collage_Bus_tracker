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
    license: '',
    contact: '',
    bus: '',
    status: 'Active'
  });



  // ✅ Fetch all drivers from backend
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/driverprofile/Alldriver');
        console.log(response.data[0]);
        setDrivers(response.data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        toast.error('Failed to load drivers');
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  // ✅ Submit new driver
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/driverprofile/create', formData);
      toast.success('Driver added!');
      setDrivers(prev => [...prev, res.data]);
      setShowModal(false);
      setFormData({ name: '', license: '', contact: '', bus: '', status: 'Active' });
    } catch (error) {
      console.error('Error adding driver:', error);
      toast.error('Failed to add driver');
    }
  };

  // ✅ Delete driver
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/driverprofile/delete/${id}`);
      toast.success('Driver deleted');
      setDrivers(drivers.filter(d => d._id !== id));
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('Failed to delete driver');
    }
  };

  if (loading) return <p>Loading drivers...</p>;

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
          onClick={() =>
            toast.error('Feature coming soon!')
          }
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          Add Driver
        </button>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {drivers.length === 0 ? (
          <p className="text-gray-600">No drivers available. Please add a driver.</p>
        ) : (
          drivers.map((driver) => (
            <div key={driver._id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{driver.name}</h3>
                  <p className="text-sm text-gray-600">Contact: {driver.phoneNumber
                  }</p>
                </div>

              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div><span className="font-medium">Assigned Bus:</span> {driver.
                  busNumber || 'N/A'}</div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Is Driving:</span>
                  <span className={`text-white px-2 py-1 rounded text-xs ${driver.isDriving ? 'bg-green-600' : 'bg-red-500'}`}>
                    {driver.isDriving ? 'Yes' : 'No'}
                  </span>
                </div>

                <div>
                  <span className="font-medium">Joining Date:</span>

                  {new Date(driver.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                  })}
                </div>

                <div><span className="font-medium">Password:</span>password123</div>


              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">BusNumber</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Is Driving</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joining Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Password</th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.map((driver) => (
                <tr key={driver._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{driver.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{driver.phoneNumber
                  }</td>


                  <td className="px-6 py-4 whitespace-nowrap">{driver.
                    busNumber || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-white text-xs ${driver.isDriving ? 'bg-green-600' : 'bg-red-600'}`}>
                      {driver.isDriving ? 'Yes' : 'No'}
                    </span>
                  </td>


                  <td className="px-6   py-4 whitespace-nowrap">{new Date(driver.
                    createdAt).toDateString("en-Us", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true
                    })

                  }</td>

                  <td className="px-6 py-4 whitespace-nowrap">password123</td>
                  <td className="px-6 py-4 whitespace-nowrap">{driver.email}</td>



                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Driver Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Add New Driver</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <inputField label="Full Name" value={formData.name} onChange={(val) => setFormData({ ...formData, name: val })} />
                  <inputField label="Contact" value={formData.contact} onChange={(val) => setFormData({ ...formData, contact: val })} />
                  <inputField label="Assigned Bus" value={formData.bus} onChange={(val) => setFormData({ ...formData, bus: val })} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>
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
                    Add Driver
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

// ✅ Simple reusable input field
const inputField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>
);

export default DriverManagement;
