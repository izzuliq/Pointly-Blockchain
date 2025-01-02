import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // Import axios for fetching data
import VendorNavbar from "../components/VendorNavbar";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Ensure correct CSS import for toastify

function VendorRewards() {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [rewards, setRewards] = useState([]); // Ensure rewards is an array initially
  const [loading, setLoading] = useState(true); // Loading state
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [rewardToDelete, setRewardToDelete] = useState(null); // Track the reward to be deleted

  // Sample fallback data in case the API call fails
  const fallbackRewards = [
    {
      id: 1,
      name: "Free Coffee",
      description: "Enjoy a freshly brewed cup of coffee.",
      cost: 300,
      img: "./Coffee.png",
    },
    {
      id: 2,
      name: "Gift Voucher",
      description: "Redeem your points for a gift voucher.",
      cost: 500,
      img: "./Voucher.png",
    },
    {
      id: 3,
      name: "Exclusive Discount",
      description: "Unlock exclusive discounts on your next purchase.",
      cost: 1000,
      img: "./Discount.png",
    },
  ];

  useEffect(() => {
    // Fetch rewards from the database
    axios.get("/api/rewards") // Replace with your API endpoint
      .then((response) => {
        if (Array.isArray(response.data)) { // Ensure the data is an array
          setRewards(response.data); // Set rewards data from API response
        } else {
          setRewards(fallbackRewards); // Fallback to fallbackRewards if data isn't an array
        }
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        console.error("Error fetching rewards:", error);
        setRewards(fallbackRewards); // Use fallback rewards if API fails
        setLoading(false); // Set loading to false when fallback data is used
      });
  }, []); // Empty dependency array ensures it runs once when component mounts

  // Function to navigate to the Reward Details page for editing a reward
  const handleEditClick = (rewardId) => {
    navigate(`/vendor-reward-details/${rewardId}`, { state: { reward: rewardId } });
  };

  // Function to handle reward creation
  const handleAddNewReward = () => {
    navigate("/vendor-create-reward");
  };

  // Function to handle deletion of a reward
  const handleDeleteClick = (rewardId) => {
    setRewardToDelete(rewardId); // Set the reward to be deleted
    setShowModal(true); // Show the confirmation modal
  };

  // Function to confirm deletion
  const confirmDelete = () => {
    if (!rewardToDelete) return;
    axios.delete(`/api/rewards/${rewardToDelete}`) // Replace with your API endpoint
      .then(() => {
        // If deletion is successful, remove the reward from state
        setRewards(rewards.filter(reward => reward.id !== rewardToDelete));
        toast.success("Reward deleted successfully!"); // Success toast
        setShowModal(false); // Close modal
        setRewardToDelete(null); // Reset rewardToDelete state
      })
      .catch((error) => {
        console.error("Error deleting reward:", error);
        toast.error("Failed to delete the reward. Please try again."); // Error toast
        setShowModal(false); // Close modal
        setRewardToDelete(null); // Reset rewardToDelete state
      });
  };

  // Function to cancel deletion
  const cancelDelete = () => {
    setShowModal(false); // Close modal without deleting
    setRewardToDelete(null); // Reset rewardToDelete state
  };

  // Enhanced loading UI with spinner
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
