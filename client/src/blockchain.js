// 📁 blockchain.js
import { SocivaContractAddress } from "./config";
import SocivaABI from "./utils/socivaContract.json";
import { BrowserProvider, Contract } from "ethers";

export async function registerNote(cid) {
  if (!window.ethereum) {
    throw new Error("🦊 Ethereum wallet not found");
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(SocivaContractAddress, SocivaABI.abi, signer);

    const tx = await contract.createSiv(cid);
    await tx.wait();

    console.log("✅ Note registered on chain:", cid);
  } catch (error) {
    console.error("❌ Blockchain transaction failed:", error);
    throw error;
  }
}
