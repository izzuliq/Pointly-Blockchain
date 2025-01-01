import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import VendorNavbar from "../components/VendorNavbar";

function VendorRewards() {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Function to navigate to the Reward Details page for editing a reward
  const handleEditClick = (rewardId) => {
    navigate(`/vendor-reward-details/${rewardId}`, { state: { reward: rewardId } }); // Navigate to the Edit page with reward ID
  };

  // Function to handle reward creation
  const handleAddNewReward = () => {
    navigate("/vendor-create-reward"); // Navigate to create a new reward page
  };

  return (
    <>
      <VendorNavbar />
      <div className="p-6 bg-white shadow-md rounded-lg">
        {/* Page Header */}
        <h2 className="text-3xl font-cabin text-gray-800 text-center">Manage Rewards</h2>
        <p className="mt-2 text-gray-600 text-center">Create, update, and monitor rewards for your customers.</p>

        {/* Rewards Overview Section */}
        <div className="mt-6 bg-purple-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Your Company Rewards Overview</h3>
          <div className="mt-4 flex justify-between">
            <div>
              <h4 className="text-xl font-semibold text-gray-700 text-center">5</h4>
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

        {/* Rewards Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800">Available Rewards</h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Reward 1 */}
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
              <img
                src="./Coffee.png"
                alt="Free Coffee"
                className="max-w-[300px] max-h-[300px] object-cover mb-4 rounded-lg"
              />
              <h4 className="text-xl font-semibold text-gray-700">Free Coffee</h4>
              <p className="mt-2 text-gray-500">Cost: 300 points</p>
              <p className="mt-2 text-gray-600 text-center">
                Enjoy a freshly brewed cup of coffee with your reward points.
              </p>
              <div className="mt-4 flex space-x-4">
                {/* Edit Button */}
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => handleEditClick(1)} // Edit this reward
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Reward 2 */}
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
              <img
                src="./Voucher.png"
                alt="Gift Voucher"
                className="max-w-[300px] max-h-[300px] object-cover mb-4 rounded-lg"
              />
              <h4 className="text-xl font-semibold text-gray-700">Gift Voucher</h4>
              <p className="mt-2 text-gray-500">Cost: 500 points</p>
              <p className="mt-2 text-gray-600 text-center">
                Redeem your points for a gift voucher to use in participating stores.
              </p>
              <div className="mt-4 flex space-x-4">
                {/* Edit Button */}
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => handleEditClick(2)} // Edit this reward
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Reward 3 */}
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
              <img
                src="./Discount.png"
                alt="Exclusive Discount"
                className="max-w-[300px] max-h-[300px] object-cover mb-4 rounded-lg"
              />
              <h4 className="text-xl font-semibold text-gray-700">Exclusive Discount</h4>
              <p className="mt-2 text-gray-500">Cost: 1000 points</p>
              <p className="mt-2 text-gray-600 text-center">
                Unlock exclusive discounts on your next purchase with this reward.
              </p>
              <div className="mt-4 flex space-x-4">
                {/* Edit Button */}
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => handleEditClick(3)} // Edit this reward
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Reward Button */}
        <div className="mt-6 text-center">
          <button
            className="px-6 py-3 bg-purple-dark text-white font-semibold rounded-lg hover:bg-gold-dark transition-colors"
            onClick={handleAddNewReward}
          >
            Add New Reward
          </button>
        </div>
      </div>
    </>
  );
}

export default VendorRewards;
