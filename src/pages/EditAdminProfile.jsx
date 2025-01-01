import React, { useState } from "react";
import VendorNavbar from "../components/VendorNavbar";

function VendorEditAdminPage() {
  const [name, setName] = useState("Alex Chin Wei Mei");
  const [email, setEmail] = useState("alexcwm@kfcmalaysia.com");
  const [phone, setPhone] = useState("(60)1239873456");
  const [profilePicture, setProfilePicture] = useState("https://via.placeholder.com/150");

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

  const handleSave = () => {
    // Handle saving of updated details (image and text fields)
    alert("Admin profile updated!");
  };

  return (
    <>
      <VendorNavbar />
      <div className="p-6 bg-white shadow-md rounded-lg max-w-xl mx-auto text-center font-cabin">
        <h2 className="text-3xl font-cabin text-gray-800">Edit Admin Profile</h2>
        <p className="mt-2 text-gray-600">Update your admin details below.</p>

        <div className="mt-8 flex flex-col items-center">
          {/* Profile Picture */}
          <div className="w-24 h-24 mb-4 rounded-full overflow-hidden">
            <img
              src={profilePicture}  // Display the profile picture (either default or uploaded)
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
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg text-center items-center"
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
              placeholder="Enter admin name"
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
              placeholder="Enter admin email"
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
              placeholder="Enter admin phone number"
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

export default VendorEditAdminPage;
