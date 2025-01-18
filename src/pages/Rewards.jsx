import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/UserNavbar";
import Web3 from "web3";

function Rewards() {
  const [rewards, setRewards] = useState([]); // State to hold rewards data
  const [points, setPoints] = useState({ total: 0, available: 0 }); // State for points data
  const [loading, setLoading] = useState(true); // State for loading status
  const [web3, setWeb3] = useState(null);
  const [pointlyUserContract, setPointlyUserContract] = useState(null);
  const [rewardsContract, setRewardsContract] = useState(null);
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  // Define ABI and contract addresses
  const POINTLY_USER_ABI = [
    // Replace with your actual PointlyUser.sol ABI
  ];

  const POINTLY_USER_ADDRESS = "0xYourPointlyUserContractAddress"; // Replace with your PointlyUser.sol contract address

  const REWARDS_ABI = [
    // Replace with your actual Rewards.sol ABI
  ];

  const REWARDS_ADDRESS = "0xYourRewardsContractAddress"; // Replace with your Rewards.sol contract address

  useEffect(() => {
    // Initialize Web3, Contracts, and Account
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      // Request MetaMask accounts
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          setAccount(accounts[0]);

          // Initialize contracts
          const pointlyUserInstance = new web3Instance.eth.Contract(POINTLY_USER_ABI, POINTLY_USER_ADDRESS);
          setPointlyUserContract(pointlyUserInstance);

          const rewardsInstance = new web3Instance.eth.Contract(REWARDS_ABI, REWARDS_ADDRESS);
          setRewardsContract(rewardsInstance);

          // Fetch data
          fetchPointsData(pointlyUserInstance, accounts[0]);
          fetchRewardsData(rewardsInstance);
        })
        .catch((err) => console.error("Error getting accounts:", err));
    } else {
      alert("Please install MetaMask to interact with the contracts.");
    }
  }, []);

  // Function to fetch user points from PointlyUser.sol
  const fetchPointsData = (contractInstance, userAddress) => {
    contractInstance.methods
      .getUser(userAddress)
      .call()
      .then((userData) => {
        setPoints({
          total: userData.totalPoints,
          available: userData.availablePoints,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setPoints({ total: 0, available: 0 });
        setLoading(false);
      });
  };

  // Function to fetch rewards from Rewards.sol
  const fetchRewardsData = (contractInstance) => {
    const fetchedRewards = [];
    const maxRewards = 50; // Adjust based on expected reward count
    const rewardPromises = Array.from({ length: maxRewards }, (_, i) =>
      contractInstance.methods
        .getReward(i + 1)
        .call()
        .then((reward) => {
          if (reward.isActive) {
            fetchedRewards.push({
              id: reward.id,
              name: reward.name,
              description: reward.description,
              points: reward.cost,
              imgSrc: reward.img,
            });
          }
        })
        .catch(() => {
          // Ignore non-existent or inactive rewards
        })
    );

    Promise.all(rewardPromises).then(() => setRewards(fetchedRewards));
  };

  // Function to redeem a reward
  const redeemPoints = (reward) => {
    if (points.available < reward.points) {
      alert("You don't have enough points to redeem this reward.");
      return;
    }

    rewardsContract.methods
      .redeemReward(reward.id)
      .send({ from: account })
      .then(() => {
        setPoints((prevState) => ({
          ...prevState,
          available: prevState.available - reward.points,
        }));
        alert("Reward redeemed successfully!");
      })
      .catch((error) => {
        console.error("Error redeeming reward:", error);
        alert("An error occurred while redeeming the reward.");
      });
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-white shadow-md rounded-lg text-center font-cabin">
        <h2 className="text-3xl font-cabin text-gray-800 text-center">Rewards</h2>
        <p className="mt-2 text-gray-600">Redeem your points for amazing rewards.</p>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        {/* Points Overview Section */}
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

        {/* Rewards Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Available Rewards For You</h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <div key={reward.id} className="bg-white p-4 rounded-lg shadow-xl flex flex-col items-center">
                <img src={reward.imgSrc} alt={reward.name} className="max-w-[300px] max-h-[300px] object-cover mb-4 rounded-lg" />
                <h4 className="text-xl font-semibold text-gray-700">{reward.name}</h4>
                <p className="mt-2 text-gray-500">{`Cost: ${reward.points} points`}</p>
                <p className="mt-2 text-gray-600 text-center">{reward.description}</p>
                <button
                  className="mt-4 w-3/4 bg-gold-dark text-white py-2 rounded-lg hover:bg-purple-dark transition-colors"
                  onClick={() => redeemPoints(reward)}
                >
                  Redeem
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
