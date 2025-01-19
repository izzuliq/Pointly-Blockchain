import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/UserNavbar";
import Web3 from "web3";
import PointlyUser from "../../build/contracts/PointlyUser.json"; // Import ABI of PointlyUser.sol

function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profileImage: "",
    tier: "",
    totalPoints: 0,
    availablePoints: 0,
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const contractAddress = "0x8D67D204b25ccA0EA4Dcb249C5bFeA6Ef54C8AD9"; // Replace with your contract address
        const pointlyUserContract = new web3.eth.Contract(PointlyUser.abi, contractAddress);
        setContract(pointlyUserContract);

        if (accounts[0] && pointlyUserContract) {
          fetchUserProfile(accounts[0], pointlyUserContract);
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
        name: userProfile.name || "N/A",
        email: userProfile.email || "N/A",
        phone: userProfile.phone || "N/A",
        address: userProfile.addressDetails || "N/A",
        profileImage: userProfile.profileImage || "default-profile.png",
        tier: userProfile.tier || "Quartz",
        totalPoints: userProfile.totalPoints || 0,
        availablePoints: userProfile.availablePoints || 0,
        role: userProfile.role || "User",
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
        <div className="flex flex-col items-center">
          <div className="border-t-4 border-purple-600 w-16 h-16 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
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
          <div className="max-w-[200px] max-h-[200px] mb-6 rounded-full overflow-hidden border-4 border-gold-dark shadow-lg">
            <img
              src={userData.profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">Name</label>
            <p className="mt-2 text-gray-800 text-xl">{userData.name}</p>
          </div>

          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">Email</label>
            <p className="mt-2 text-gray-800 text-xl">{userData.email}</p>
          </div>

          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">Phone</label>
            <p className="mt-2 text-gray-800 text-xl">{userData.phone}</p>
          </div>

          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">Address</label>
            <p className="mt-2 text-gray-800 text-xl">{userData.address}</p>
          </div>

          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">Tier</label>
            <p className="mt-2 text-gray-800 text-xl">{userData.tier}</p>
          </div>

          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">Total Points</label>
            <p className="mt-2 text-gray-800 text-xl">{userData.totalPoints}</p>
          </div>

          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">Available Points</label>
            <p className="mt-2 text-gray-800 text-xl">{userData.availablePoints}</p>
          </div>

          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">Role</label>
            <p className="mt-2 text-gray-800 text-xl">{userData.role}</p>
          </div>

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
