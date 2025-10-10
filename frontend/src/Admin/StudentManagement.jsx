import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    busRoute: '',
    contact: '',
    email: '',
    subscription: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStudent = {
      id: students.length + 1,
      ...formData,
    };
    setStudents([...students, newStudent]);
    setShowModal(false);
    setFormData({ name: '', grade: '', busRoute: '', contact: '', email: '', subscription: false });
  };

  const handleDelete = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/student/allstudents');

        console.log(response.data[0]);
        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        console.log({ error: error.message });
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading Student List...</p>;

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 tracking-tight mb-4">
          Student Management <span className="text-gray-700">| Total Students:</span>
          <span className="text-white bg-blue-600 px-3 py-1 rounded text-2xl ml-2 shadow-md">
            {students.length}
          </span>
        </h1>
        <button
          onClick={() =>toast.error('Feature coming soon!')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          Add Student
        </button>
      </div>

      {/* Mobile + Tablet Cards View */}
      <div className="space-y-4 lg:hidden">
        {students.map((student) => (
          <div key={student.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">

              <div>
                <span className="font-medium">Contact:</span> 987541255
              </div>
              <div>
                <span className="font-medium">Email:</span> {student.email}
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Subscription:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${student.subscription ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                >
                  {student.subscription ? 'Yes' : 'No'}
                </span>
              </div>


              <div>
                <span className="font-medium">Joining Date:</span> {student.createdAt
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscription</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">joining Date</th>

              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${student.subscription ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {student.subscription ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">986574112</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">

                    {student.createdAt
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to Add Student */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Add New Student</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <inputField label="Name" value={formData.name} onChange={(val) => setFormData({ ...formData, name: val })} />
                  <inputField label="Grade" value={formData.grade} onChange={(val) => setFormData({ ...formData, grade: val })} />
                  <inputField label="Bus Route" value={formData.busRoute} onChange={(val) => setFormData({ ...formData, busRoute: val })} />
                  <inputField label="Contact" value={formData.contact} onChange={(val) => setFormData({ ...formData, contact: val })} />
                  <inputField label="Email" value={formData.email} onChange={(val) => setFormData({ ...formData, email: val })} />
                </div>
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    checked={formData.subscription}
                    onChange={(e) => setFormData({ ...formData, subscription: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Has Subscription</label>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Add Student
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

// Reusable Input Component
const inputField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Enter ${label.toLowerCase()}`}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>
);

export default StudentManagement;
