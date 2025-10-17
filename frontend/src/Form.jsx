import React, { useState } from "react";
import axios from "axios";

const DriverSignupForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    aadhaar: null,
    license: null,
    photo: null,
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    if (e.target.files) {
      setForm({ ...form, [e.target.name]: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!form.name || !form.email || !form.password || !form.phoneNumber) {
      alert("Please fill all required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("phoneNumber", form.phoneNumber);
    if (form.aadhaar) formData.append("aadhaar", form.aadhaar);
    if (form.license) formData.append("license", form.license);
    if (form.photo) formData.append("photo", form.photo);

    try {
      setLoading(true);
      const res = await axios.post("https://collage-bus-tracker-backend.onrender.com /api/driverprofile/driversignup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message);
      console.log(res.data);
      setLoading(false);

      // Reset form
      setForm({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        aadhaar: null,
        license: null,
        photo: null,
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed!");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Driver Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full border p-2 rounded"
          required
        />

        <label className="block font-semibold">Upload Aadhaar</label>
        <input type="file" name="aadhaar" onChange={handleChange} required />

        <label className="block font-semibold">Upload License</label>
        <input type="file" name="license" onChange={handleChange} required />

        <label className="block font-semibold">Upload Photo</label>
        <input type="file" name="photo" onChange={handleChange} required />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
    </div>
  );
};

export default DriverSignupForm;
