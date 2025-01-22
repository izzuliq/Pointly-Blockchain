import React, { useState, useEffect } from "react";
import UserNavbar from "../components/UserNavbar";
import { useNavigate, useParams } from "react-router-dom";
import getContractInstance from "../utils/contract";
import getWeb3 from "../utils/getWeb3";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RewardDetails() {
  const [rewardInfo, setRewardInfo] = useState({
    name: "",
    description: "",
    cost: 0,
    expiration: "",
    terms: [],
    img: "",
  });
  const [isRedeemed, setIsRedeemed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [userContract, setUserContract] = useState(null);
  const [userPoints, setUserPoints] = useState(0);

  const navigate = useNavigate();
  const { rewardId: rewardIdParam } = useParams();

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3 = await getWeb3();
          if (!web3) {
            toast.error("MetaMask not detected. Please install MetaMask.");
            return;
          }

          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);

          const rewardsContract = await getContractInstance("Rewards");
          const userContract = await getContractInstance("PointlyUser");
          setContract(rewardsContract);
          setUserContract(userContract);

          if (rewardsContract && userContract && rewardIdParam) {
            await fetchRewardDetails(rewardsContract, rewardIdParam);
            await fetchUserPoints(userContract, accounts[0]);
          }
        } catch (error) {
          toast.error("Error initializing Web3 or MetaMask. Please try again.");
        }
      } else {
        toast.error("MetaMask is not installed.");
      }
    };
    initializeWeb3();
  }, [rewardIdParam]);

  const fetchUserPoints = async (contract, userAccount) => {
    try {
      console.log("Fetching user points for:", userAccount);
      const userData = await contract.methods.getUser(userAccount).call();
      const availablePoints = BigInt(userData[7]).toString();  // Available points
      console.log("User available points:", availablePoints);
      setUserPoints(availablePoints);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user points. Please try again.");
    }
  };

  const fetchRewardDetails = async (contract, rewardId) => {
    try {
      console.log("Fetching reward details for ID:", rewardId);
      const reward = await contract.methods.getRewardDetails(rewardId).call();
      console.log("Reward details:", reward);
      setRewardInfo({
        name: reward.name,
        description: reward.description,
        cost: reward.cost.toString(),
        expiration: reward.expiration,
        terms: reward.terms,
        img: reward.img,
      });
    } catch (error) {
      console.error("Failed to fetch reward details:", error);
      toast.error("Failed to fetch reward details. Please try again.");
    }
  };

  const handleRedemption = async () => {
    console.log("Attempting reward redemption...");
    console.log("User account:", account);
    console.log("Reward ID:", rewardIdParam);
    console.log("Reward cost:", rewardInfo.cost);
    console.log("User available points:", userPoints);

    try {
      setLoading(true);

      // Ensure the user has enough points
      if (BigInt(userPoints) < BigInt(rewardInfo.cost)) {
        toast.error("You do not have enough points to redeem this reward.");
        return;
      }

      // Check contract instance
      if (!contract) {
        toast.error("Contract instance is not initialized.");
        return;
      }

      // Ensure rewardId is passed as BigInt
      const rewardId = BigInt(rewardIdParam);

      // Estimate gas
      console.log("Estimating gas for redeemReward function...");
      const estimatedGas = await contract.methods.redeemReward(rewardId).estimateGas({ from: account });
      console.log("Estimated gas:", estimatedGas);

      // Send transaction with buffer
      console.log("Sending redemption transaction...");
      const tx = await contract.methods.redeemReward(rewardId).send({
        from: account,
        gas: estimatedGas + 500000,  // Add buffer to avoid gas errors
      });

      console.log("Transaction response:", tx);

      if (tx.status) {
        setIsRedeemed(true);
        toast.success("Reward redeemed successfully!");
      } else {
        toast.error("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during redemption:", error);
      if (error.message.includes("revert")) {
        toast.error("Transaction reverted. Check reward availability or user points.");
      } else if (error.message.includes("User denied transaction signature")) {
        toast.error("You denied the transaction.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formattedExpirationDate = rewardInfo.expiration
    ? new Date(Number(rewardInfo.expiration) * 1000).toLocaleDateString()
    : "N/A";

  return (
    <>
      <UserNavbar />
      <div className="p-6 bg-white shadow-md rounded-lg flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4 mt-10">
          {rewardInfo.name}
        </h2>
        <img src={rewardInfo.img || "default_reward.png"} alt={rewardInfo.name} className="w-full max-w-[300px] mb-4 rounded-lg" />
        <p className="text-gray-600 text-center mb-4">{rewardInfo.description}</p>
        <p className="mt-2 text-lg font-semibold text-gray-700">Cost: {rewardInfo.cost} points</p>
        <p className="mt-4 text-gray-500">Expires on: {formattedExpirationDate}</p>
        <div className="mt-4 p-4 w-1/2 bg-purple-100 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 text-center">Terms & Conditions</h3>
          <ul className="mt-2 text-gray-600 list-disc pl-6">
            {rewardInfo.terms.map((term, index) => (
              <li key={index} className="mb-2">{term}</li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleRedemption}
          className={`mt-6 w-1/2 py-3 rounded-lg transition-colors ${
            isRedeemed ? 'bg-purple-dark text-white' : 'bg-gold-dark text-white hover:bg-purple-dark'
          }`}
          disabled={loading || isRedeemed}
        >
          {loading ? "Processing..." : isRedeemed ? "Redeemed Successfully" : "Redeem Now"}
        </button>
      </div>
      <ToastContainer />
    </>
  );
}

export default RewardDetails;
