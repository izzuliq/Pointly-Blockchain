import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // React Router for navigation
import Navbar from "../components/UserNavbar";
import axios from "axios";

function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "Sarimah Jalil",
    email: "SJalil@gmail.com",
    phone: "(60)123456789",
    address: "123 Jalan Abu Karam, Kota Bharu, Kelantan, Malaysia",
    dob: "01/01/1990",
    profileImage: "Sarimah.png", // Default profile image
  });
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state

  useEffect(() => {
    // Fetch user profile data from API
    axios
      .get("/api/user/profile") // Replace with your API endpoint
      .then((response) => {
        // Set user data from API response
        setUserData({
          name: response.data.name || userData.name,
          email: response.data.email || userData.email,
          phone: response.data.phone || userData.phone,
          address: response.data.address || userData.address,
          dob: response.data.dob || userData.dob,
          profileImage: response.data.profileImage || userData.profileImage,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile data:", err);
        setError("Failed to fetch profile data.");
        setLoading(false);
      });
  }, []); // Run once on mount

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return (
    <>
      <Navbar />
      <div className="p-6 bg-white shadow-md rounded-lg max-w-xl mx-auto font-cabin">
        <h2 className="text-3xl font-cabin text-gray-800 text-center">
          User Profile
        </h2>
        <p className="mt-2 text-gray-600 text-center">
          View and manage your account details.
        </p>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        <div className="mt-8 flex flex-col items-center">
          {/* Profile Picture */}
          <div className="max-w-[200px] max-h-[200px] mb-6 rounded-full overflow-hidden border-4 border-gold-dark shadow-lg">
            <img
              src={userData.profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name */}
          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">
              Name
            </label>
            <p className="mt-2 text-gray-800 text-xl">{userData.name}</p>
          </div>

          {/* Email */}
          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">
              Email
            </label>
            <p className="mt-2 text-gray-800 text-xl">{userData.email}</p>
          </div>

          {/* Phone */}
          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">
              Phone
            </label>
            <p className="mt-2 text-gray-800 text-xl">{userData.phone}</p>
          </div>

          {/* Address */}
          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">
              Address
            </label>
            <p className="mt-2 text-gray-800 text-xl">{userData.address}</p>
          </div>

          {/* Date of Birth */}
          <div className="w-full mb-6 text-center">
            <label className="block text-2xl font-cabin text-purple-dark">
              Date of Birth
            </label>
            <p className="mt-2 text-gray-800 text-xl">{userData.dob}</p>
          </div>

          {/* Edit Button */}
          <Link to="/EditProfile">
            <button className="px-6 py-3 bg-gold-dark text-white font-semibold rounded-lg hover:bg-purple-dark transition-colors">
              Edit Profile
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
