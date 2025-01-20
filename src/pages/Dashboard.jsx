import React, { useState, useEffect } from "react";
import getWeb3 from "../utils/getWeb3";
import getContractInstance from "../utils/contract";
import Navbar from "../components/UserNavbar";

function Dashboard() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [user, setUser] = useState({
    name: "",
    tier: "Quartz",
    avatarUrl: "", // Placeholder avatar
  });
  const [points, setPoints] = useState({ total: 0, available: 0 });
  const [progress, setProgress] = useState(0);
  const [nextTier, setNextTier] = useState(""); // New state for next tier
  const [loading, setLoading] = useState(true);

  // Define the points thresholds for each tier
  const tierThresholds = {
    Quartz: 0,
    Emerald: 1000,
    Sapphire: 5000,
    Diamond: 10000,
  };

  // Tiers descriptions
  const tiers = {
    Quartz: {
      level: "Starting Level",
      range: "0 - 999 points",
      description: "You're just starting your adventure! Collect points and rise through the ranks.",
      image: "Quartz.png"
    },
    Emerald: {
      level: "Intermediate Level",
      range: "1,000 - 4,999 points",
      description: "You've earned a wealth of points! Enjoy better rewards as you move closer to Sapphire.",
      image: "Emerald.png"
    },
    Sapphire: {
      level: "Advanced Level",
      range: "5,000 - 9,999 points",
      description: "You're a treasure hunter with impressive rewards at your fingertips. Keep it up!",
      image: "Sapphire.png"
    },
    Diamond: {
      level: "Top Level",
      range: "10,000+ points",
      description: "The ultimate treasure hunter! You've reached the pinnacle and unlocked the best rewards.",
      image: "Diamond.png"
    }
  };

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();

        // Use getContractInstance to fetch the contract instance
        const pointlyUserContract = await getContractInstance("PointlyUser");

        setAccount(accounts[0]);
        setContract(pointlyUserContract);

        // Fetch user data from contract
        await fetchUserData(accounts[0], pointlyUserContract);
        setLoading(false);
      } catch (err) {
        console.error("Error initializing web3 or contract:", err);
        setLoading(false);
      }
    };

    initWeb3();
  }, []);

  const calculateProgress = (totalPoints, availablePoints, currentTier) => {
    const tierRanges = {
      Quartz: [0, 999],
      Emerald: [1000, 4999],
      Sapphire: [5000, 9999],
      Diamond: [10000, Infinity], // Diamond has no upper limit, so we use Infinity
    };
  
    let currentTierRange = tierRanges[currentTier];
    let nextTierRange = tierRanges[currentTier];
  
    const tiers = ["Quartz", "Emerald", "Sapphire", "Diamond"];
    const currentTierIndex = tiers.indexOf(currentTier);
  
    // If the user is not on the last tier, set the next tier
    if (currentTierIndex < tiers.length - 1) {
      nextTierRange = tierRanges[tiers[currentTierIndex + 1]];
    }
  
    const nextTierMaxPoints = nextTierRange[0];
  
    const progress = (availablePoints / nextTierMaxPoints) * 100;
  
    return progress > 100 ? 100 : progress;
  };  

  // Determine the next tier based on current tier
  const getNextTier = (currentTier) => {
    const tierOrder = ["Quartz", "Emerald", "Sapphire", "Diamond"];
    const currentIndex = tierOrder.indexOf(currentTier);
    return currentIndex < tierOrder.length - 1 ? tierOrder[currentIndex + 1] : null;
  };

  // Fetch user data from contract
  const fetchUserData = async (userAddress, pointlyUserContract) => {
    try {
      const user = await pointlyUserContract.methods.getUser(userAddress).call();
      const totalPoints = BigInt(user[6]).toString();
      const availablePoints = BigInt(user[7]).toString();
      const currentTier = user[5];
      const nextTier = getNextTier(currentTier); // Get the next tier name

      setUser({
        email: user[0],
        name: user[1],
        tier: currentTier,
        avatarUrl: user[4], // Avatar URL from contract (adjust as needed)
      });

      setPoints({ total: totalPoints, available: availablePoints });
      const progress = calculateProgress(Number(totalPoints), Number(availablePoints), currentTier);
      setProgress(progress.toFixed(2));
      setNextTier(nextTier); // Set the next tier name
    } catch (error) {
      console.error("Error fetching user data:", error);
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
      <Navbar />
      <div className="p-6 bg-white shadow-md rounded-lg max-w-6xl mx-auto">
        <h2 className="text-3xl font-cabin text-gray-800 text-center">Dashboard</h2>
        <p className="mt-2 text-gray-600 text-center">
          Track your activities, points, and progress towards your next treasure tier.
        </p>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        <div className="mt-6 flex flex-col md:flex-row items-center justify-center space-x-0 md:space-x-6">
          <img
            src={user.avatarUrl || "default_avatar.jpg"}
            alt="User Avatar"
            className="max-w-[200px] max-h-[200px] mb-6 rounded-full overflow-hidden border-4 border-gold-dark shadow-lg"
          />
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800">{user.name || "Guest"}</h3>
            <p className="text-lg text-gray-500">{user.tier} Member</p>
          </div>
        </div>

        <div className="mt-8 bg-gold-100 p-4 rounded-lg shadow-sm w-full mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Points Overview</h3>
          <div className="mt-4 flex flex-col sm:flex-row justify-center sm:space-x-64">
            <div className="text-center">
              <h4 className="text-xl font-semibold text-gray-700">{points.total}</h4>
              <p className="text-gray-500">Total Points</p>
            </div>
            <div className="text-center mt-4 sm:mt-0">
              <h4 className="text-xl font-semibold text-gray-700">{points.available}</h4>
              <p className="text-gray-500">Available Points</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gold-100 p-6 rounded-lg shadow-sm w-full mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Your Treasure Tier</h3>
          <p className="mt-2 text-gray-600 text-center">
            Unlock exclusive rewards and privileges as you level up your treasure tier!
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.keys(tiers).map((tier) => (
              <div
                key={tier}
                className={`bg-white p-4 rounded-lg shadow-md text-center transition-all duration-300 ease-in-out 
                  ${user.tier === tier ? "ring-4 ring-gold-dark ring-opacity-60" : "hover:ring-2 hover:ring-gray-300"}`}
              >
                <img
                  src={tiers[tier].image}
                  alt={`${tier} Tier`}
                  className="max-w-[150px] max-h-[150px] object-cover mx-auto mb-4"
                />
                <h4 className="text-xl font-semibold text-gray-700">{tier}</h4>
                <p className="mt-2 text-gray-500">{tiers[tier].level}</p>
                <p className="mt-2 text-gray-500">{tiers[tier].range}</p>
                <p className="mt-4 text-gray-600">{tiers[tier].description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Your Progress</h3>
          <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="h-5 bg-purple-200 rounded-lg">
              <div
                className="h-5 bg-purple rounded-lg"
                style={{ width: `${progress > 0 ? progress : 0}%` }}
              ></div>
            </div>
            <p className="mt-2 text-gray-500 text-sm text-center">
              {nextTier ? `${progress}% to your next tier: ${nextTier}` : "You're at the top! Keep it up!"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
