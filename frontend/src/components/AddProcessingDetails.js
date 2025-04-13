import React, { useState } from "react";
import { getContract } from "../utils/contract";

const AddProcessingDetails = () => {
  const [form, setForm] = useState({
    batchId: "",
    processType: "",
    facilityName: "",
    location: "",
    certification: "",
    additionalNotes: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.addProcessingDetails(
        form.batchId,
        form.processType,
        form.facilityName,
        form.location,
        form.certification,
        form.additionalNotes
      );
      await tx.wait();
      setMessage("Processing details added successfully.");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-3">Add Processing Details</h2>
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
export default AddProcessingDetails;
