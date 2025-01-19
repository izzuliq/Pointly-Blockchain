import React, { useState, useEffect } from "react";
import Navbar from "../components/UserNavbar";
import Web3 from "web3";
import PointlyUser from "../../build/contracts/PointlyUser.json"; // Import ABI of PointlyUser.sol
import { create } from 'ipfs-http-client';
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Set up the Pinata IPFS client
const ipfsClient = create({
  url: 'https://api.pinata.cloud/pinning/pinFileToIPFS', // Pinata IPFS endpoint
  headers: {
    pinata_api_key: '6acc3acafb6a1f19f825', // Replace with your Pinata API key
  }
});

function EditProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState(""); // Store the IPFS CID
  const [role, setRole] = useState("");
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        
        // Request access to the user's Ethereum accounts
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);
  
          const contractAddress = "0x8D67D204b25ccA0EA4Dcb249C5bFeA6Ef54C8AD9"; // Replace with your contract address
          const pointlyUserContract = new web3.eth.Contract(PointlyUser.abi, contractAddress);
          setContract(pointlyUserContract);
  
          if (accounts[0] && pointlyUserContract) {
            fetchUserProfile(accounts[0], pointlyUserContract);
          }
        } catch (err) {
          console.error("Error requesting accounts:", err);
        }
      } else {
        console.error("Ethereum wallet not detected. Please install MetaMask.");
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
      setProfileImage(userProfile.profileImage);
      setRole(userProfile.role);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Prepare the file for upload
        const formData = new FormData();
        formData.append('file', file);
        
        // Send the file to Pinata using the correct endpoint and headers
        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
          method: 'POST',
          headers: {
            pinata_api_key: '6acc3acafb6a1f19f825', // Replace with your Pinata API key
            pinata_secret_api_key: '66001fa51b401321cfcda182b365f7e279a18a4f3f0f139ed689b608e0e2cf72', // Replace with your Pinata secret API key
          },
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
  
        const result = await response.json();
        const imageUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
        setProfileImage(imageUrl); // Set the image URL
      } catch (err) {
        console.error("Error uploading image to IPFS via Pinata:", err);
      }
    }
  };

  const handleSave = async () => {
    try {
      const updatedData = await contract.methods.updateUser(name, email, phone, address, profileImage, role).send({ from: account });
      alert("Profile updated successfully!");

      // Redirect to the profile page after successful update
      navigate("/profile"); // This will navigate to the /profile route
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
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
            <img src={profileImage || 'default_avatar.jpg'} alt="Profile" className="w-full h-full object-cover" />
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
          </div>

          <div className="w-full mb-6">
            <label className="block text-xl text-purple-dark">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-2 py-3 px-4 border rounded-lg bg-gray-100 text-center"
            />
          </div>

          <button
            className="px-6 py-3 bg-gold-dark text-white font-semibold rounded-lg hover:bg-purple-dark transition-colors"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}

export default EditProfilePage;
