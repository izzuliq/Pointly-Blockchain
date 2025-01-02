import React, { useState } from "react";
import VendorNavbar from "../components/VendorNavbar";
import axios from 'axios'; // Import axios for making HTTP requests
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VendorEditAdminPage() {
  const [name, setName] = useState("Alex Chin Wei Mei");
  const [email, setEmail] = useState("alexcwm@kfcmalaysia.com");
  const [phone, setPhone] = useState("(60)1239873456");
  const [profilePicture, setProfilePicture] = useState("https://via.placeholder.com/150");
  const [loading, setLoading] = useState(false); // Loading state for handling the save process

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
      setLoading(true); // Set loading state to true when saving

      // Prepare the data to be sent to the server
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("profilePicture", profilePicture); // You can send base64 or a file here

      // Send the data using axios (replace with your API endpoint)
      const response = await axios.put('/api/vendor/admin/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      // Handle success response
      if (response.status === 200) {
        toast.success("Admin profile updated successfully!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });
      }

      setLoading(false); // Set loading state to false after response
    } catch (error) {
      console.error("Error updating admin profile:", error);
      toast.error("Failed to update admin profile. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
      setLoading(false); // Set loading state to false in case of an error
    }
  };

  return (
    <>
      <VendorNavbar />
      <div className="p-6 bg-white shadow-md rounded-lg max-w-xl mx-auto text-center font-cabin">
        <h2 className="text-3xl font-cabin text-gray-800">Edit Admin Profile</h2>
        <p className="mt-2 text-gray-600">Update your admin details below.</p>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

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
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer />
    </>
  );
}

export default VendorEditAdminPage;
