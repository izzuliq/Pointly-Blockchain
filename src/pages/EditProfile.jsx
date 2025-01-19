import React, { useState, useEffect } from "react";
import Navbar from "../components/UserNavbar";
import Web3 from "web3";
import PointlyUser from "../../build/contracts/PointlyUser.json"; // Import ABI of PointlyUser.sol

function EditProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState("default_avatar.jpg");
  const [dob, setDob] = useState("");
  const [role, setRole] = useState("");
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

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

  const handleSave = async () => {
    try {
      const updatedData = await contract.methods.updateUser(name, email, phone, address, profileImage, role).send({ from: account });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Set the image preview URL
      };
      reader.readAsDataURL(file);
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
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
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
