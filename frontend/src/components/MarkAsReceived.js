import React, { useState } from "react";
import { getContract } from "../utils/contract";

const MarkAsReceived = () => {
  const [batchId, setBatchId] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [message, setMessage] = useState("");

  const handleReceive = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.markAsReceived(batchId, receiverName);
      await tx.wait();
      setMessage("Batch marked as received.");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-3">Mark Batch as Received</h2>
      <input
        value={batchId}
        onChange={(e) => setBatchId(e.target.value)}
        placeholder="Batch ID"
        className="input mb-2"
      />
      <input
        value={receiverName}
        onChange={(e) => setReceiverName(e.target.value)}
        placeholder="Receiver Name"
        className="input mb-2"
      />
      <button onClick={handleReceive} className="btn">Mark Received</button>
      <p className="mt-2">{message}</p>
    </div>
  );
};

export default MarkAsReceived;