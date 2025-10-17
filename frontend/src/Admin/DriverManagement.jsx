

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaBus, FaUpload, FaFilePdf, FaImage } from "react-icons/fa";
import { Link } from "react-router-dom";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    isDriving: false,
  });
  const [files, setFiles] = useState({
    aadhaar: null,
    license: null,
    photo: null,
  });

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

const handleFileChange = (fileType, selectedFile) => {
  if (selectedFile) {
    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!validImageTypes.includes(selectedFile.type)) {
      toast.error("Only image formats are allowed. PDF uploads are not supported.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB.");
      return;
    }

    setFiles((prev) => ({
      ...prev,
      [fileType]: selectedFile,
    }));
    toast.success(`${fileType} uploaded successfully.`);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => submitData.append(key, formData[key]));
      Object.keys(files).forEach((key) => files[key] && submitData.append(key, files[key]));

      const res = await axios.post(
        "https://collage-bus-tracker-backend.onrender.com/api/driverprofile/driversignup",
        submitData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Driver added successfully!");
      setDrivers((prev) => [...prev, res.data.driver]);
      setShowModal(false);
      setFormData({ name: "", phoneNumber: "", email: "", password: "", isDriving: false });
      setFiles({ aadhaar: null, license: null, photo: null });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add driver");
    } finally {
      setUploading(false);
    }
  };

  const FileUploadField = ({ label, fileType, accept }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center bg-gray-50/60 hover:border-blue-500 transition">
      <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
      {files[fileType] ? (
        <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            {files[fileType].type === "application/pdf" ? (
              <FaFilePdf className="text-red-500" />
            ) : (
              <FaImage className="text-blue-500" />
            )}
            <span className="text-sm text-gray-700 truncate max-w-xs">{files[fileType].name}</span>
          </div>
          <button
            type="button"
            onClick={() => setFiles((prev) => ({ ...prev, [fileType]: null }))}
            className="text-red-500 hover:text-red-700 text-sm font-semibold"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <FaUpload className="mx-auto text-gray-400 text-2xl" />
          <p className="text-sm text-gray-500">Upload {label}</p>
          <input
            type="file"
            accept={accept}
            onChange={(e) => handleFileChange(fileType, e.target.files[0])}
            className="hidden"
            id={`file-${fileType}`}
          />
          <label
            htmlFor={`file-${fileType}`}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md transition"
          >
            Choose File
          </label>
        </div>
      )}
    </div>
  );

  if (loading) return <p className="text-center mt-10 text-gray-600 text-lg">Loading Driver List...</p>;

  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
          <FaBus className="inline mr-2 mb-1" />
          Driver Management
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-md w-full sm:w-auto transition"
        >
          + Add Driver
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-x-auto border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gradient-to-r from-blue-50 to-purple-50 text-xs uppercase font-semibold text-gray-600">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Mobile</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Bus Number</th>
              <th className="px-6 py-4 text-left">Driving</th>
              <th className="px-6 py-4 text-left">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {drivers.map((driver, idx) => (
              <tr
                key={driver._id}
                className={`${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-blue-50/50 transition`}
              >
                <td className="px-6 py-3 font-medium text-gray-800">
                  <Link to={`/admin/drivers/${driver._id}`} className="text-blue-600 hover:underline">
                    {driver.name}
                  </Link>
                </td>
                <td className="px-6 py-3">{driver.phoneNumber}</td>
                <td className="px-6 py-3 break-all">{driver.email}</td>
                <td className="px-6 py-3">{driver.busNumber || "N/A"}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      driver.isDriving ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {driver.isDriving ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-6 py-3">
                  {new Date(driver.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
     <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
  {drivers.map((driver) => (
    <Link
      key={driver._id}
      to={`/admin/drivers/${driver._id}`}
      className="block bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:bg-blue-50 transition"
    >
      <h3 className="text-lg font-bold text-blue-600 mb-2">{driver.name}</h3>
      <p className="text-sm text-gray-600 mb-1"><strong>Email:</strong> {driver.email}</p>
      <p className="text-sm text-gray-600 mb-1"><strong>Phone:</strong> {driver.phoneNumber}</p>
      <p className="text-sm text-gray-600 mb-1"><strong>Bus:</strong> {driver.busNumber || "N/A"}</p>
      <p className="text-sm text-gray-600 mb-1">
        <strong>Driving:</strong>{" "}
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
    </Link>
  ))}
</div>

     
       {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"   style={{
      backgroundImage:
        "url('https://png.pngtree.com/thumb_back/fh260/background/20230711/pngtree-rejoice-the-school-gates-are-open-3d-background-with-educational-supplies-image_3831095.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Add New Driver</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField 
                label="Full Name" 
                value={formData.name} 
                onChange={(val) => setFormData({ ...formData, name: val })} 
              />
              <InputField 
                label="Phone Number" 
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
                type="password" 
                value={formData.password} 
                onChange={(val) => setFormData({ ...formData, password: val })} 
              />

              {/* File Upload Fields */}
              <FileUploadField 
                label="Aadhaar Card (Image)" 
                fileType="aadhaar" 
                accept="image/*"
              />
              
              <FileUploadField 
                label="Driver License (Image)" 
                fileType="license" 
                accept="image/*" 
              />
              
              <FileUploadField 
                label="Driver Photo (Image)" 
                fileType="photo" 
                accept="image/*"
              />

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg w-full sm:w-auto"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto disabled:bg-blue-300"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Add Driver"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const InputField = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Enter ${label}`}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
      required
    />
  </div>
);

export default DriverManagement;
