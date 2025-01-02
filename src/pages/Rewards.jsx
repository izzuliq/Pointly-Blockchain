import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/UserNavbar";
import axios from "axios";

function Rewards() {
  const [rewards, setRewards] = useState([]); // State to hold rewards data
  const [points, setPoints] = useState({ total: 0, available: 0 }); // State for points data
  const [loading, setLoading] = useState(true); // State for loading status
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Template rewards for testing (fallback in case of error in fetching)
  const templateRewards = [
    {
      id: 1,
      name: "Free Coffee",
      description: "Enjoy a freshly brewed cup of coffee with your reward points.",
      points: 300,
      imgSrc: "./Coffee.png",
    },
    {
      id: 2,
      name: "Gift Voucher",
      description: "Redeem your points for a gift voucher to use in participating stores.",
      points: 500,
      imgSrc: "./Voucher.png",
    },
    {
      id: 3,
      name: "Exclusive Discount",
      description: "Unlock exclusive discounts on your next purchase with this reward.",
      points: 1000,
      imgSrc: "./Discount.png",
    },
  ];

  // Fetch rewards and points data using useEffect
  useEffect(() => {
    // Fetch points data
    axios
      .get("/api/points") // Replace with your actual endpoint for fetching points data
      .then((response) => {
        // Assuming response contains total and available points
        setPoints({
          total: response.data.total || 69, // Use 69 as default example value
          available: response.data.available || 69, // Use 69 as default example value
        });
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching points:", error);
        setPoints({ total: 69, available: 69 }); // Fallback to 69 if error
        setLoading(false); // Set loading to false if error occurs
      });

    // Fetch rewards data
    axios
      .get("/api/rewards") // Replace with your actual endpoint for fetching rewards
      .then((response) => {
        if (Array.isArray(response.data)) {
          setRewards(response.data);
        } else {
          console.error("Rewards data is not an array:", response.data);
          setRewards([]); // Fallback to empty array if data is not valid
        }
      })
      .catch((error) => {
        console.error("Error fetching rewards:", error);
        setRewards([]); // In case of an error, fallback to template rewards
      });
  }, []);

  const rewardsToDisplay = Array.isArray(rewards) && rewards.length > 0 ? rewards : templateRewards;

  // Function to navigate to the Reward Details page
  const handleMoreInfoClick = (rewardId) => {
    navigate(`/reward-details/${rewardId}`); // Pass rewardId to the RewardDetails page
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
          <div className="mt-4 flex flex-col sm:flex-row justify-center sm:space-x-64">
            <div className="text-center">
              <h4 className="text-xl font-semibold text-gray-700">{loading ? "Loading..." : points.total}</h4> {/* Show "Loading..." until data is loaded */}
              <p className="text-gray-500">Total Points</p>
            </div>
            <div className="text-center mt-4 sm:mt-0">
              <h4 className="text-xl font-semibold text-gray-700">{loading ? "Loading..." : points.available}</h4> {/* Show "Loading..." until data is loaded */}
              <p className="text-gray-500">Available Points</p>
            </div>
          </div>
        </div>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        {/* Rewards Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Available Rewards For You</h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewardsToDisplay.map((reward) => (
              <div key={reward.id} className="bg-white p-4 rounded-lg shadow-xl flex flex-col items-center">
                <img
                  src={reward.imgSrc}
                  alt={reward.name}
                  className="max-w-[300px] max-h-[300px] object-cover mb-4 rounded-lg"
                />
                <h4 className="text-xl font-semibold text-gray-700">{loading ? "Loading..." : reward.name}</h4> {/* Show "Loading..." until data is loaded */}
                <p className="mt-2 text-gray-500">{loading ? "Loading..." : `Cost: ${reward.points} points`}</p> {/* Show "Loading..." until data is loaded */}
                <p className="mt-2 text-gray-600 text-center">{loading ? "Loading..." : reward.description}</p> {/* Show "Loading..." until data is loaded */}
                <button
                  className="mt-4 w-3/4 bg-gold-dark text-white py-2 rounded-lg hover:bg-purple-dark transition-colors"
                  onClick={() => handleMoreInfoClick(reward.id)} // Pass the reward ID here
                >
                  More Info
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Rewards;
