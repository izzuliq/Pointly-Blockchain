import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from '../components/UserNavbar';
import ReviewsCarousel from '../components/Review';

function Home() {
  const [userRole, setUserRole] = useState(null); // To store user role after login
  const location = useLocation(); // Access the state passed from the Login page
  const navigate = useNavigate(); // Initialize navigate hook

  const { userId, userRole: roleFromState } = location.state || {}; // Get userId and userRole

  useEffect(() => {
    if (userId && roleFromState) {
      console.log('User Data from State:', { userId, roleFromState });
      setUserRole(roleFromState);  // Set the user role
    } else {
      console.log('No user data available');
    }
  }, [userId, roleFromState]);

  const handleGetStarted = () => {
    // Navigate to Dashboard page and pass user data as state
    navigate('/dashboard', { state: { userId, userRole: roleFromState } });
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-full p-6 font-cabin">
        <img src="./PointlyLogoBlack.png" alt="Company Logo" className="mt-10 mb-6 w-[300px] h-auto" />
        <h1 className="text-5xl font-bold text-purple">Welcome to Pointly</h1>
        <p className="mt-4 text-3xl font-bold text-gray-800 italic">"Points Simplified"</p>

        <div className="mt-5 max-w-3xl text-center mb-5">
          <p className="text-lg text-gray-700">
            Pointly is your one-stop app for managing and maximizing loyalty rewards. With Pointly, you can 
            integrate reward points from various vendors and keep them all in one place.
          </p>
        </div>

        {/* User Role Based Content */}
        {userRole && (
          <div className="mt-5 text-center">
            <h2 className="text-xl text-gray-700">Logged in as: {userRole}</h2>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-5 text-center">
          <h2 className="text-3xl font-bold text-purple-dark">Start Earning Points with Pointly Today!</h2>
          <button
            onClick={handleGetStarted} // This will navigate to the Dashboard
            className="mt-6 px-6 py-3 bg-gold-dark text-white font-semibold rounded-lg hover:bg-purple-dark transition-colors"
          >
            Get Started
          </button>
        </div>

        <ReviewsCarousel />
      </div>
    </>
  );
}

export default Home;
