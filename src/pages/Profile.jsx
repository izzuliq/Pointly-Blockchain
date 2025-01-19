import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // React Router for navigation
import Navbar from "../components/UserNavbar";
import Web3 from "web3"; // Import Web3.js
import PointlyUserABI from '../../build/contracts/PointlyUser.json'; // Import ABI of PointlyUser.sol

function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "Sarimah Jalil",
    email: "SJalil@gmail.com",
    phone: "(60)123456789",
    address: "123 Jalan Abu Karam, Kota Bharu, Kelantan, Malaysia",
    dob: "01/01/1990",
    profileImage: "Sarimah.png", // Default profile image
  });
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state
  const navigate = useNavigate();
  const [account, setAccount] = useState(null); // User's account address
  const [contract, setContract] = useState(null); // Contract instance

  useEffect(() => {
    // Initialize Web3.js and set up the contract
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // Request wallet access
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const contractAddress = "0x07E79cE4F3dFc9C4A35757A4228f44241dfce325"; // Replace with your contract address
        const pointlyUserContract = new web3.eth.Contract(PointlyUserABI, contractAddress);
        setContract(pointlyUserContract);

        // Extract session data from sessionStorage
        const token = sessionStorage.getItem('authToken');
        const role = sessionStorage.getItem('userRole');
        const id = sessionStorage.getItem('userId');

        // Fetch user profile data from the contract
        if (account && contract) {
          fetchUserProfile(account, pointlyUserContract);
        }
      } else {
        console.error("Ethereum wallet not detected. Please install MetaMask.");
      }
    };

    initWeb3();
  }, [navigate, account, contract]);

  const fetchUserProfile = async (userAddress, contract) => {
    try {
      const userProfile = await contract.methods.getUser(userAddress).call();
      setUserData({
        name: userProfile.name || userData.name,
        email: userProfile.email || userData.email,
        phone: userProfile.phone || userData.phone,
        address: userProfile.addressDetails || userData.address,
        dob: userProfile.dob || userData.dob,
        profileImage: userProfile.profileImage || userData.profileImage,
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch profile data.");
      setLoading(false);
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

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return (
    <>
      <Navbar />
      <div className="p-6 bg-white shadow-md rounded-lg max-w-xl mx-auto font-cabin">
        <h2 className="text-3xl font-cabin text-gray-800 text-center">
          User Profile
        </h2>
        <p className="mt-2 text-gray-600 text-center">
          View and manage your account details.
        </p>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        <div className="mt-8 flex flex-col items-center">
          {/* Profile Picture */}
          <div className="max-w-[200px] max-h-[200px] mb-6 rounded-full overflow-hidden border-4 border-gold-dark shadow-lg">
            <img
              src={userData.profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name */}
          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">
              Name
            </label>
            <p className="mt-2 text-gray-800 text-xl">{userData.name}</p>
          </div>

          {/* Email */}
          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">
              Email
            </label>
            <p className="mt-2 text-gray-800 text-xl">{userData.email}</p>
          </div>

          {/* Phone */}
          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">
              Phone
            </label>
            <p className="mt-2 text-gray-800 text-xl">{userData.phone}</p>
          </div>

          {/* Address */}
          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">
              Address
            </label>
            <p className="mt-2 text-gray-800 text-xl">{userData.address}</p>
          </div>

          {/* Date of Birth */}
          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">
              Date of Birth
            </label>
            <p className="mt-2 text-gray-800 text-xl">{userData.dob}</p>
          </div>

          {/* Edit Button */}
          <Link to="/EditProfile">
            <button className="px-6 py-3 bg-gold-dark text-white font-semibold rounded-lg hover:bg-purple-dark transition-colors">
              Edit Profile
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
