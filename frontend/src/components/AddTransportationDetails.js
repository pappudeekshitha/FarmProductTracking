import React, { useState } from "react";
import { getContract } from "../utils/contract";

const AddTransportationDetails = () => {
  const [form, setForm] = useState({
    batchId: "",
    mode: "",
    carrierName: "",
    licensePlate: "",
    routeInfo: "",
    additionalNotes: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.addTransportationDetails(
        form.batchId,
        form.mode,
        form.carrierName,
        form.licensePlate,
        form.routeInfo,
        form.additionalNotes
      );
      await tx.wait();
      setMessage("Transportation details added successfully.");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-3">Add Transportation Details</h2>
      {Object.entries(form).map(([key, value]) => (
        <input
          key={key}
          name={key}
          value={value}
          onChange={handleChange}
          placeholder={key}
          className="input mb-2"
        />
      ))}
      <button onClick={handleSubmit} className="btn">Add</button>
      <p className="mt-2">{message}</p>
    </div>
  );
};

export default AddTransportationDetails;
