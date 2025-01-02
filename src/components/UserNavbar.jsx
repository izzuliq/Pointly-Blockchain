import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTachometerAlt, FaGift, FaUserAlt, FaSignOutAlt } from 'react-icons/fa';

function Navbar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('User logged out');
    setShowLogoutModal(false);
    setShowThankYouModal(true);

    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-100 via-purple-800 to-purple-100 text-white py-4 font-cabin w-full z-50 shadow-lg">
      <ul className="flex justify-center space-x-12">
        <li>
          <Link to="/home" className="flex items-center space-x-2 hover:scale-105 transition-all duration-300">
            <FaHome />
            <span className="hidden md:inline">Home</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className="flex items-center space-x-2 hover:scale-105 transition-all duration-300">
            <FaTachometerAlt />
            <span className="hidden md:inline">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/rewards" className="flex items-center space-x-2 hover:scale-105 transition-all duration-300">
            <FaGift />
            <span className="hidden md:inline">Rewards</span>
          </Link>
        </li>
        <li>
          <Link to="/profile" className="flex items-center space-x-2 hover:scale-105 transition-all duration-300">
            <FaUserAlt />
            <span className="hidden md:inline">Profile</span>
          </Link>
        </li>
        <li>
          <button 
            onClick={() => setShowLogoutModal(true)} 
            className="flex items-center space-x-2 hover:scale-105 transition-all duration-300">
            <FaSignOutAlt />
            <span className="hidden md:inline">Log Out</span>
          </button>
        </li>
      </ul>

      {/* Popup Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 font-cabin">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-semibold text-gray-800 text-center">Log Out Confirmation</h3>
            <p className="mt-4 text-gray-600 text-center">Are you sure you want to log out of Pointly?</p>
            <div className="mt-6 flex justify-around">
              <button 
                onClick={handleLogout} 
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300"
              >
                Yes
              </button>
              <button 
                onClick={() => setShowLogoutModal(false)} 
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thank You Popup */}
      {showThankYouModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 text-center">
            <h2 className="text-xl text-black font-semibold mb-4">Thank you for using our service!</h2>
            <p className="text-gray-600">You will be redirected shortly.</p>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
