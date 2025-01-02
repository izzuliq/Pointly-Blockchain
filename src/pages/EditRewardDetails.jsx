import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function EditRewardDetails() {
  const { rewardId } = useParams(); // Use useParams to get rewardId from URL
  const [rewardInfo, setRewardInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample reward details data
  const rewardDetails = {
    1: {
      id: 1,
      name: "Free Coffee",
      description: "Enjoy a freshly brewed cup of coffee.",
      cost: 300,
      img: "./Coffee.png", // Default image
      expiration: "2025-01-31",
      terms: [
        "This offer is available at participating coffee shops only.",
        "The coffee must be claimed in-store and cannot be redeemed online.",
        "Offer valid once per customer.",
      ],
    },
    2: {
      id: 2,
      name: "Gift Voucher",
      description: "Redeem your points for a gift voucher.",
      cost: 500,
      img: "./Voucher.png", // Default image
      expiration: "2025-02-15",
      terms: [
        "Voucher can be used in participating stores only.",
        "This voucher cannot be exchanged for cash.",
        "Voucher expires after 6 months from the date of issuance.",
      ],
    },
  };

  useEffect(() => {
    // Simulate fetching the reward data using the sample rewardDetails
    const reward = rewardDetails[rewardId];
    if (reward) {
      setRewardInfo(reward);
    }
    setLoading(false); // Set loading to false after data is loaded
  }, [rewardId]);

  const handleSave = () => {
    // For testing, we'll just log the updated data to the console
    console.log("Updated Reward Info:", rewardInfo);
    alert("Reward details updated successfully!");
  };

  const handleDateChange = (e) => {
    setRewardInfo({
      ...rewardInfo,
      expiration: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRewardInfo({ ...rewardInfo, img: reader.result });
      };
      reader.readAsDataURL(file); // Read the file as a data URL (base64)
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

  if (!rewardInfo) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-red-600">Reward not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 text-center">
        Edit Reward Details
      </h2>

      <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

      {/* Promo Image */}
      <div className="mt-4 mb-6 flex flex-col items-center">
        <div className="w-32 h-32 mb-4 overflow-hidden rounded-lg">
          <img
            src={rewardInfo.img} // Display the reward image (either default or uploaded)
            alt="Reward"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Image Upload Input */}
        <div className="w-full mb-6">
          <label className="block text-lg text-gray-700" htmlFor="reward-image">
            Reward Image
          </label>
          <input
            type="file"
            id="reward-image"
            onChange={handleImageChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Reward Name Input */}
      <div className="w-full mb-4">
        <label className="block text-lg text-gray-700" htmlFor="name">Reward Name</label>
        <input
          type="text"
          id="name"
          value={rewardInfo.name}
          onChange={(e) => setRewardInfo({ ...rewardInfo, name: e.target.value })}
          className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
          placeholder="Enter reward name"
        />
      </div>

      {/* Reward Description Input */}
      <div className="w-full mb-4">
        <label className="block text-lg text-gray-700" htmlFor="description">Description</label>
        <textarea
          id="description"
          value={rewardInfo.description}
          onChange={(e) => setRewardInfo({ ...rewardInfo, description: e.target.value })}
          className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
          placeholder="Enter reward description"
        ></textarea>
      </div>

      {/* Reward Cost (Points) Input */}
      <div className="w-full mb-4">
        <label className="block text-lg text-gray-700" htmlFor="cost">Cost (Points)</label>
        <input
          type="number"
          id="cost"
          value={rewardInfo.cost}
          onChange={(e) => setRewardInfo({ ...rewardInfo, cost: e.target.value })}
          className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
          placeholder="Enter reward cost"
        />
      </div>

      {/* Expiration Date Input */}
      <div className="w-full mb-6">
        <label className="block text-lg text-gray-700" htmlFor="expiration">Expiration Date</label>
        <input
          type="date"
          id="expiration"
          value={rewardInfo.expiration}
          onChange={handleDateChange}
          className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Terms & Conditions Input */}
      <div className="w-full mb-6">
        <label className="block text-lg text-gray-700" htmlFor="terms">Terms & Conditions</label>
        <textarea
          id="terms"
          value={rewardInfo.terms.join("\n")}
          onChange={(e) => setRewardInfo({ ...rewardInfo, terms: e.target.value.split("\n") })}
          className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
          placeholder="Enter terms & conditions"
        ></textarea>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-gold-dark text-white py-3 rounded-lg hover:bg-purple transition-colors"
      >
        Save Changes
      </button>
    </div>
  );
}

export default EditRewardDetails;
