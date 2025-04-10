// src/utils/contract.js

import { ethers } from "ethers";
import contractArtifact from "../abi/FarmProductTracking.json";

let CONTRACT_ABI;
let CONTRACT_ADDRESS;

try {
  if (Array.isArray(contractArtifact)) {
    // ABI is a pure array
    CONTRACT_ABI = contractArtifact;
    CONTRACT_ADDRESS = "0x827576e76F45B0A7f8cDFb920e1a6562a5789058";
  } else {
    CONTRACT_ABI = contractArtifact.abi;
    CONTRACT_ADDRESS = contractArtifact.networks["5777"].address;
  }
} catch (err) {
  console.error("ABI format error: ", err);
}

export const getContract = async () => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      throw new Error("MetaMask not found.");
    }

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    return contract;
  } catch (err) {
    console.error("Contract connection failed:", err);
    throw err;
  }
};
