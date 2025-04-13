import React, { useState } from "react";
import { getContract } from "../utils/contract";

const TransferCustody = () => {
  const [form, setForm] = useState({
    batchId: "",
    newCustodian: "",
    reason: "",
    location: "",
    notes: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTransfer = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.transferCustody(
        form.batchId,
        form.newCustodian,
        form.reason,
        form.location,
        form.notes
      );
      await tx.wait();
      setMessage("Custody transferred successfully.");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-3">Transfer Custody</h2>
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
      <button onClick={handleTransfer} className="btn">Transfer</button>
      <p className="mt-2">{message}</p>
    </div>
  );
};

export default TransferCustody;
