// src/components/RegisterFarmer.js

import React, { useState } from "react";
import { getContract } from "../utils/contract";

const RegisterFarmer = () => {
  const [form, setForm] = useState({
    name: "",
    location: "",
    contact: "",
    email: "",
    aadhaar: "",
    profilePhotoHash: "",
    certificationStatus: "",
    farmSize: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const contract = await getContract();

      const tx = await contract.registerFarmer(
        form.name,
        form.location,
        form.contact,
        form.email,
        form.aadhaar,
        form.profilePhotoHash,
        form.certificationStatus,
        form.farmSize,
        form.pincode
      );

      await tx.wait();
      setMessage("Farmer registered successfully!");
    } catch (err) {
      console.error(err);
      setMessage(err.reason || "Registration failed. Maybe already registered?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Register Farmer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="text" name="contact" placeholder="Contact Number" value={form.contact} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="text" name="aadhaar" placeholder="Aadhaar Number" value={form.aadhaar} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="text" name="profilePhotoHash" placeholder="Profile Photo Hash / URL" value={form.profilePhotoHash} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="text" name="certificationStatus" placeholder="Certification Status (e.g., Certified/Uncertified)" value={form.certificationStatus} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="text" name="farmSize" placeholder="Farm Size (e.g., 10 acres)" value={form.farmSize} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="text" name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} required className="w-full border p-2 rounded" />

        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          {loading ? "Registering..." : "Register"}
        </button>

        {message && <p className="mt-2 text-center text-sm text-red-600">{message}</p>}
      </form>
    </div>
  );
};

export default RegisterFarmer;
