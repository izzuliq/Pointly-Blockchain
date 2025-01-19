import React, { useState, useEffect } from "react";
import getWeb3 from "../utils/getWeb3"; // Import getWeb3 instead of Web3 directly
import Navbar from "../components/UserNavbar";
import PointlyUser from '../../build/contracts/PointlyUser.json'; // Import ABI

function Dashboard() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [user, setUser] = useState({
    name: "",
    tier: "Quartz",
    avatarUrl: "", // Placeholder avatar
  });
  const [points, setPoints] = useState({ total: 0, available: 0 });
  const [activities, setActivities] = useState([]); // Placeholder for activities
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3 = await getWeb3(); // Use the getWeb3 function here
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const contractAddress = "0x7B6c379a50076D58F6F87034Df75f05C3e8798ED"; // Replace with your deployed contract address
        const pointlyUserContract = new web3.eth.Contract(PointlyUser.abi, contractAddress); // Ensure ABI is correct
        setContract(pointlyUserContract);

        // Fetch user data
        await fetchUserData(accounts[0], pointlyUserContract);
        setLoading(false);
      } catch (err) {
        console.error("Error initializing Web3 or loading contract", err);
      }
    };

    initWeb3();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = await contract.methods.getUser(userAddress).call();
  
      // Convert BigInt values to numbers or strings
      const totalPoints = BigInt(user[6]).toString(); // Convert to string for display
      const availablePoints = BigInt(user[7]).toString(); // Convert to string for display
  
      setUserData({
        email: user[0],
        name: user[1],
        phone: user[2],
        addressDetails: user[3],
        profileImage: user[4],
        tier: user[5],
        totalPoints, // Use string
        availablePoints, // Use string
      });
  
      calculateProgress(Number(totalPoints), Number(availablePoints)); // Pass as numbers for calculations
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  
  const calculateProgress = (totalPoints, availablePoints) => {
    try {
      if (totalPoints === 0) return 0;
  
      // Calculate progress as a percentage
      const progress = (availablePoints / totalPoints) * 100;
      setProgress(progress.toFixed(2)); // Set progress with 2 decimal places
    } catch (error) {
      console.error("Error calculating progress:", error);
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        {/* Spinner for loading */}
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
            src={user.avatarUrl || "Default.png"}
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
              {progress > 0 ? `${progress}% to your next tier` : "Loading progress..."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
