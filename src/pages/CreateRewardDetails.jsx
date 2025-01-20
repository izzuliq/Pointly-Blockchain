import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RewardsABI from "../../build/contracts/Rewards.json";

// ABI of the deployed Rewards contract (make sure to update with your ABI)
const contractAddress = "0x0b2D248A1F1d03f3a949982876A074fa716A4f52"; // Replace with your contract address

function CreateRewardDetails() {
  const [rewardInfo, setRewardInfo] = useState({
    name: "",
    description: "",
    cost: 0,
    img: "./default-image.png", // Default image
    expiration: "",
    terms: [""], // Default empty terms
  });
  const [loading, setLoading] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          // Request access to the user's MetaMask account
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          // Initialize contract
          const contractInstance = new web3Instance.eth.Contract(RewardsABI.abi, contractAddress);
          setContract(contractInstance);
        } catch (error) {
          console.error("Error initializing Web3 or MetaMask:", error);
          toast.error("Error initializing Web3 or MetaMask. Please try again.", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      } else {
        toast.error("MetaMask is not installed.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    };
    initializeWeb3();
  }, []);

  const handleSave = async () => {
    if (!contract || !account) {
      toast.error("Web3 or contract not initialized.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      setLoading(true);

      const { name, description, cost, img, expiration, terms } = rewardInfo;

      // Convert expiration date to timestamp (uint256)
      const expirationTimestamp = new Date(expiration).getTime() / 1000;

      // Send transaction to create a new reward in the smart contract
      const transaction = await contract.methods
        .addReward(name, description, cost, img, expirationTimestamp, terms)
        .send({ from: account });

      if (transaction.status) {
        toast.success("New reward created successfully on the blockchain!", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error("Failed to create reward on the blockchain.", {
          position: "top-center",
          autoClose: 3000,
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error creating reward:", error);
      toast.error("Failed to create new reward. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
      setLoading(false);
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
