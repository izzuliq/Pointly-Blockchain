import React, { useState, useEffect } from "react";
import getWeb3 from "../utils/getWeb3"; // Assuming getWeb3 handles the web3 instance creation
import getContractInstance from "../utils/contract"; // Assuming this handles contract instantiation
import VendorNavbar from "../components/VendorNavbar";

function VendorTransaction() {
  const [account, setAccount] = useState(null);
  const [userContract, setUserContract] = useState(null); // PointlyUser contract instance
  const [transactionContract, setTransactionContract] = useState(null); // Transaction contract instance
  const [userAddress, setUserAddress] = useState("");
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize Web3 and contract instances on mount
  useEffect(() => {
    const initWeb3AndContracts = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        // Get user and transaction contract instances
        const userInstance = await getContractInstance("PointlyUser");
        const transactionInstance = await getContractInstance("Transaction");
        setUserContract(userInstance);
        setTransactionContract(transactionInstance);

        setLoading(false);
      } catch (err) {
        console.error("Error initializing Web3 or contracts:", err);
        setErrorMessage("Failed to initialize Web3 or contracts. Please try again.");
        setLoading(false);
      }
    };

    initWeb3AndContracts();
  }, []);

  const handleTransaction = async () => {
    if (!userAddress || points <= 0) {
      setErrorMessage("Please provide a valid user address and points.");
      return;
    }

    try {
      setSuccessMessage("");
      setErrorMessage("");

      // Ensure user contract and transaction contract are available
      if (!userContract || !transactionContract) {
        setErrorMessage("Contracts are not loaded.");
        return;
      }

      // Add points to the user via the PointlyUser contract
      const result = await userContract.methods
        .updatePoints(userAddress, points, true) // `true` indicates adding points
        .send({ from: account });

      if (result.status) {
        // Log the transaction in the Transaction contract
        await transactionContract.methods
          .logTransaction(
            userAddress,
            account, // Vendor address (assumed to be the account interacting with the contract)
            points,
            0, // Reward ID (0 since it's just a points update)
            "Points Update", // Transaction type
            true // Success status
          )
          .send({ from: account });

        setSuccessMessage(`Successfully added ${points} points to the user.`);
        setUserAddress(""); // Clear input after success
        setPoints(0); // Reset points field
      } else {
        setErrorMessage("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error("Error in transaction:", error);
      setErrorMessage("Error occurred during the transaction. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="border-t-4 border-purple-600 w-16 h-16 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <VendorNavbar />
      <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto mt-8">
        <h2 className="text-3xl font-cabin text-gray-800 text-center">Vendor Transaction</h2>
        <p className="mt-2 text-gray-600 text-center">
          Add points to a user's account
        </p>

        {successMessage && (
          <div className="mt-4 text-green-600 bg-green-100 p-4 rounded-lg">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 text-red-600 bg-red-100 p-4 rounded-lg">
            {errorMessage}
          </div>
        )}

        <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-sm w-full mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Transaction Details</h3>
          <div className="mt-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="userAddress">
              User Address:
            </label>
            <input
              type="text"
              id="userAddress"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter user's wallet address"
            />
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="points">
              Points to Add:
            </label>
            <input
              type="number"
              id="points"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value, 10))}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter the number of points"
            />
          </div>

          <button
            onClick={handleTransaction}
            className="mt-8 w-full py-3 bg-purple-600 text-white rounded-lg focus:outline-none hover:bg-purple-700 transition"
          >
            Add Points to User
          </button>
        </div>
      </div>
    </>
  );
}

export default VendorTransaction;
