// w3client.js - Now using Pinata for reliable IPFS uploads

const PINATA_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxNGFiNjEwMC1jNmFmLTQwMTYtYTYxMC0yNmQ0YjMxNTFhMTUiLCJlbWFpbCI6InNpbmdhcG9vcjEyNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNzIwYjY5MzBjOTVmOGM4MGE1OGQiLCJzY29wZWRLZXlTZWNyZXQiOiIyNDU1MTE0OGZlNDFlZmUxNzFjMjllMDUyOTgxNzc4ZjY1NGZkYTJkOWJhOGZlOTJjMTU0ZjM2NDBkN2U1MjFkIiwiZXhwIjoxNzg1MDYzNjExfQ.jaZ3J_-aHjJIuspBjoLeHzbg777pQ3hig2j3RPdyfcs"; // Get this from pinata.cloud dashboard
const PINATA_API_URL = "https://api.pinata.cloud";

let cachedClient = null;

// Create a Pinata-based client that mimics the Storacha interface
function createPinataClient() {
  return {
    // Upload text content as a file and return CID string
    uploadText: async (text) => {
      try {
        console.log("[Pinata] Uploading text to IPFS...");

        const file = new File([text], `siv-${Date.now()}.txt`, {
          type: "text/plain",
        });

        const formData = new FormData();
        formData.append("file", file);

        // Add metadata for better organization
        const metadata = JSON.stringify({
          name: file.name,
          keyvalues: {
            type: "siv-text",
            timestamp: new Date().toISOString(),
          },
        });
        formData.append("pinataMetadata", metadata);

        const response = await fetch(
          `${PINATA_API_URL}/pinning/pinFileToIPFS`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${PINATA_JWT}`,
            },
            body: formData,
          }
        );

        const result = await response.json();

        if (response.ok) {
          console.log("[Pinata] ✅ Text upload successful:", result.IpfsHash);
          return result.IpfsHash; // This is the CID
        } else {
          throw new Error(
            result.error?.details ||
              `HTTP ${response.status}: ${
                result.error?.reason || "Upload failed"
              }`
          );
        }
      } catch (error) {
        console.error("[Pinata] ❌ Error uploading text:", error);
        throw error;
      }
    },

    // Upload file/blob directly and return CID string
    uploadFileWrapper: async (file) => {
      try {
        console.log("[Pinata] Uploading file to IPFS:", file.name);

        const formData = new FormData();
        formData.append("file", file);

        // Add metadata
        const metadata = JSON.stringify({
          name: file.name,
          keyvalues: {
            type: "siv-file",
            originalName: file.name,
            size: file.size,
            timestamp: new Date().toISOString(),
          },
        });
        formData.append("pinataMetadata", metadata);

        const response = await fetch(
          `${PINATA_API_URL}/pinning/pinFileToIPFS`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${PINATA_JWT}`,
            },
            body: formData,
          }
        );

        const result = await response.json();

        if (response.ok) {
          console.log("[Pinata] ✅ File upload successful:", result.IpfsHash);
          return result.IpfsHash; // This is the CID
        } else {
          throw new Error(
            result.error?.details ||
              `HTTP ${response.status}: ${
                result.error?.reason || "Upload failed"
              }`
          );
        }
      } catch (error) {
        console.error("[Pinata] ❌ Error uploading file:", error);
        throw error;
      }
    },

    // Test connection to Pinata
    testConnection: async () => {
      try {
        const response = await fetch(
          `${PINATA_API_URL}/data/testAuthentication`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${PINATA_JWT}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("[Pinata] ✅ Authentication successful:", result.message);
          return true;
        } else {
          throw new Error(`Authentication failed: ${response.status}`);
        }
      } catch (error) {
        console.error("[Pinata] ❌ Connection test failed:", error);
        throw error;
      }
    },
  };
}

export async function createStorachaClient() {
  if (cachedClient) {
    console.log("[Pinata] Using cached client");
    return cachedClient;
  }

  try {
    console.log("[Pinata] Creating IPFS client...");

    // Validate Pinata JWT token
    if (!PINATA_JWT || PINATA_JWT === "YOUR_PINATA_JWT_TOKEN_HERE") {
      throw new Error("❌ Please set your Pinata JWT token in w3client.js");
    }

    const client = createPinataClient();

    // Test the connection
    console.log("[Pinata] Testing connection...");
    await client.testConnection();

    cachedClient = client;
    console.log("[Pinata] ✅ Client ready and cached");

    return client;
  } catch (error) {
    console.error("[Pinata] ❌ Failed to create client:", error);
    throw error;
  }
}

// Optional: Function to retrieve content from IPFS using multiple gateways
export async function fetchFromIPFS(cid) {
  const gateways = [
    `https://gateway.pinata.cloud/ipfs/${cid}`,
    `https://ipfs.io/ipfs/${cid}`,
    `https://${cid}.ipfs.nftstorage.link/`,
    `https://cloudflare-ipfs.com/ipfs/${cid}`,
  ];

  for (const gateway of gateways) {
    try {
      console.log(`[IPFS] Trying gateway: ${gateway}`);
      const response = await fetch(gateway);
      if (response.ok) {
        const content = await response.text();
        console.log(`[IPFS] ✅ Successfully fetched from: ${gateway}`);
        return content;
      }
    } catch (error) {
      console.log(`[IPFS] ❌ Failed to fetch from ${gateway}:`, error.message);
    }
  }
  throw new Error(`Failed to fetch CID ${cid} from all gateways`);
}
