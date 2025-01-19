import Web3 from "web3";

const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    console.log("Attempting to load Web3...");

    // Check if Ethereum is available
    if (window.ethereum) {
      console.log("MetaMask detected. Initializing Web3...");
      const web3 = new Web3(window.ethereum);

      // Request accounts from MetaMask
      window.ethereum.request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          console.log("Accounts successfully connected:", accounts); // Log the resolved accounts array
          resolve(web3); // Resolve the promise with the Web3 instance
        })
        .catch((error) => {
          console.error("Error during MetaMask request:", error);
          reject(new Error("MetaMask request failed"));
        });
    } else {
      console.error("MetaMask not found. Please install it.");
      reject(new Error("MetaMask not found"));
    }
  });
};

export default getWeb3;
