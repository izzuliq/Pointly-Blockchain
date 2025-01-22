import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/UserNavbar";
import getWeb3 from "../utils/getWeb3";
import getContractInstance from "../utils/contract";

function RewardsPage() {
  const [rewards, setRewards] = useState([]); // State to hold rewards data
  const [points, setPoints] = useState({ total: 0, available: 0 }); // State for points data
  const [loading, setLoading] = useState(true); // State for loading status
  const [account, setAccount] = useState(null);
  const [rewardsContract, setRewardsContract] = useState(null);
  const [userContract, setUserContract] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        const web3Instance = await getWeb3();
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          alert("No accounts found. Please connect to MetaMask.");
        }

        // Use getContractInstance to fetch contract instances
        const rewardsInstance = await getContractInstance("Rewards");
        const userInstance = await getContractInstance("PointlyUser");

        setRewardsContract(rewardsInstance);
        setUserContract(userInstance);

        await fetchPointsData(userInstance, accounts[0]);
        await fetchRewardsData(rewardsInstance);
      } catch (error) {
        console.error("Error initializing Web3:", error);
      }
    };

    initializeWeb3();
  }, []);

  const fetchPointsData = async (contract, userAccount) => {
    try {
      const userData = await contract.methods.getUser(userAccount).call();
      
      // Ensure correct index usage.
      const totalPoints = BigInt(userData[6]).toString(); // Total points
      const availablePoints = BigInt(userData[7]).toString(); // Available points
  
      setPoints({
        total: totalPoints,
        available: availablePoints,
      });
  
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchRewardsData = async (contract) => {
    try {
      // Fetch all rewards at once
      const rewards = await contract.methods.getAllRewards().call();
      console.log("Fetched rewards:", rewards); // Log all fetched rewards

      const allRewards = rewards.map((reward) => {
        console.log(`Reward fetched: ID = ${reward.id}, Name = ${reward.name}, Cost = ${reward.cost}`); // Log each reward's details
        return {
          id: reward.id,
          name: reward.name,
          description: reward.description,
          points: reward.cost,
          imgSrc: reward.img,
        };
      });

      console.log("All rewards processed:", allRewards); // Log all rewards processed
      setRewards(allRewards);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  };

  const redeemPoints = async (reward) => {
    if (points.available < reward.points) {
      alert("You don't have enough points to redeem this reward.");
      return;
    }

    try {
      await rewardsContract.methods.redeemReward(reward.id).send({ from: account });
      setPoints((prev) => ({
        ...prev,
        available: prev.available - reward.points,
      }));
      alert("Reward redeemed successfully!");
    } catch (error) {
      console.error("Error redeeming reward:", error);
      alert("An error occurred while redeeming the reward.");
    }
  };

  const handleRewardClick = (rewardId) => {
    navigate(`/reward-details/${rewardId}`);
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-white shadow-md rounded-lg text-center font-cabin">
        <h2 className="text-3xl font-cabin text-gray-800 text-center">Rewards</h2>
        <p className="mt-2 text-gray-600">Redeem your points for amazing rewards.</p>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        {/* Points Overview */}
        <div className="mt-8 bg-gold-100 p-4 rounded-lg shadow-sm w-1/2 mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Points Overview</h3>
          <div className="mt-4 flex flex-col sm:flex-row justify-center sm:space-x-64">
            <div className="text-center">
              <h4 className="text-xl font-semibold text-gray-700">{loading ? "Loading..." : points.total}</h4>
              <p className="text-gray-500">Total Points</p>
            </div>
            <div className="text-center mt-4 sm:mt-0">
              <h4 className="text-xl font-semibold text-gray-700">{loading ? "Loading..." : points.available}</h4>
              <p className="text-gray-500">Available Points</p>
            </div>
          </div>
        </div>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        {/* Available Rewards */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Available Rewards For You</h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward, index) => {
              console.log(`Rendering reward: ID = ${reward.id}, Name = ${reward.name}, Cost = ${reward.points}`); // Log when rendering each reward
              return (
                <div key={`${reward.id}-${index}`} className="bg-white p-4 rounded-lg shadow-xl flex flex-col items-center">
                  <img
                    src={reward.imgSrc}
                    alt={reward.name}
                    className="max-w-[300px] max-h-[300px] object-cover mb-4 rounded-lg"
                  />
                  <h4 className="text-xl font-semibold text-gray-700">{reward.name}</h4>
                  <p className="mt-2 text-gray-500">{`Cost: ${reward.points} points`}</p>
                  <p className="mt-2 text-gray-600 text-center">{reward.description}</p>

                  {/* Buttons for More Info and Redeem */}
                  <div className="mt-4 flex flex-col sm:flex-row justify-center sm:space-x-4">
                    <button
                      className="bg-purple-700 text-white py-2 px-4 rounded-lg hover:bg-purple-800 transition-colors"
                      onClick={() => handleRewardClick(reward.id)}
                    >
                      View Details
                    </button>
                    <button
                      className="bg-gold-dark text-white py-2 px-4 rounded-lg hover:bg-purple-dark transition-colors"
                      onClick={() => redeemPoints(reward)}
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default RewardsPage;
