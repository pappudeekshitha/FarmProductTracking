// src/pages/BatchTrackingPage.jsx
import BatchMap from "./batchMap";
import { useEffect, useState } from "react";
// ✅ Correct path
//import { getContract } from "../utils/contract"
 // make sure this path matches your project

const BatchTrackingPage = ({ batchId }) => {
  const [custodyHistory, setCustodyHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      // OPTIONAL: Replace with smart contract call if `getCustodyHistory` is implemented
      // For now, we'll use mock data
      setCustodyHistory([
        {
          location: "Nashik",
          reason: "Initial Ownership",
          timestamp: 1712934023,
        },
        {
          location: "Mumbai",
          reason: "Transported to Mumbai warehouse",
          timestamp: 1712944823,
        },
        {
          location: "Pune",
          reason: "Processing started",
          timestamp: 1712955623,
        },
      ]);
    };

    fetchHistory();
  }, [batchId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Tracking Batch #{batchId}</h2>
      <BatchMap custodyHistory={custodyHistory} />
    </div>
  );
};

export default BatchTrackingPage;
