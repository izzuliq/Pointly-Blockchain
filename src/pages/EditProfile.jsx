import React, { useState, useEffect } from "react";
import Navbar from "../components/UserNavbar";
import { useNavigate } from "react-router-dom";
import getContractInstance from "../utils/contract";
import getWeb3 from "../utils/getWeb3";
import { uploadToIPFS } from "../utils/ipfs";

function EditProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileImageCID, setProfileImageCID] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3 = await getWeb3(); // Fetch Web3 instance
        if (!web3) {
          alert("MetaMask not detected. Please install MetaMask to use this DApp.");
          return;
        }

        setIsMetaMaskAvailable(true);

        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          alert("Please connect your MetaMask wallet.");
          return;
        }

        setAccount(accounts[0]);

        const pointlyUserContract = await getContractInstance("PointlyUser");
        setContract(pointlyUserContract);

        if (accounts[0] && pointlyUserContract) {
          fetchUserProfile(accounts[0], pointlyUserContract);
        }

        // Listen for account or chain changes
        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            fetchUserProfile(accounts[0], pointlyUserContract);
          } else {
            setAccount(null);
            alert("Disconnected from MetaMask. Please reconnect.");
          }
        });

        window.ethereum.on("chainChanged", () => {
          window.location.reload(); // Reload on chain change to reinitialize DApp
        });
      } catch (err) {
        console.error("Error initializing Web3 or fetching contract:", err);
        alert("Failed to initialize Web3. Check your MetaMask connection.");
      }
    };

    initWeb3();
  }, []);

  const fetchUserProfile = async (userAddress, contract) => {
    try {
      const userProfile = await contract.methods.getUser(userAddress).call();
      setName(userProfile.name);
      setEmail(userProfile.email);
      setPhone(userProfile.phone);
      setAddress(userProfile.addressDetails);
      setProfileImageCID(userProfile.profileImage);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const ipfsUrl = await uploadToIPFS(file);
      setProfileImageCID(ipfsUrl); // Update the CID with the IPFS URL
    } catch (error) {
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!isMetaMaskAvailable) {
      alert("MetaMask not detected. Please install or enable MetaMask.");
      return;
    }

    try {
      await contract.methods
        .updateUser(name, email, phone, address, profileImageCID)
        .send({ from: account });

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Ensure your MetaMask wallet is connected.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-white shadow-md rounded-lg max-w-xl mx-auto text-center font-cabin">
        <h2 className="text-3xl font-cabin text-gray-800 text-center">Edit Profile</h2>
        <p className="mt-2 text-gray-600 text-center">Update your account details below.</p>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        <div className="mt-8 flex flex-col items-center">
          <div className="max-w-[200px] max-h-[200px] mb-6 rounded-full overflow-hidden border-4 border-gold-dark shadow-lg">
            <img
              src={profileImageCID || "default_avatar.jpg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full mb-6">
            <label className="block text-xl text-purple-dark">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 py-3 px-4 border rounded-lg bg-gray-100 text-center"
            />
          </div>

          <div className="w-full mb-6">
            <label className="block text-xl text-purple-dark">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 py-3 px-4 border rounded-lg bg-gray-100 text-center"
            />
          </div>

          <div className="w-full mb-6">
            <label className="block text-xl text-purple-dark">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mt-2 py-3 px-4 border rounded-lg bg-gray-100 text-center"
            />
          </div>

          <div className="w-full mb-6">
            <label className="block text-xl text-purple-dark">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full mt-2 py-3 px-4 border rounded-lg bg-gray-100 text-center"
            />
          </div>

          <div className="w-full mb-6">
            <label className="block text-xl text-purple-dark">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full mt-2 py-3 px-4 border rounded-lg bg-gray-100"
            />
            {isUploading && <p className="text-sm text-gray-500 mt-2">Uploading image...</p>}
          </div>

          <button
            className="px-6 py-3 bg-gold-dark text-white font-semibold rounded-lg hover:bg-purple-dark transition-colors"
            onClick={handleSave}
            disabled={isUploading}
          >
            Save Changes
          </button>

        </div>
      </div>
    </>
  );
}

export default EditProfilePage;
