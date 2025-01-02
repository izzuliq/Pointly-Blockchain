import React, { useState } from 'react';
import Navbar from "../components/UserNavbar";
import axios from 'axios';

function EditProfilePage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("(123) 456-7890");
  const [address, setAddress] = useState("123 Main Street, Springfield, IL");
  const [dob, setDob] = useState("01/01/1990");
  const [profilePicture, setProfilePicture] = useState("https://via.placeholder.com/150");

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result); // Update profile picture to the selected image
      };
      reader.readAsDataURL(file); // Read the file as a data URL (base64)
    }
  };

  const handleSave = async () => {
    try {
      // Prepare the data to be sent to the server
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("dob", dob);
      formData.append("profilePicture", profilePicture); // You can also send a file instead of base64 if needed

      // Send the data using axios (replace with your API endpoint)
      const response = await axios.put('/api/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      // Handle success response (you can customize this)
      if (response.status === 200) {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
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
          {/* Profile Picture */}
          <div className="w-24 h-24 mb-4 rounded-full overflow-hidden">
            <img
              src={profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Image Upload Input */}
          <div className="w-full mb-6">
            <label className="block text-lg text-gray-700" htmlFor="profile-picture">Profile Picture</label>
            <input
              type="file"
              id="profile-picture"
              onChange={handleImageChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg text-center"
            />
          </div>

          {/* Name Input */}
          <div className="w-full mb-4">
            <label className="block text-lg text-gray-700" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg text-center"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Input */}
          <div className="w-full mb-4">
            <label className="block text-lg text-gray-700" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg text-center"
              placeholder="Enter your email"
            />
          </div>

          {/* Phone Input */}
          <div className="w-full mb-4">
            <label className="block text-lg text-gray-700" htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg text-center"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Address Input */}
          <div className="w-full mb-4">
            <label className="block text-lg text-gray-700" htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg text-center"
              placeholder="Enter your address"
            />
          </div>

          {/* Date of Birth Input */}
          <div className="w-full mb-6">
            <label className="block text-lg text-gray-700" htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg text-center"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gold-dark text-white font-semibold rounded-lg hover:bg-purple-dark transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}

export default EditProfilePage;
