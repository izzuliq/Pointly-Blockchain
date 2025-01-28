import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Ensure this import is here
import VendorNavbar from "../components/VendorNavbar";
import getWeb3 from "../utils/getWeb3.js";
import getContractInstance from "../utils/contract";

function VendorRewards() {
  const navigate = useNavigate(); // Initialize navigate hook
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rewardToDelete, setRewardToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        const web3Instance = await getWeb3();
        const accounts = await web3Instance.eth.getAccounts();

        if (accounts.length === 0) {
          throw new Error("No accounts found. Please connect to MetaMask.");
        }
        setAccount(accounts[0]);

        const contractInstance = await getContractInstance("Rewards");
        setContract(contractInstance);

        if (contractInstance) {
          await fetchRewardsData(contractInstance, accounts[0]);
        }
      } catch (err) {
        console.error("Error initializing Web3 or fetching data:", err);
        setError("Failed to load rewards data. Please try again.");
        setLoading(false);
      }
    };

    initializeWeb3();
  }, []);

  useEffect(() => {
    if (contract && account) {
      fetchRewardsData(contract, account);
    }
  }, [contract, account]);  // Fetch rewards when either contract or account changes

  const fetchRewardsData = async (contractInstance, account) => {
    try {
      const rewards = await contractInstance.methods.getAllRewards().call();
      console.log("Fetched rewards:", rewards);
  
      // Ensure account is defined before calling toLowerCase()
      if (!account) {
        throw new Error("Vendor account is not available.");
      }
  
      // Filter rewards based on vendor's address (vendorAddress isn't available, so we need another way)
      const filteredRewards = rewards.filter(
        (reward) => reward.isActive && reward.vendorAddress && reward.vendorAddress.toLowerCase() === account.toLowerCase()
      );
  
      setRewards(filteredRewards);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      setError("Failed to fetch rewards. Please try again.");
      setLoading(false);
    }
  };

  const deleteReward = async (rewardId) => {
    try {
      await contract.methods.deactivateReward(rewardId).send({ from: account });
      setRewards((prevRewards) => prevRewards.filter((reward) => reward.id !== rewardId));
      alert("Reward deactivated successfully!");
    } catch (err) {
      console.error("Error deactivating reward:", err);
      setError("An error occurred while deactivating the reward. Please try again.");
    }
    setShowModal(false);
  };

  const handleDeleteClick = (rewardId) => {
    setRewardToDelete(rewardId);
    setShowModal(true);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setRewardToDelete(null);
  };

  const confirmDelete = () => {
    if (rewardToDelete !== null) {
      deleteReward(rewardToDelete);
    }
  };

  const handleAddNewReward = () => {
    navigate("/vendor-create-reward");
  };

  const handleEditReward = (rewardId) => {
    navigate(`/vendor-reward-details/${rewardId}`); // Navigate to reward details page
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
      <div className="p-6 bg-white shadow-md rounded-lg font-cabin">
        <h2 className="text-3xl font-cabin text-gray-800 text-center">Manage Rewards</h2>
        <p className="mt-2 text-gray-600 text-center">Create, update, and monitor rewards for your customers.</p>
        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Available Rewards</h3>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
            {rewards.length > 0 ? (
              rewards.map((reward) => (
                <div key={reward.id.toString()} className="bg-white p-4 rounded-lg shadow-xl flex flex-col items-center">
                  {/* Display image, use a default image if none is available */}
                  <img
                    src={reward.img || "default_reward_image.jpg"} // Fallback to default image if reward.img is empty
                    alt={reward.name}
                    className="max-w-[300px] max-h-[300px] object-cover mb-4 rounded-lg"
                  />
                  <h4 className="text-xl font-semibold text-gray-700">{reward.name}</h4>
                  <p className="mt-2 text-gray-500">
                    Cost: {reward.cost.toString()} points
                  </p>
                  <p className="mt-2 text-gray-600 text-center">{reward.description}</p>
                  <p className="mt-2 text-gray-500">
                    Expiration: {new Date(Number(reward.expiration) * 1000).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex space-x-4">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => handleEditReward(reward.id.toString())} // Handle Edit
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors"
                      onClick={() => handleDeleteClick(reward.id.toString())}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No rewards available.</p>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            className="px-6 py-3 bg-purple-dark text-white font-semibold rounded-lg hover:bg-gold-dark transition-colors"
            onClick={handleAddNewReward}
          >
            Add New Reward
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 text-center">Confirm Deletion</h3>
            <p className="mt-4 text-gray-600 text-center">Are you sure you want to delete this reward?</p>
            <div className="mt-6 flex justify-around">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VendorRewards;
