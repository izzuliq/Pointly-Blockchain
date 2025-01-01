import React from "react";
import Navbar from "../components/Navbar";

function Rewards() {
  return (
    <>
      <Navbar />
      <div className="p-6 bg-white shadow-md rounded-lg">
        {/* Page Header */}
        <h2 className="text-2xl font-semibold text-gray-800">Rewards</h2>
        <p className="mt-2 text-gray-600">
          Redeem your points for amazing rewards.
        </p>

        {/* Points Overview Section */}
        <div className="mt-6 bg-purple-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">Your Points</h3>
          <div className="mt-4 flex justify-between">
            <div>
              <h4 className="text-xl font-semibold text-gray-700">1200</h4>
              <p className="text-gray-500">Available Points</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-700">500</h4>
              <p className="text-gray-500">Points Needed to Redeem</p>
            </div>
          </div>
        </div>

        {/* Rewards Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800">
            Available Rewards
          </h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Reward 1 */}
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
              <img
                src="./Coffee.png"
                alt="Free Coffee"
                className="max-w-[300px] max-h-[300px] object-cover mb-4 rounded-lg" // Image with size
              />
              <h4 className="text-xl font-semibold text-gray-700">
                Free Coffee
              </h4>
              <p className="mt-2 text-gray-500">Cost: 300 points</p>
              <p className="mt-2 text-gray-600 text-center">
                Enjoy a freshly brewed cup of coffee with your reward points.
              </p>{" "}
              {/* Description */}
              <button className="mt-4 w-full bg-gold-dark text-white py-2 rounded-lg">
                Redeem
              </button>
            </div>

            {/* Reward 2 */}
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
              <img
                src="./Voucher.png"
                alt="Gift Voucher"
                className="max-w-[300px] max-h-[300px] object-cover mb-4 rounded-lg" // Image with size
              />
              <h4 className="text-xl font-semibold text-gray-700">
                Gift Voucher
              </h4>
              <p className="mt-2 text-gray-500">Cost: 500 points</p>
              <p className="mt-2 text-gray-600 text-center">
                Redeem your points for a gift voucher to use in participating
                stores.
              </p>{" "}
              {/* Description */}
              <button className="mt-4 w-full bg-gold-dark text-white py-2 rounded-lg">
                Redeem
              </button>
            </div>

            {/* Reward 3 */}
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
              <img
                src="./Discount.png"
                alt="Exclusive Discount"
                className="max-w-[300px] max-h-[300px] object-cover mb-4 rounded-lg" // Image with size
              />
              <h4 className="text-xl font-semibold text-gray-700">
                Exclusive Discount
              </h4>
              <p className="mt-2 text-gray-500">Cost: 1000 points</p>
              <p className="mt-2 text-gray-600 text-center">
                Unlock exclusive discounts on your next purchase with this
                reward.
              </p>{" "}
              {/* Description */}
              <button className="mt-4 w-full bg-gold-dark text-white py-2 rounded-lg">
                Redeem
              </button>
            </div>
          </div>
        </div>

        {/* Redeem Button Section */}
        <div className="mt-8 text-center">
          <button className="bg-purple text-white py-2 px-6 rounded-lg">
            Proceed to Redeem
          </button>
        </div>
      </div>
    </>
  );
}

export default Rewards;
