import { create } from "ipfs-http-client";

const API_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const PINATA_API_KEY = "6acc3acafb6a1f19f825"; // Your Pinata API key
const PINATA_SECRET_API_KEY = "66001fa51b401321cfcda182b365f7e279a18a4f3f0f139ed689b608e0e2cf72"; // Your Pinata secret API key

export const uploadToIPFS = async (file) => {
  try {
    if (!file) throw new Error("No file provided for upload.");

    // Prepare the file for upload
    const formData = new FormData();
    formData.append("file", file);

    // Send the file to Pinata
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Failed to upload file to IPFS: ${errorDetails}`);
    }

    const result = await response.json();
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
    return ipfsUrl; // Return the IPFS URL for further use
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    throw error;
  }
};
