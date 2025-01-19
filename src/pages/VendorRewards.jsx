import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VendorNavbar from "../components/VendorNavbar";
import getWeb3 from "../utils/getWeb3.js";
import Rewards from "../../build/contracts/Rewards.json";

function VendorRewards() {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [rewards, setRewards] = useState([]); // State to hold vendor's rewards
  const [loading, setLoading] = useState(true); // Loading state
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [rewardsContract, setRewardsContract] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [rewardToDelete, setRewardToDelete] = useState(null); // Reward to delete

  // Replace with your deployed Rewards contract address
  const rewardsAddress = "0xa45d988da532AA71Ba0B091355242D2f515Ae458";

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        const web3Instance = await getWeb3();
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          alert("No accounts found. Please connect to MetaMask.");
        }

        const rewardsInstance = new web3Instance.eth.Contract(Rewards.abi, rewardsAddress);
        setRewardsContract(rewardsInstance);

        await fetchRewardsData(rewardsInstance, accounts[0]);
      } catch (error) {
        console.error("Error initializing Web3:", error);
      }
    };

    initializeWeb3();
  }, []);

  const fetchRewardsData = async (contract, userAccount) => {
    try {
      // Fetch the total number of rewards
      const rewardCounter = await contract.methods.rewardCounter().call();

      const vendorRewards = [];
      for (let i = 1; i <= rewardCounter; i++) {
        const reward = await contract.methods.getRewardDetails(i).call();

        // Assuming `vendor` field identifies the creator (e.g., msg.sender in addReward)
        if (reward.vendor.toLowerCase() === userAccount.toLowerCase() && reward.isActive) {
          vendorRewards.push({
            id: i,
            name: reward.name,
            description: reward.description,
            cost: reward.cost,
            img: reward.img,
            active: reward.isActive,
          });
        }
      }
      setRewards(vendorRewards);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  };

  const deleteReward = async (rewardId) => {
    try {
      await rewardsContract.methods.deactivateReward(rewardId).send({ from: account });
      setRewards((prevRewards) => prevRewards.filter((reward) => reward.id !== rewardId));
      alert("Reward deactivated successfully!");
    } catch (error) {
      console.error("Error deactivating reward:", error);
      alert("An error occurred while deactivating the reward.");
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
    navigate("/vendor-create-reward"); // Redirect to add reward page
  };

  return (
    <>
      <VendorNavbar />
      <div className="p-6 bg-white shadow-md rounded-lg font-cabin">
        <h2 className="text-3xl font-cabin text-gray-800 text-center">Manage Rewards</h2>
        <p className="mt-2 text-gray-600 text-center">Create, update, and monitor rewards for your customers.</p>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        <div className="mt-6 bg-gold-100 p-4 rounded-lg shadow-sm w-3/4 items-center mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Your Company Rewards Overview</h3>
          <div className="mt-4 flex flex-col sm:flex-row justify-center sm:space-x-64">
            <div>
              <h4 className="text-xl font-semibold text-gray-700 text-center">{rewards.length}</h4>
              <p className="text-gray-500 text-center">Total Rewards</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-700 text-center">1,200</h4>
              <p className="text-gray-500 text-center">Total Redemptions</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-700 text-center">3</h4>
              <p className="text-gray-500 text-center">Active Promotions</p>
            </div>
          </div>
        </div>
        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Available Rewards</h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.isArray(rewards) && rewards.map((reward) => (
              <div key={reward.id} className="bg-white p-4 rounded-lg shadow-xl flex flex-col items-center">
                <img
                  src={reward.img}
                  alt={reward.name}
                  className="max-w-[300px] max-h-[300px] object-cover mb-4 rounded-lg"
                />
                <h4 className="text-xl font-semibold text-gray-700">{reward.name}</h4>
                <p className="mt-2 text-gray-500">Cost: {reward.cost} points</p>
                <p className="mt-2 text-gray-600 text-center">{reward.description}</p>
                <div className="mt-4 flex space-x-4">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => handleEditClick(reward.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors"
                    onClick={() => handleDeleteClick(reward.id)} // Trigger delete on click
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
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

      {/* Modal Confirmation */}
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
