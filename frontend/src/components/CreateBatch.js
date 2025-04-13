// import React, { useState } from "react";
// import { getContract } from "../utils/contract";
// import { QRCode } from 'qrcode.react';

// const CreateBatch = () => {
//   const [formData, setFormData] = useState({
//     productName: "",
//     variety: "",
//     quantity: "",
//     harvestDate: "",
//     organicStatus: "",
//     additionalNotes: ""
//   });
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleCreate = async () => {
//     if (!formData.productName || !formData.variety || !formData.quantity || !formData.harvestDate) {
//       setMessage("Please fill in all required fields.");
//       return;
//     }
  
//     try {
//       setLoading(true);
//       setMessage("");
//       const contract = await getContract();
//       const tx = await contract.createBatch(
//         formData.productName,
//         formData.variety,
//         parseInt(formData.quantity),
//         Math.floor(new Date(formData.harvestDate).getTime() / 1000),
//         formData.organicStatus,
//         formData.additionalNotes
//       );
//       const receipt = await tx.wait();
  
//       // Extract batchId from event logs
//       const event = receipt.logs
//         .map((log) => {
//           try {
//             return contract.interface.parseLog(log);
//           } catch {
//             return null;
//           }
//         })
//         .find((e) => e && e.name === "BatchCreated");
  
//       if (event) {
//         const batchId = event.args.batchId.toString();
//         setMessage(`✅ Batch created successfully! Batch ID: ${batchId}`);
//       } else {
//         setMessage("✅ Batch created, but no Batch ID found in events.");
//       }
  
//       setFormData({
//         productName: "",
//         variety: "",
//         quantity: "",
//         harvestDate: "",
//         organicStatus: "",
//         additionalNotes: ""
//       });
//     } catch (err) {
//       setMessage("❌ Error: " + (err.reason || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   return (
//     <div className="p-6 max-w-md mx-auto bg-white border rounded-2xl shadow-md">
//       <h2 className="text-2xl font-bold mb-4 text-center">Create Product Batch</h2>
//       <div className="space-y-3">
//         <input
//           type="text"
//           name="productName"
//           value={formData.productName}
//           onChange={handleChange}
//           placeholder="Product Name"
//           className="w-full input input-bordered"
//         />
//         <input
//           type="text"
//           name="variety"
//           value={formData.variety}
//           onChange={handleChange}
//           placeholder="Variety"
//           className="w-full input input-bordered"
//         />
//         <input
//           type="number"
//           name="quantity"
//           value={formData.quantity}
//           onChange={handleChange}
//           placeholder="Quantity"
//           className="w-full input input-bordered"
//         />
//         <input
//           type="date"
//           name="harvestDate"
//           value={formData.harvestDate}
//           onChange={handleChange}
//           className="w-full input input-bordered"
//         />
//         <input
//           type="text"
//           name="organicStatus"
//           value={formData.organicStatus}
//           onChange={handleChange}
//           placeholder="Organic Status (e.g. Certified, Non-Organic)"
//           className="w-full input input-bordered"
//         />
//         <textarea
//           name="additionalNotes"
//           value={formData.additionalNotes}
//           onChange={handleChange}
//           placeholder="Additional Notes"
//           className="w-full textarea textarea-bordered"
//         />
//         <button
//           onClick={handleCreate}
//           disabled={loading}
//           className="btn btn-primary w-full"
//         >
//           {loading ? "Creating..." : "Create Batch"}
//         </button>
//         {message && <p className="text-sm text-center mt-2">{message}</p>}
//       </div>
      
//     </div>
    
//   );
// };

// export default CreateBatch;
import React, { useState } from "react";
import { getContract } from "../utils/contract";
import { QRCodeCanvas } from "qrcode.react";  // Use QRCodeCanvas instead

const CreateBatch = () => {
  const [formData, setFormData] = useState({
    productName: "",
    variety: "",
    quantity: "",
    harvestDate: "",
    organicStatus: "",
    additionalNotes: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [batchId, setBatchId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (
      !formData.productName ||
      !formData.variety ||
      !formData.quantity ||
      !formData.harvestDate
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const contract = await getContract();
      const tx = await contract.createBatch(
        formData.productName,
        formData.variety,
        parseInt(formData.quantity),
        Math.floor(new Date(formData.harvestDate).getTime() / 1000),
        formData.organicStatus,
        formData.additionalNotes
      );
      const receipt = await tx.wait();

      const event = receipt.logs
        .map((log) => {
          try {
            return contract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find((e) => e && e.name === "BatchCreated");

      if (event) {
        const newBatchId = event.args.batchId.toString();
        setBatchId(newBatchId);
        setMessage(`✅ Batch created successfully! Batch ID: ${newBatchId}`);
      } else {
        setMessage("✅ Batch created, but no Batch ID found in events.");
      }

      setFormData({
        productName: "",
        variety: "",
        quantity: "",
        harvestDate: "",
        organicStatus: "",
        additionalNotes: "",
      });
    } catch (err) {
      setMessage("❌ Error: " + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white border rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Product Batch</h2>
      <div className="space-y-3">
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full input input-bordered"
        />
        <input
          type="text"
          name="variety"
          value={formData.variety}
          onChange={handleChange}
          placeholder="Variety"
          className="w-full input input-bordered"
        />
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          className="w-full input input-bordered"
        />
        <input
          type="date"
          name="harvestDate"
          value={formData.harvestDate}
          onChange={handleChange}
          className="w-full input input-bordered"
        />
        <input
          type="text"
          name="organicStatus"
          value={formData.organicStatus}
          onChange={handleChange}
          placeholder="Organic Status (e.g. Certified, Non-Organic)"
          className="w-full input input-bordered"
        />
        <textarea
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleChange}
          placeholder="Additional Notes"
          className="w-full textarea textarea-bordered"
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Creating..." : "Create Batch"}
        </button>
        {message && <p className="text-sm text-center mt-2">{message}</p>}
      </div>

      {batchId && (
        <div className="mt-4">
         <center> <h2 className="text-lg font-semibold">Scan QR Code to View Batch</h2>
         <QRCodeCanvas value={`http://localhost:3000/batch/${batchId}`} /></center> 
          {/* <p className="text-center mt-2">Scan this QR to view the batch details.</p> */}
        </div>
      )}
    </div>
  );
};

export default CreateBatch;
