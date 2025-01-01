import React from 'react';
import ReviewsCarousel from '../components/Review'; 
import Navbar from '../components/UserNavbar';
import { Link } from "react-router-dom"; 

function Home() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-full p-6 font-cabin">
        {/* Header */}
        <img src="./PointlyLogoBlack.png" alt="Company Logo" className="mt-20 mb-6 w-[300px] h-auto" />
        <h1 className="text-5xl font-bold text-purple">Welcome to Pointly</h1>
        <p className="mt-4 text-3xl font-bold text-gray-800 italic">"Points Simplified"</p>

        {/* Description */}
        <div className="mt-5 max-w-3xl text-center mb-5">
          <p className="text-lg text-gray-700">
            Pointly is your one-stop app for managing and maximizing loyalty rewards. With Pointly, you can 
            integrate reward points from various vendors and keep them all in one place. No more juggling between 
            different apps or remembering multiple logins — everything is centralized for your convenience.
          </p>
        </div>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        {/* Features Section */}
        <h2 className="text-3xl font-bold text-purple-dark">Why Should I Use Pointly?</h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gold-light shadow-lg rounded-lg p-6 flex flex-col items-center">
            <img src="./Reward.png" alt="Feature 1" className="max-w-[300px] max-h-[300px] mb-4" />
            <div className="text-center">
              <h3 className="text-3xl font-semibold text-black">Centralized Rewards</h3>
              <p className="text-black">Manage all your reward points from different vendors in one convenient platform.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-gold-light shadow-lg rounded-lg p-6 flex flex-col items-center">
            <img src="./Redemption.png" alt="Feature 2" className="max-w-[300px] max-h-[300px] mb-4" />
            <div className="text-center">
              <h3 className="text-3xl font-semibold text-black">Easy Redemption</h3>
              <p className="text-black">Easily redeem your points for rewards, discounts, and exclusive offers.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-gold-light shadow-lg rounded-lg p-6 flex flex-col items-center">
            <img src="./Track.png" alt="Feature 3" className="max-w-[300px] max-h-[300px] mb-4" />
            <div className="text-center">
              <h3 className="text-3xl font-semibold text-black">Track Your Points</h3>
              <p className="text-black">Keep track of your accumulated points and monitor your progress towards rewards.</p>
            </div>
          </div>
        </div>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        {/* Review Section */}
        <h2 className="text-3xl mt-5 font-bold text-purple-dark">Hear What Our Users Have To Say!</h2>
        <ReviewsCarousel /> {/* Insert the ReviewsCarousel component here */}

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        {/* Call to Action */}
        <div className="mt-5 text-center">
          <h2 className="text-3xl font-bold text-purple-dark">Start Earning Points with Pointly Today!</h2>
          <p className="mt-4 text-lg text-gray-700">Start make the most out of your daily transaction right now!</p>
          <button className="mt-6 px-6 py-3 bg-gold-dark text-white font-semibold rounded-lg hover:bg-purple-dark transition-colors">
            <Link to="/dashboard">Get Started</Link>
          </button>
        </div>

        {/* Image Section */}
        <div className="mt-12">
          <img src="Banner1.png" alt="Pointly Illustration" className="w-full max-w-[1000px] max-h-[500px] rounded-lg shadow-lg" />
        </div>
      </div>
    </>
  );
}

export default Home;
