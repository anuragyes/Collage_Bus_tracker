import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    subscription: false,
  });

  // ✅ Fetch students on load
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://collage-bus-tracker-backend.onrender.com/api/student/allstudents");
        setStudents(res.data);
      } catch (error) {
        console.error("Error fetching students:", error.message);
        toast.error("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // ✅ Add student
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://collage-bus-tracker-backend.onrender.com/api/student/signupstudent", formData);
      toast.success("Student added successfully!");
      setStudents((prev) => [...prev, res.data.student]);
      setShowModal(false);
      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        password: "",
        subscription: false,
      });
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Failed to add student");
    }
  };

  if (loading)
    return <p className="text-center mt-8 text-gray-600">Loading Student List...</p>;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
          Student Management{" "}
          <span className="text-gray-700 text-lg font-semibold">| Total:</span>
          <span className="text-white bg-blue-600 px-3 py-1 rounded text-lg ml-1 shadow-md">
            {students.length}
          </span>
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto shadow-md transition"
        >
          Add Student
        </button>
      </div>

      {/* ✅ Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto border border-gray-100">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Subscription</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Contact</th>
              <th className="px-6 py-3 text-left">Joining Date</th>
              <th className="px-6 py-3 text-left">Password</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student._id || student.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">{student.name}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      student.subscription
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {student.subscription ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-6 py-4 break-all">{student.email}</td>
                <td className="px-6 py-4">{student.phoneNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(student.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">student123</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {students.map((student) => (
          <div
            key={student._id || student.id}
            className="bg-white rounded-lg shadow p-4 border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {student.name}
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Email:</strong> {student.email}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Phone:</strong> {student.phoneNumber}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Joined:</strong>{" "}
              {new Date(student.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Subscription:</strong>{" "}
              <span
                className={`font-semibold ${
                  student.subscription ? "text-green-600" : "text-red-600"
                }`}
              >
                {student.subscription ? "Yes" : "No"}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              <strong>Password:</strong> student123
            </p>
          </div>
        ))}
      </div>

      {/* ✅ Add Student Modal */}
     {showModal && (
  <div
    className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center p-4 z-50"
    style={{
      backgroundImage:
        "url('https://png.pngtree.com/thumb_back/fh260/background/20230711/pngtree-rejoice-the-school-gates-are-open-3d-background-with-educational-supplies-image_3831095.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    <div className="bg-white/90 backdrop-blur-md rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
          Add New Student
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Name"
            value={formData.name}
            onChange={(val) => setFormData({ ...formData, name: val })}
          />
          <InputField
            label="Contact Number"
            value={formData.phoneNumber}
            onChange={(val) => setFormData({ ...formData, phoneNumber: val })}
          />
          <InputField
            label="Email"
            value={formData.email}
            onChange={(val) => setFormData({ ...formData, email: val })}
          />
          <InputField
            label="Password"
            value={formData.password}
            onChange={(val) => setFormData({ ...formData, password: val })}
          />

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              checked={formData.subscription}
              onChange={(e) =>
                setFormData({ ...formData, subscription: e.target.checked })
              }
              className="mr-2"
            />
            <label className="text-sm text-gray-700">Has Subscription</label>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
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

// ✅ Reusable Input Component
const InputField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Enter ${label.toLowerCase()}`}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      required
    />
  </div>
);

export default StudentManagement;
