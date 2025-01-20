import React, { useState, useEffect } from "react";
import getWeb3 from "../utils/getWeb3";
import Navbar from "../components/VendorNavbar";
import PointlyVendor from '../../build/contracts/PointlyVendor.json';

function VendorDashboard() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [vendorMetrics, setVendorMetrics] = useState({
    totalRedemptions: 0,
    activePromotions: 0,
    revenueGenerated: 0,
    upcomingPromotions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const contractAddress = "0x015E7Fc393975b10a122E874d3B051b9e6fb358E ";
        const pointlyVendorContract = new web3.eth.Contract(PointlyVendor.abi, contractAddress);

        setAccount(accounts[0]);
        setContract(pointlyVendorContract);

        await fetchVendorMetrics(accounts[0], pointlyVendorContract);
        setLoading(false);
      } catch (err) {
        console.error("Error initializing Web3:", err);
        setLoading(false);
      }
    };

    initWeb3();
  }, []);

  const fetchVendorMetrics = async (vendorAddress, pointlyVendorContract) => {
    try {
      const metrics = await pointlyVendorContract.methods.getVendor(vendorAddress).call();
      setVendorMetrics({
        totalRedemptions: metrics[0],
        activePromotions: metrics[1],
        revenueGenerated: metrics[2],
        upcomingPromotions: metrics[3],
      });
    } catch (error) {
      console.error("Error fetching vendor metrics:", error);
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
      <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
        <h2 className="text-3xl font-cabin text-gray-800 text-center">Vendor Dashboard</h2>
        <p className="mt-2 text-gray-600 text-center">
          Track your store's performance metrics and promotions.
        </p>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        <div className="mt-6 bg-gold-100 p-6 rounded-lg shadow-sm w-full mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Performance Metrics</h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center bg-white p-4 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-gray-700">
                {vendorMetrics.totalRedemptions}
              </h4>
              <p className="text-gray-500">Total Redemptions</p>
            </div>
            <div className="text-center bg-white p-4 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-gray-700">
                {vendorMetrics.activePromotions}
              </h4>
              <p className="text-gray-500">Active Promotions</p>
            </div>
            <div className="text-center bg-white p-4 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-gray-700">
                {vendorMetrics.revenueGenerated}
              </h4>
              <p className="text-gray-500">Revenue Generated</p>
            </div>
            <div className="text-center bg-white p-4 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-gray-700">
                {vendorMetrics.upcomingPromotions}
              </h4>
              <p className="text-gray-500">Upcoming Promotions</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-gray-600 text-center">
            Keep your metrics updated to improve store performance and attract more customers!
          </p>
        </div>
      </div>
    </>
  );
}

export default VendorDashboard;
