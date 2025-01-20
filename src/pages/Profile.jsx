import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import getWeb3 from "../utils/getWeb3"; // Import getWeb3 utility
import getContractInstance from "../utils/contract"; // Import the contract details utility
import Navbar from "../components/UserNavbar";

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
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3 = await getWeb3(); // Use getWeb3 utility to get Web3 instance
        console.log("Web3 instance:", web3);

        if (!web3) {
          setError("Failed to initialize Web3.");
          setLoading(false);
          return;
        }

        const accounts = await web3.eth.getAccounts();
        console.log("MetaMask accounts:", accounts);

        if (accounts.length === 0) {
          setError("No MetaMask account found.");
          setLoading(false);
          return;
        }

        setAccount(accounts[0]);

        const contractInstance = await getContractInstance("PointlyUser");
        if (!contractInstance) {
          setError("Failed to load PointlyUser contract.");
          setLoading(false);
          return;
        }

        setContract(contractInstance);
        await fetchUserProfile(accounts[0], contractInstance);
      } catch (error) {
        console.error("Error initializing Web3 or contract:", error);
        setError("Failed to initialize Web3 or contract.");
        setLoading(false);
      }
    };

    initWeb3();
  }, [navigate]);

  const fetchUserProfile = async (userAddress, contract) => {
    try {
      const userProfile = await contract.methods.getUser(userAddress).call();
      console.log("Fetched user profile:", userProfile);

      setUserData({
        name: userProfile.name || "N/A",
        email: userProfile.email || "N/A",
        phone: userProfile.phone || "N/A",
        address: userProfile.addressDetails || "N/A",
        profileImage: userProfile.profileImage || "default_avatar.jpg",
        tier: userProfile.tier || "Quartz",
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
    return (
      <div className="text-center text-red-500 font-semibold">
        <p>{error}</p>
      </div>
    );
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

          {[
            { label: "Name", value: userData.name },
            { label: "Email", value: userData.email },
            { label: "Phone", value: userData.phone },
            { label: "Address", value: userData.address },
            { label: "Tier", value: userData.tier },
          ].map(({ label, value }) => (
            <div key={label} className="w-full mb-6 text-center">
              <label className="block text-2xl font-cabin text-purple-dark">{label}</label>
              <p className="mt-2 text-gray-800 text-xl">{value}</p>
            </div>
          ))}

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
