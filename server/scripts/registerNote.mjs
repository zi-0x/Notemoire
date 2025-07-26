// scripts/registerNote.mjs

import { config as dotenvConfig } from "dotenv";
dotenvConfig();

import hardhat from "hardhat";
const { ethers } = hardhat;

import { isAddress, getAddress } from "ethers";

import uploadToIPFS from "./uploadToIPFS.mjs";

import contractJson from "../artifacts/contracts/NoteRegistry.sol/NoteRegistry.json" assert { type: "json" };

// Read contract address from env, fallback to your hardcoded address
const CONTRACT_ADDRESS = (
  process.env.CONTRACT_ADDRESS || "0x03F4a1Ca2DEC7A56F9eEE25d845BBe1F08fAa236E"
).replace(/[\s\n\r]+/g, ""); // remove whitespace/newlines

async function registerNote(noteText) {
  try {
    console.log("\n📝 Registering new note...");

    // Validate contract address
    if (!isAddress(CONTRACT_ADDRESS)) {
      throw new Error(`Contract address is invalid: "${CONTRACT_ADDRESS}"`);
    }

    const contractAddress = getAddress(CONTRACT_ADDRESS);
    console.log("📍 Contract address to be used:", contractAddress);

    // Load wallet signer
    const [signer] = await ethers.getSigners();
    const signerAddress = await signer.getAddress();
    console.log("👤 Signer address:", signerAddress);

    // Upload note to IPFS
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `note-${timestamp}.txt`;
    const cid = await uploadToIPFS(noteText, fileName);

    console.log("🧠 Note uploaded to IPFS.");
    console.log("🔗 CID:", cid);

    // Connect to contract
    const noteRegistry = new ethers.Contract(
      contractAddress,
      contractJson.abi,
      signer
    );

    // Call smart contract method
    console.log("📤 Sending transaction to smart contract...");
    const tx = await noteRegistry.uploadNote(cid);
    await tx.wait();

    console.log("✅ Note successfully registered on-chain!");
    console.log("📄 IPFS CID:", cid);
    console.log("🔐 Author:", signerAddress);
  } catch (error) {
    console.error("❌ Error registering note:", error.message || error);
    process.exit(1);
  }
}

// Run the script with sample text
registerNote("hello world – test note from registerNote.mjs");
