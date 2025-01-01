import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // React Router for navigation

function ProfilePage() {
  const [name, setName] = useState("Sarimah Jalil");
  const [email, setEmail] = useState("SJalil@gamil.com");
  const [phone, setPhone] = useState("(60) 123456789");
  const [address, setAddress] = useState("123 Jalan Abu Karam, Kota Bharu, Kelantan, Malaysia");
  const [dob, setDob] = useState("01/01/1990");

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 text-center">Profile</h2>
      <p className="mt-2 text-gray-600 text-center">View and manage your account details.</p>
      
      <div className="mt-8 flex flex-col items-center">
        {/* Profile Picture */}
        <div className="w-24 h-24 mb-6 rounded-full overflow-hidden">
          <img
            src="Sarimah.png"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name */}
        <div className="w-full mb-6 text-center">
          <label className="block text-2xl font-cabin text-purple-dark">Name</label>
          <p className="mt-2 text-gray-800 text-xl">{name}</p>
        </div>

        {/* Email */}
        <div className="w-full mb-6 text-center">
          <label className="block text-2xl font-cabin text-purple-dark">Email</label>
          <p className="mt-2 text-gray-800 text-xl">{email}</p>
        </div>

        {/* Phone */}
        <div className="w-full mb-6 text-center">
          <label className="block text-2xl font-cabin text-purple-dark">Phone</label>
          <p className="mt-2 text-gray-800 text-xl">{phone}</p>
        </div>

        {/* Address */}
        <div className="w-full mb-6 text-center">
          <label className="block text-2xl font-cabin text-purple-dark">Address</label>
          <p className="mt-2 text-gray-800 text-xl">{address}</p>
        </div>

        {/* Date of Birth */}
        <div className="w-full mb-6 text-center">
          <label className="block text-2xl font-cabin text-purple-dark">Date of Birth</label>
          <p className="mt-2 text-gray-800 text-xl">{dob}</p>
        </div>

        {/* Edit Button */}
        <Link to="/EditProfile">
          <button className="px-6 py-3 bg-gold-dark text-white font-semibold rounded-lg hover:bg-purple-dark transition-colors">
            Edit Profile
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ProfilePage;
