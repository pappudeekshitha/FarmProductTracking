import React, { useState } from "react";
import { getContract } from "../utils/contract";

const CreateBatch = () => {
  const [formData, setFormData] = useState({
    productName: "",
    variety: "",
    quantity: "",
    harvestDate: "",
    organicStatus: "",
    additionalNotes: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.createBatch(
        formData.productName,
        formData.variety,
        parseInt(formData.quantity),
        parseInt(formData.harvestDate),
        formData.organicStatus,
        formData.additionalNotes
      );
      await tx.wait();
      setMessage("Batch created successfully!");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-3">Create Product Batch</h2>
      {Object.entries(formData).map(([key, value]) => (
        <input
          key={key}
          name={key}
          value={value}
          onChange={handleChange}
          placeholder={key.replace(/([A-Z])/g, " $1")}
          className="input mb-2"
        />
      ))}
      <button onClick={handleCreate} className="btn">Create</button>
      <p className="mt-2">{message}</p>
    </div>
  );
};

export default CreateBatch;