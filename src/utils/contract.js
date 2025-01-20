import Web3 from "web3";
import PointlyUserABI from "../../build/contracts/PointlyUser.json";
import RewardsABI from "../../build/contracts/Rewards.json";
import PointlyVendorABI from "../../build/contracts/PointlyVendor.json";
import CONFIG from "../../migrations/config.js";

const getContractInstance = async (contractName) => {
  console.log("getContractInstance called for contract:", contractName);

  if (!window.ethereum) {
    console.error("Ethereum not found. Please install MetaMask.");
    return null;
  }

  const web3 = new Web3(window.ethereum);

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("MetaMask accounts successfully connected.");
  } catch (error) {
    console.error("Error requesting accounts from MetaMask:", error);
    return null;
  }

  const address = CONFIG[contractName];
  if (!address) {
    console.error(`Address for ${contractName} not found in config.`);
    return null;
  }

  let abi;
  switch (contractName) {
    case "PointlyUser":
      abi = PointlyUserABI.abi;
      break;
    case "Rewards":
      abi = RewardsABI.abi;
      break;
    case "PointlyVendor":
      abi = PointlyVendorABI.abi;
      break;
    default:
      console.error(`ABI for ${contractName} not found.`);
      return null;
  }

  try {
    const contractInstance = new web3.eth.Contract(abi, address);
    console.log(`Created contract instance for ${contractName}:`, contractInstance);
    return contractInstance;
  } catch (error) {
    console.error("Error creating contract instance:", error);
    return null;
  }
};

export default getContractInstance;
