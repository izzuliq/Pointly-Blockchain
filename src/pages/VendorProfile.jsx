import React, { useState, useEffect } from "react";
import VendorNavbar from "../components/VendorNavbar";
import { Link, useNavigate } from "react-router-dom";
import getContractInstance from "../utils/contract"; // Import the contract instance utility
import getWeb3 from "../utils/getWeb3"; // Import the getWeb3 utility

function VendorProfile() {
  const [vendorData, setVendorData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profileImage: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        // Initialize Web3 using the getWeb3 utility
        const web3 = await getWeb3();
        if (!web3) {
          setError("Failed to initialize Web3.");
          setLoading(false);
          return;
        }

        // Get the contract instance for the PointlyUser contract
        const contractInstance = await getContractInstance("PointlyUser");
        if (!contractInstance) {
          setError("Failed to load PointlyUser contract.");
          setLoading(false);
          return;
        }

        setContract(contractInstance);

        // Get the connected wallet address
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        if (accounts[0] && contractInstance) {
          fetchVendorProfile(accounts[0], contractInstance);
        }
      } catch (error) {
        console.error("Error initializing Web3 or contract:", error);
        setError("Failed to initialize Web3 or contract.");
        setLoading(false);
      }
    };

    initWeb3();
  }, [navigate]);

  const fetchVendorProfile = async (vendorAddress, contract) => {
    try {
      // Assuming `getVendor` is a method from the PointlyVendor contract to fetch vendor profile
      const vendorProfile = await contract.methods.getUser(vendorAddress).call();
      setVendorData({
        name: vendorProfile.name || "N/A",
        email: vendorProfile.email || "N/A",
        phone: vendorProfile.phone || "N/A",
        address: vendorProfile.addressDetails || "N/A",
        profileImage: vendorProfile.profileImage || "default_avatar.jpg",
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching vendor data:", err);
      setError("Failed to fetch vendor profile data.");
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
      <VendorNavbar />
      <div className="p-6 bg-white shadow-md rounded-lg max-w-xl mx-auto font-cabin">
        <h2 className="text-3xl font-cabin text-gray-800 text-center">
          Vendor Profile
        </h2>
        <p className="mt-2 text-gray-600 text-center">
          View and manage your account details.
        </p>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        <div className="mt-8 flex flex-col items-center">
          <div className="max-w-[200px] max-h-[200px] mb-6 rounded-full overflow-hidden border-4 border-gold-dark shadow-lg">
            <img
              src={vendorData.profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">Name</label>
            <p className="mt-2 text-gray-800 text-xl">{vendorData.name}</p>
          </div>

          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">Email</label>
            <p className="mt-2 text-gray-800 text-xl">{vendorData.email}</p>
          </div>

          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">Phone</label>
            <p className="mt-2 text-gray-800 text-xl">{vendorData.phone}</p>
          </div>

          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">Address</label>
            <p className="mt-2 text-gray-800 text-xl">{vendorData.address}</p>
          </div>

          <Link to="/vendor-edit-company">
            <button className="px-6 py-3 bg-gold-dark text-white font-semibold rounded-lg hover:bg-purple-dark transition-colors">
              Edit Profile
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default VendorProfile;
