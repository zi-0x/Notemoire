// uploadToIPFS.js - Using Pinata for reliable IPFS uploads

const PINATA_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxNGFiNjEwMC1jNmFmLTQwMTYtYTYxMC0yNmQ0YjMxNTFhMTUiLCJlbWFpbCI6InNpbmdhcG9vcjEyNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNzIwYjY5MzBjOTVmOGM4MGE1OGQiLCJzY29wZWRLZXlTZWNyZXQiOiIyNDU1MTE0OGZlNDFlZmUxNzFjMjllMDUyOTgxNzc4ZjY1NGZkYTJkOWJhOGZlOTJjMTU0ZjM2NDBkN2U1MjFkIiwiZXhwIjoxNzg1MDYzNjExfQ.jaZ3J_-aHjJIuspBjoLeHzbg777pQ3hig2j3RPdyfcs";
const PINATA_API_URL = "https://api.pinata.cloud";

let connectionTested = false;

async function testConnection() {
  if (connectionTested) return true;

  try {
    console.log("🔧 Testing Pinata connection...");
    const response = await fetch(`${PINATA_API_URL}/data/testAuthentication`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
    });

    if (response.ok) {
      console.log("✅ Pinata connection ready");
      connectionTested = true;
      return true;
    } else {
      throw new Error(`Pinata authentication failed: ${response.status}`);
    }
  } catch (error) {
    console.error("❌ Pinata connection failed:", error);
    throw error;
  }
}

export async function uploadToIPFS(content, fileName = "note.txt") {
  try {
    // Test connection first
    await testConnection();

    // Create file
    const file = new File([content], fileName, { type: "text/plain" });
    console.log("Uploading file:", fileName);

    // Prepare form data
    const formData = new FormData();
    formData.append("file", file);

    // Add metadata for better organization
    const metadata = JSON.stringify({
      name: fileName,
      keyvalues: {
        type: "ipfs-upload",
        timestamp: new Date().toISOString(),
        originalName: fileName,
      },
    });
    formData.append("pinataMetadata", metadata);

    // Upload to Pinata
    const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      const cidStr = result.IpfsHash;
      console.log("Upload returned CID:", cidStr);

      if (!cidStr) throw new Error("Invalid CID from Pinata upload");

      console.log("✅ Uploaded via Pinata. CID:", cidStr);
      return cidStr;
    } else {
      throw new Error(
        result.error?.details || `HTTP ${response.status}: Upload failed`
      );
    }
  } catch (err) {
    console.error("❌ IPFS upload failed:", err);
    throw new Error(`Upload failed: ${err.message}`);
  }
}

export default uploadToIPFS;
