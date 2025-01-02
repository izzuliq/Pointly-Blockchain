import React, { useState } from "react";
import axios from "axios"; // Import axios for HTTP requests
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateRewardDetails() {
  const [rewardInfo, setRewardInfo] = useState({
    name: "",
    description: "",
    cost: 0,
    img: "./default-image.png", // Default image
    expiration: "",
    terms: [""] // Default empty terms
  });

  const [loading, setLoading] = useState(false); // Loading state for handling the save process

  const handleSave = async () => {
    try {
      setLoading(true); // Set loading state to true when saving

      // Prepare the data to be sent to the server
      const formData = new FormData();
      formData.append("name", rewardInfo.name);
      formData.append("description", rewardInfo.description);
      formData.append("cost", rewardInfo.cost);
      formData.append("img", rewardInfo.img); // You can send base64 or a file here
      formData.append("expiration", rewardInfo.expiration);
      formData.append("terms", rewardInfo.terms.join("\n"));

      // Send the data using axios (replace with your API endpoint)
      const response = await axios.post('/api/rewards', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      // Handle success response
      if (response.status === 200) {
        toast.success("New reward created successfully!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });
      }

      setLoading(false); // Set loading state to false after response
    } catch (error) {
      console.error("Error creating reward:", error);
      toast.error("Failed to create new reward. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
      setLoading(false); // Set loading state to false in case of an error
    }
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
      <h2 className="text-3xl font-semibold text-gray-800 text-center ">
        Create New Reward
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
        disabled={loading} // Disable the button while loading
      >
        {loading ? "Saving..." : "Create Reward"}
      </button>

      {/* Toast container for notifications */}
      <ToastContainer />
    </div>
  );
}

export default CreateRewardDetails;
