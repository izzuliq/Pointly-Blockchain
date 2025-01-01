import React, { useState } from "react";

function CreateRewardDetails() {
  const [rewardInfo, setRewardInfo] = useState({
    name: "",
    description: "",
    cost: 0,
    img: "./default-image.png", // Default image
    expiration: "",
    terms: [""] // Default empty terms
  });

  const handleSave = () => {
    // Handle saving of new reward information (image and text fields)
    alert("New reward created!");
    // You can implement the logic to save the reward info, e.g., sending it to an API or state.
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
        setRewardInfo({ ...rewardInfo, img: reader.result }); // Update image to the selected file
      };
      reader.readAsDataURL(file); // Read the file as a data URL (base64)
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-4">
        Create New Reward
      </h2>

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
        Create Reward
      </button>
    </div>
  );
}

export default CreateRewardDetails;
