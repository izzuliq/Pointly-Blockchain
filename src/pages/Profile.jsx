import React, { useState } from 'react';

function Profile() {
  // State to manage input fields (name, email, etc.)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSave = () => {
    // Handle saving of updated details
    alert("Profile updated!");
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800">Profile</h2>
      <p className="mt-2 text-gray-600">Update your account details and preferences.</p>
      
      <div className="mt-8 flex flex-col items-center">
        {/* Profile Picture */}
        <div className="w-24 h-24 mb-4 rounded-full overflow-hidden">
          <img
            src="https://via.placeholder.com/150"  // Replace with dynamic user image
            alt="Profile"
            className="w-full h-full object-cover"
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
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
            placeholder="Enter your name"
          />
        </div>

        {/* Email Input */}
        <div className="w-full mb-6">
          <label className="block text-lg text-gray-700" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
            placeholder="Enter your email"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-purple text-white font-semibold rounded-lg hover:bg-purple-dark transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Profile;
