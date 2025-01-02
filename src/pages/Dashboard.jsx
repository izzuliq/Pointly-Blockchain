import React, { useState, useEffect } from "react";
import Navbar from "../components/UserNavbar";
import axios from "axios";

function Dashboard() {
  const [user, setUser] = useState({
    name: "Sarimah Jalil",
    tier: "Quartz",
    avatarUrl: "Sarimah.png", // Placeholder avatar
  });
  const [points, setPoints] = useState({ total: 1000, available: 800 });
  const [activities, setActivities] = useState([
    { description: "Redeemed 50 points at KFC Cyberjaya", timeAgo: "2 hours ago" },
    { description: "Earned 100 points at KFC Serdang Jaya", timeAgo: "1 day ago" },
    { description: "Signed up and received 500 bonus points", timeAgo: "1 week ago" },
  ]);
  const [progress, setProgress] = useState(45);

  useEffect(() => {
    // Fetch user profile data
    axios
      .get("/api/user/profile")
      .then((response) => {
        if (response.data && response.data.name) {
          setUser(response.data);
        } else {
          console.warn("Invalid profile data, using default template.");
        }
      })
      .catch((error) => console.error("Error fetching user profile:", error));
  
    // Fetch points data
    axios
      .get("/api/user/points")
      .then((response) => {
        if (response.data && response.data.total !== undefined) {
          setPoints(response.data);
        } else {
          console.warn("Invalid points data, using default template.");
        }
      })
      .catch((error) => console.error("Error fetching points data:", error));
  
    // Fetch recent activities
    axios
      .get("/api/user/activities")
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setActivities(response.data);
        } else {
          console.warn("Invalid activities data, using default template.");
        }
      })
      .catch((error) => console.error("Error fetching activities:", error));
  
    // Fetch progress data
    axios
      .get("/api/user/progress")
      .then((response) => {
        if (response.data && typeof response.data.percentage === "number") {
          setProgress(response.data.percentage);
        } else {
          console.warn("Invalid progress data, using default template.");
        }
      })
      .catch((error) => console.error("Error fetching progress data:", error));
  }, []);
  
  return (
    <>
      <Navbar />
      <div className="p-6 bg-white shadow-md rounded-lg max-w-6xl mx-auto">
        {/* Dashboard Header */}
        <h2 className="text-3xl font-cabin text-gray-800 text-center">Dashboard</h2>
        <p className="mt-2 text-gray-600 text-center">
          Track your activities, points, and progress towards your next treasure tier.
        </p>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        {/* User Profile Section */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-center space-x-0 md:space-x-6">
          <img
            src={user.avatarUrl}
            alt="User Avatar"
            className="max-w-[200px] max-h-[200px] mb-6 rounded-full overflow-hidden border-4 border-gold-dark shadow-lg"
          />
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800">{user.name}</h3>
            <p className="text-lg text-gray-500">{user.tier} Member</p>
          </div>
        </div>

        {/* Points Overview Section */}
        <div className="mt-8 bg-gold-100 p-4 rounded-lg shadow-sm w-full mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Points Overview</h3>
          <div className="mt-4 flex flex-col sm:flex-row justify-center sm:space-x-64">
            <div className="text-center">
              <h4 className="text-xl font-semibold text-gray-700">{points.total}</h4>
              <p className="text-gray-500">Total Points</p>
            </div>
            <div className="text-center mt-4 sm:mt-0">
              <h4 className="text-xl font-semibold text-gray-700">{points.available}</h4>
              <p className="text-gray-500">Available Points</p>
            </div>
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Recent Activities</h3>
          <ul className="mt-4 space-y-4">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <li key={index} className="flex justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
                  <span className="text-gray-700">{activity.description}</span>
                  <span className="text-gray-500">{activity.timeAgo}</span>
                </li>
              ))
            ) : (
              <li className="flex justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
                <span className="text-gray-700">No recent activities.</span>
              </li>
            )}
          </ul>
        </div>

        {/* Tier System Section */}
        <div className="mt-8 bg-gold-100 p-6 rounded-lg shadow-sm w-full mx-auto">
      <h3 className="text-lg font-semibold text-gray-800 text-center">Your Treasure Tier</h3>
      <p className="mt-2 text-gray-600 text-center">
        Unlock exclusive rewards and privileges as you level up your treasure tier!
      </p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Quartz Tier */}
        <div
          className={`bg-white p-4 rounded-lg shadow-md text-center transition-all duration-300 ease-in-out 
            ${user.tier === "Quartz" ? "ring-4 ring-gold-dark ring-opacity-60" : "hover:ring-2 hover:ring-gray-300"}`}
        >
          <img
            src="Quartz.png"
            alt="Quartz Tier"
            className="max-w-[150px] max-h-[150px] object-cover mx-auto mb-4"
          />
          <h4 className="text-xl font-semibold text-gray-700">Quartz</h4>
          <p className="mt-2 text-gray-500">Starting Level</p>
          <p className="mt-2 text-gray-500">0 - 999 points</p>
          <p className="mt-4 text-gray-600">
            You're just starting your adventure! Collect points and rise through the ranks.
          </p>
        </div>

        {/* Emerald Tier */}
        <div
          className={`bg-white p-4 rounded-lg shadow-md text-center transition-all duration-300 ease-in-out 
            ${user.tier === "Emerald" ? "ring-4 ring-gold-dark ring-opacity-60" : "hover:ring-2 hover:ring-gray-300"}`}
        >
          <img
            src="Emerald.png"
            alt="Emerald Tier"
            className="max-w-[150px] max-h-[150px] object-cover mx-auto mb-4"
          />
          <h4 className="text-xl font-semibold text-gray-700">Emerald</h4>
          <p className="mt-2 text-gray-500">Intermediate Level</p>
          <p className="mt-2 text-gray-500">1,000 - 4,999 points</p>
          <p className="mt-4 text-gray-600">
            You've earned a wealth of points! Enjoy better rewards as you move closer to Sapphire.
          </p>
        </div>

        {/* Sapphire Tier */}
        <div
          className={`bg-white p-4 rounded-lg shadow-md text-center transition-all duration-300 ease-in-out 
            ${user.tier === "Sapphire" ? "ring-4 ring-gold-dark ring-opacity-60" : "hover:ring-2 hover:ring-gray-300"}`}
        >
          <img
            src="Sapphire.png"
            alt="Sapphire Tier"
            className="max-w-[150px] max-h-[150px] object-cover mx-auto mb-4"
          />
          <h4 className="text-xl font-semibold text-gray-700">Sapphire</h4>
          <p className="mt-2 text-gray-500">Advanced Level</p>
          <p className="mt-2 text-gray-500">5,000 - 9,999 points</p>
          <p className="mt-4 text-gray-600">
            You're a treasure hunter with impressive rewards at your fingertips. Keep it up!
          </p>
        </div>

        {/* Diamond Tier */}
        <div
          className={`bg-white p-4 rounded-lg shadow-md text-center transition-all duration-300 ease-in-out 
            ${user.tier === "Diamond" ? "ring-4 ring-gold-dark ring-opacity-60" : "hover:ring-2 hover:ring-gray-300"}`}
        >
          <img
            src="Diamond.png"
            alt="Diamond Tier"
            className="max-w-[150px] max-h-[150px] object-cover mx-auto mb-4"
          />
          <h4 className="text-xl font-semibold text-gray-700">Diamond</h4>
          <p className="mt-2 text-gray-500">Top Level</p>
          <p className="mt-2 text-gray-500">10,000+ points</p>
          <p className="mt-4 text-gray-600">
            The ultimate treasure hunter! You've reached the pinnacle and unlocked the best rewards.
          </p>
        </div>
      </div>
    </div>

        {/* Statistics Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Your Progress</h3>
          <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="h-5 bg-purple-200 rounded-lg">
              <div
                className="h-5 bg-purple rounded-lg"
                style={{ width: `${progress > 0 ? progress : 0}%` }}
              ></div>
            </div>
            <p className="mt-2 text-gray-500 text-sm text-center">
              {progress > 0 ? `${progress}% to your next tier` : "Loading progress..."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function TierCard({ title, imgSrc, level, range, description }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md text-center">
      <img
        src={imgSrc}
        alt={`${title} Tier`}
        className="max-w-[150px] max-h-[150px] object-cover mx-auto mb-4"
      />
      <h4 className="text-xl font-semibold text-gray-700">{title}</h4>
      <p className="mt-2 text-gray-500">{level}</p>
      <p className="mt-2 text-gray-500">{range}</p>
      <p className="mt-4 text-gray-600">{description}</p>
    </div>
  );
}

export default Dashboard;
