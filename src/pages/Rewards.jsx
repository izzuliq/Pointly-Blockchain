import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Navbar from "../components/UserNavbar";

function Rewards() {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Function to navigate to the Reward Details page
  const handleMoreInfoClick = (rewardId) => {
    navigate("/reward-details", { state: { reward: rewardId } }); // Pass rewardId to the RewardDetails page
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-white shadow-md rounded-lg text-center font-cabin">
        {/* Page Header */}
        <h2 className="text-3xl font-cabin text-gray-800 text-center">Rewards</h2>
        <p className="mt-2 text-gray-600">Redeem your points for amazing rewards.</p>
        
      <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />
      
        {/* Points Overview Section */}
      <div className="mt-8 bg-gold-100 p-4 rounded-lg shadow-sm w-1/2 mx-auto">
        <h3 className="text-lg font-semibold text-gray-800 text-center">Points Overview</h3>
        <div className="mt-4 flex flex-col sm:flex-row justify-center sm:space-x-64"> {/* Flex with stacking on small screens */}
          <div className="text-center">
            <h4 className="text-xl font-semibold text-gray-700">1000</h4>
            <p className="text-gray-500">Total Points</p>
          </div>
          <div className="text-center mt-4 sm:mt-0">
            <h4 className="text-xl font-semibold text-gray-700">500</h4>
            <p className="text-gray-500">Available Points</p>
          </div>
        </div>
      </div>
      
      <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        {/* Rewards Section */}
        <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 text-center">Available Rewards For You</h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Reward 1 */}
            <div className="bg-white p-4 rounded-lg shadow-xl flex flex-col items-center">
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
              <button
                className="mt-4 w-3/4 bg-gold-dark text-white py-2 rounded-lg hover:bg-purple-dark transition-colors"
                onClick={() => handleMoreInfoClick(1)} // Pass the reward ID here
              >
                More Info
              </button>
            </div>

            {/* Reward 2 */}
            <div className="bg-white p-4 rounded-lg shadow-xl flex flex-col items-center">
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
              <button
                className="mt-4 w-3/4 bg-gold-dark text-white py-2 rounded-lg hover:bg-purple-dark transition-colors"
                onClick={() => handleMoreInfoClick(2)} // Pass the reward ID here
              >
                More Info
              </button>
            </div>

            {/* Reward 3 */}
            <div className="bg-white p-4 rounded-lg shadow-xl flex flex-col items-center">
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
              <button
                className="mt-4 w-3/4 bg-gold-dark text-white py-2 rounded-lg hover:bg-purple-dark transition-colors"
                onClick={() => handleMoreInfoClick(3)} // Pass the reward ID here
              >
                More Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Rewards;
