import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getWeb3 from "../utils/getWeb3"; // Import getWeb3
import PointlyUser from '../../build/contracts/PointlyUser.json'; // Import ABI
import Navbar from '../components/UserNavbar'; // Import Navbar component
import ReviewsCarousel from '../components/Review'; // Import Reviews Carousel

function Home() {
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [userTier, setUserTier] = useState('Quartz');
  const navigate = useNavigate();

  useEffect(() => {
    const loadWeb3AndContract = async () => {
      try {
        const web3 = await getWeb3(); // Initialize Web3
        const accounts = await web3.eth.getAccounts(); // Get user wallet address

        if (!accounts || accounts.length === 0) {
          console.warn('No MetaMask account detected. Redirecting to login.');
          navigate('/'); // Redirect if no account found
          return;
        }

        const walletAddress = accounts[0]; // Use the first account as the wallet address
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = PointlyUser.networks[networkId];

        if (!deployedNetwork) {
          console.error('Smart contract not deployed to detected network.');
          return;
        }

        const contract = new web3.eth.Contract(
          PointlyUser.abi,
          deployedNetwork && deployedNetwork.address
        );

        // Fetch user details from contract
        const userData = await contract.methods.getUser(walletAddress).call();
        if (userData.exists) {
          setIsAuthenticated(true);
          setUserId(walletAddress);
          setUserRole(userData.role); // Fetch and set role
          setUserPoints(userData.totalPoints);
          setUserTier(userData.tier);
        } else {
          console.warn('User not found in contract.');
          navigate('/'); // Redirect if user does not exist
        }
      } catch (error) {
        console.error("Error loading Web3 or contract:", error);
        navigate('/'); // Redirect if error occurs
      }
    };

    loadWeb3AndContract();
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-full p-6 font-cabin">
        {/* Header */}
        <img src="./PointlyLogoBlack.png" alt="Company Logo" className="mt-10 mb-6 w-[300px] h-auto" />
        <h1 className="text-5xl font-bold text-purple">Welcome to Pointly</h1>
        <p className="mt-4 text-3xl font-bold text-gray-800 italic">"Points Simplified"</p>

        {/* User Info */}
        {isAuthenticated && (
          <div className="mt-5 text-center">
            <p className="text-lg text-gray-700">Hello, {userRole}!</p>
            <p className="text-lg text-gray-700">Your current tier: {userTier}</p>
            <p className="text-lg text-gray-700">Total Points: {userPoints}</p>
          </div>
        )}

        {/* Description */}
        <div className="mt-5 max-w-3xl text-center mb-5">
          <p className="text-lg text-gray-700">
            Pointly is your one-stop app for managing and maximizing loyalty rewards. With Pointly, you can 
            integrate reward points from various vendors and keep them all in one place. No more juggling between 
            different apps or remembering multiple logins — everything is centralized for your convenience.
          </p>
        </div>

        {/* More content below */}
        <ReviewsCarousel />
        {/* More sections and buttons */}
      </div>
    </>
  );
}

export default Home;
