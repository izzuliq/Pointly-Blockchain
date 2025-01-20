import React, { useState, useEffect } from "react";
import VendorNavbar from "../components/VendorNavbar";
import { useNavigate, useParams } from "react-router-dom";
import getContractInstance from "../utils/contract";
import getWeb3 from "../utils/getWeb3";
import { uploadToIPFS } from "../utils/ipfs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditRewardDetails() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState(0);
  const [expiration, setExpiration] = useState("");
  const [terms, setTerms] = useState([""]);
  const [img, setImg] = useState(""); // Store base64 or IPFS URL
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);
  const [rewardId, setRewardId] = useState(null);

  const navigate = useNavigate();
  const { rewardId: rewardIdParam } = useParams(); // Fetch reward ID from URL parameters

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3 = await getWeb3(); // Fetch Web3 instance
          if (!web3) {
            toast.error("MetaMask not detected. Please install MetaMask.");
            return;
          }

          setIsMetaMaskAvailable(true);
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);

          const rewardsContract = await getContractInstance("Rewards");
          setContract(rewardsContract);

          if (rewardsContract && rewardIdParam) {
            setRewardId(rewardIdParam);
            await fetchRewardDetails(rewardsContract, rewardIdParam);
          }
        } catch (error) {
          toast.error("Error initializing Web3 or MetaMask. Please try again.");
        }
      } else {
        toast.error("MetaMask is not installed.");
      }
    };
    initializeWeb3();
  }, [rewardIdParam]);

  // Fetch the existing reward details
  const fetchRewardDetails = async (contract, rewardId) => {
    try {
      const reward = await contract.methods.getRewardDetails(rewardId).call();
      setName(reward.name);
      setDescription(reward.description);
      setCost(reward.cost);
      setImg(reward.img);
      setExpiration(new Date(Number(reward.expiration) * 1000).toISOString().split("T")[0]);
      setTerms(reward.terms);
    } catch (error) {
      toast.error("Failed to fetch reward details. Please try again.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const ipfsUrl = await uploadToIPFS(file);
      if (!ipfsUrl) {
        toast.error("Image upload failed.");
        return;
      }
      setImg(ipfsUrl); // Set IPFS URL as image URL
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isMetaMaskAvailable || !account || !contract || !rewardId) {
      toast.error("MetaMask or contract not initialized.");
      return;
    }

    try {
      setLoading(true);

      // Convert expiration date to timestamp (uint256)
      const expirationTimestamp = new Date(expiration).getTime() / 1000;
      if (isNaN(expirationTimestamp)) {
        toast.error("Invalid expiration date.");
        return;
      }

      // Send transaction to update the existing reward in the smart contract
      const transaction = await contract.methods
        .editReward(rewardId, name, description, cost, img, expirationTimestamp, terms) // Use `editReward` method instead of `addReward`
        .send({ from: account })
        .on('transactionHash', function (hash) {
          console.log("Transaction hash:", hash);
        });

      if (transaction.status) {
        toast.success("Reward updated successfully on the blockchain!");
        navigate("/vendor-rewards");
      } else {
        toast.error("Transaction failed on the blockchain.");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error in transaction:", error);
      toast.error("Failed to update the reward. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <VendorNavbar />
      <div className="p-6 bg-white shadow-md rounded-lg max-w-xl mx-auto text-center font-cabin">
        <h2 className="text-3xl font-cabin text-gray-800 text-center">Edit Reward</h2>
        <p className="mt-2 text-gray-600 text-center">Update the details of your reward.</p>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        <div className="mt-8 flex flex-col items-center">
          <div className="max-w-[200px] max-h-[200px] mb-6 rounded-md overflow-hidden border-4 border-gold-dark shadow-lg">
            <img
              src={img || "default_reward.png"}
              alt="Reward Image"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full mb-6">
            <label className="block text-xl text-purple-dark">Reward Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full mt-2 py-3 px-4 border rounded-lg bg-gray-100"
            />
            {loading && <p className="text-sm text-gray-500 mt-2">Uploading image...</p>}
          </div>

          <div className="w-full mb-6">
            <label className="block text-xl text-purple-dark">Reward Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 py-3 px-4 border rounded-lg bg-gray-100 text-center"
            />
          </div>

          <div className="w-full mb-6">
            <label className="block text-xl text-purple-dark">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-2 py-3 px-4 border rounded-lg bg-gray-100 text-center"
            />
          </div>

          <div className="w-full mb-6">
            <label className="block text-xl text-purple-dark">Cost (Points)</label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="w-full mt-2 py-3 px-4 border rounded-lg bg-gray-100 text-center"
            />
          </div>

          <div className="w-full mb-6">
            <label className="block text-xl text-purple-dark">Expiration Date</label>
            <input
              type="date"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
              className="w-full mt-2 py-3 px-4 border rounded-lg bg-gray-100 text-center"
            />
          </div>

          <div className="w-full mb-6">
            <label className="block text-xl text-purple-dark">Terms & Conditions</label>
            <textarea
              value={terms.join("\n")}
              onChange={(e) => setTerms(e.target.value.split("\n"))}
              className="w-full mt-2 py-3 px-4 border rounded-lg bg-gray-100 text-center"
            />
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gold-dark text-white font-semibold rounded-lg hover:bg-purple-dark transition-colors"
            disabled={loading}
          >
            {loading ? "Saving..." : "Update Reward"}
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default EditRewardDetails;
