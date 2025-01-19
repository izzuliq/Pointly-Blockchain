import React, { useState, useEffect } from "react";
import VendorNavbar from "../components/VendorNavbar";
import { Link } from "react-router-dom"; // Import Link for navigation
import Web3 from "web3"; // Import Web3 for blockchain interaction
import PointlyVendorABI from "../contracts/PointlyVendor.json"; // Import the ABI of the PointlyVendor contract

function VendorProfile() {
  const [vendorData, setVendorData] = useState(null); // Store vendor data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Smart contract and Web3 setup
  const web3 = new Web3(window.ethereum);
  const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with actual contract address
  const contract = new web3.eth.Contract(PointlyVendorABI, contractAddress);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const accounts = await web3.eth.requestAccounts();
        const vendorAddress = accounts[0]; // Use the current user's address

        // Fetch vendor details from the smart contract
        const vendorDetails = await contract.methods.getVendor(vendorAddress).call();

        setVendorData({
          name: vendorDetails.name,
          email: vendorDetails.email,
          phone: vendorDetails.phone,
          businessAddress: vendorDetails.businessAddress,
          totalRedemptions: vendorDetails.totalRedemptions,
          activePromotions: vendorDetails.activePromotions,
          revenueGenerated: vendorDetails.revenueGenerated,
          upcomingPromotions: vendorDetails.upcomingPromotions,
          exists: vendorDetails.exists,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching vendor data:", err);
        setError("Failed to fetch vendor data.");
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

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
    return <div>{error}</div>; // Display error message if API fails
  }

  if (!vendorData.exists) {
    return (
      <div>
        <p className="text-center text-xl text-red-600">
          Vendor profile not found. Please register.
        </p>
        <Link to="/vendor-register">
          <button className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            Register Vendor
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <VendorNavbar />
      <div className="p-6 bg-white shadow-md rounded-lg max-w-xl mx-auto font-cabin">
        <h2 className="text-3xl font-cabin text-gray-800 text-center">
          Vendor Profile
        </h2>
        <p className="mt-2 text-gray-600 text-center">
          View and manage your vendor details.
        </p>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        {/* Vendor Profile Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-purple-dark text-center mb-4">
            Vendor Profile
          </h3>

          <div className="text-center">
            {/* Vendor Name */}
            <div className="w-full mb-6">
              <label className="block text-xl font-cabin text-purple-dark">
                Name
              </label>
              <p className="mt-2 text-gray-800 text-xl">{vendorData.name}</p>
            </div>

            {/* Vendor Email */}
            <div className="w-full mb-6">
              <label className="block text-xl font-cabin text-purple-dark">
                Email
              </label>
              <p className="mt-2 text-gray-800 text-xl">{vendorData.email}</p>
            </div>

            {/* Vendor Phone */}
            <div className="w-full mb-6">
              <label className="block text-xl font-cabin text-purple-dark">
                Phone
              </label>
              <p className="mt-2 text-gray-800 text-xl">{vendorData.phone}</p>
            </div>

            {/* Business Address */}
            <div className="w-full mb-6">
              <label className="block text-xl font-cabin text-purple-dark">
                Business Address
              </label>
              <p className="mt-2 text-gray-800 text-xl">{vendorData.businessAddress}</p>
            </div>

            {/* Edit Vendor Profile Button */}
            <div className="mt-4 text-center">
              <Link to="/vendor-edit-profile">
                <button className="px-6 py-3 bg-gold-dark text-white font-semibold rounded-lg hover:bg-purple-dark transition-colors">
                  Edit Vendor Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorProfile;
