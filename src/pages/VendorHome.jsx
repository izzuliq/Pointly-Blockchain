import React from 'react';
import { Link } from "react-router-dom";
import VendorNavbar from "../components/VendorNavbar";

function VendorHome() {
  return (
    <>
      <VendorNavbar />
      <div className="flex flex-col items-center justify-center h-full p-6">
        {/* Header */}
        <img src="./PointlyLogoBlack.png" alt="Company Logo" className="mt-10 mb-6 w-[300px] h-auto" />
        <h1 className="text-5xl font-bold text-purple">Welcome, Vendor!</h1>
        <p className="mt-4 text-3xl font-bold text-gray-800 italic">"Points Simplified"</p>

        {/* Description */}
        <div className="mt-5 max-w-3xl text-center mb-5">
          <p className="text-lg text-gray-700">
            Manage your rewards, track redemptions, and engage with loyal customers all in one place. Pointly helps you 
            create meaningful connections with your customers while driving your business forward.
          </p>
        </div>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        {/* Features Section */}
        <h2 className="text-3xl font-bold text-purple-dark">Why Partner with Pointly?</h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gold-light shadow-lg rounded-lg p-6 flex flex-col items-center">
            <img src="./Manage.png" alt="Manage Rewards" className="max-w-[300px] max-h-[300px] mb-4" />
            <div className="text-center">
              <h3 className="text-3xl font-semibold text-dark">Manage Rewards</h3>
              <p className="text-black">Create, update, and monitor your loyalty rewards with ease.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-gold-light shadow-lg rounded-lg p-6 flex flex-col items-center">
            <img src="./Insight.png" alt="Customer Insights" className="max-w-[300px] max-h-[300px] mb-4" />
            <div className="text-center">
              <h3 className="text-3xl font-semibold text-black">Customer Insights</h3>
              <p className="text-black">Gain valuable insights into customer behavior and reward trends.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-gold-light shadow-lg rounded-lg p-6 flex flex-col items-center">
            <img src="./Boost.png" alt="Boost Sales" className="max-w-[300px] max-h-[300px] mb-4" />
            <div className="text-center">
              <h3 className="text-3xl font-semibold text-black">Boost Sales</h3>
              <p className="text-black">Engage customers and drive more transactions through rewards.</p>
            </div>
          </div>
        </div>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        {/* Call to Action */}
        <div className="mt-5 text-center">
          <h2 className="text-3xl font-bold text-purple-dark">Start Engaging Your Customers Today!</h2>
          <p className="mt-4 text-lg text-gray-700">
            Manage rewards, view analytics, and grow your customer base with Pointly.
          </p>
          <button className="mt-6 px-6 py-3 bg-gold-dark text-white font-semibold rounded-lg hover:bg-purple-dark transition-colors">
            <Link to="/vendor-dashboard">Go to Dashboard</Link>
          </button>
        </div>

        {/* Image Section */}
        <div className="mt-12">
          <img src="Banner2.png" alt="Vendor Illustration" className="w-full max-w-[1000px] max-h-[500px] rounded-lg shadow-lg" />
        </div>
      </div>
    </>
  );
}

export default VendorHome;
