import React, { useState, useEffect } from "react";
import VendorNavbar from "../components/VendorNavbar";
import { useNavigate } from "react-router-dom";
import { uploadToIPFS } from "../utils/ipfs"; // Import the uploadToIPFS function
import getContractInstance from "../utils/contract"; 
import getWeb3 from "../utils/getWeb3"; // Import getWeb3 function

function VendorEditCompanyPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const navigate = useNavigate(); 

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3 = await getWeb3(); // Use getWeb3 to initialize Web3
        const accounts = await web3.eth.getAccounts(); // Get the accounts using Web3 instance
        setAccount(accounts[0]);

        // Use the getContractInstance function to get the contract
        const pointlyUserContract = await getContractInstance("PointlyUser", web3);
        setContract(pointlyUserContract);

        if (accounts[0] && pointlyUserContract) {
          fetchUserProfile(accounts[0], pointlyUserContract);
        }
      } catch (err) {
        console.error("Error initializing Web3:", err);
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
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadToIPFS(file); // Use the uploadToIPFS function
        setProfileImage(imageUrl); // Set the image URL
      } catch (err) {
        console.error("Error uploading image:", err);
      }
    }
  };

  const handleSave = async () => {
    try {
      await contract.methods.updateUser(name, email, phone, address, profileImage).send({ from: account });
      alert("Profile updated successfully!");

      // Redirect to the profile page after successful update
      navigate("/vendor-profile"); 
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <>
      <VendorNavbar />
      <div className="p-6 bg-white shadow-md rounded-lg max-w-xl mx-auto text-center font-cabin">
        <h2 className="text-3xl font-cabin text-gray-800 text-center">Edit Vendor Profile</h2>
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
            <label className="block text-xl text-purple-dark">Company Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full mt-2 py-3 px-4 border rounded-lg bg-gray-100"
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

export default VendorEditCompanyPage;
