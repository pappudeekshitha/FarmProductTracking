import React, { useState } from "react";
import { getContract } from "../utils/contract";

const BatchDetails = () => {
  const [batchId, setBatchId] = useState("");
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");

  const fetchDetails = async () => {
    try {
      const contract = await getContract();
      const result = await contract.getBatchDetails(batchId);

      // Manually parse BigInt and other values
      const parsedResult = {
        farmer: result[0],
        product: result[1],
        variety: result[2],
        quantity: result[3].toString(), // BigInt to string
        harvestDate: Number(result[4]), // Unix timestamp
        organicStatus: result[5],
        notes: result[6],
        status: Number(result[7]),
        currentHolder: result[8],
      };

      setDetails(parsedResult);
      setError("");
    } catch (err) {
      setError("Error: " + err.message);
      setDetails(null);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-3">Batch Details</h2>
      <input
        value={batchId}
        onChange={(e) => setBatchId(e.target.value)}
        placeholder="Batch ID"
        className="input mb-2"
      />
      <button onClick={fetchDetails} className="btn">Fetch</button>

      {error && <p className="mt-2 text-red-600">{error}</p>}

      {details && (
        <div className="mt-4 text-sm space-y-1">
          <p><strong>Farmer:</strong> {details.farmer}</p>
          <p><strong>Product:</strong> {details.product}</p>
          <p><strong>Variety:</strong> {details.variety}</p>
          <p><strong>Quantity:</strong> {details.quantity}</p>
          <p><strong>Harvest Date:</strong> {new Date(details.harvestDate * 1000).toLocaleDateString()}</p>
          <p><strong>Organic:</strong> {details.organicStatus}</p>
          <p><strong>Notes:</strong> {details.notes}</p>
          <p><strong>Status:</strong> {["Created", "Processing", "InTransit", "Received"][details.status]}</p>
          <p><strong>Current Holder:</strong> {details.currentHolder}</p>
        </div>
      )}
    </div>
  );
};

export default BatchDetails;
