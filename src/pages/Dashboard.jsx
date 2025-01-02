import React, { useState, useEffect } from "react";
import Navbar from "../components/UserNavbar";
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState({ total: 0, available: 0 });
  const [activities, setActivities] = useState([]); // Ensure it's always an array
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fetch user profile data using Axios
    axios.get('/api/user/profile')
      .then(response => setUser(response.data))
      .catch(error => console.error('Error fetching user profile:', error));

    // Fetch points data using Axios
    axios.get('/api/user/points')
      .then(response => setPoints(response.data))
      .catch(error => console.error('Error fetching points data:', error));

    // Fetch recent activities using Axios
    axios.get('/api/user/activities')
      .then(response => {
        // Ensure the response is an array
        setActivities(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => {
        console.error('Error fetching activities:', error);
        setActivities([]); // Fallback to empty array in case of error
      });

    // Fetch progress data using Axios
    axios.get('/api/user/progress')
      .then(response => setProgress(response.data.percentage))
      .catch(error => console.error('Error fetching progress data:', error));
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
          {user ? (
            <>
              <img
                src={user.avatarUrl || "Sarimah.png"}
                alt="User Avatar"
                className="max-w-[200px] max-h-[200px] mb-6 rounded-full overflow-hidden border-4 border-gold-dark shadow-lg"
              />
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-800">{user.name}</h3>
                <p className="text-lg text-gray-500">{user.tier}</p>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-[200px] h-[200px] mb-6 bg-gray-200 rounded-full mx-auto"></div>
              <p className="text-xl font-semibold text-gray-800">Loading...</p>
            </div>
          )}
        </div>

        {/* Points Overview Section */}
        <div className="mt-8 bg-gold-100 p-4 rounded-lg shadow-sm w-full mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Points Overview</h3>
          <div className="mt-4 flex flex-col sm:flex-row justify-center sm:space-x-64">
            <div className="text-center">
              <h4 className="text-xl font-semibold text-gray-700">
                {points.total === 0 ? "Loading..." : points.total}
              </h4>
              <p className="text-gray-500">Total Points</p>
            </div>
            <div className="text-center mt-4 sm:mt-0">
              <h4 className="text-xl font-semibold text-gray-700">
                {points.available === 0 ? "Loading..." : points.available}
              </h4>
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
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <img
                src="Quartz.png"
                alt="Quartz Tier"
                className="max-w-[150px] max-h-[150px] object-cover mx-auto mb-4"
              />
              <h4 className="text-xl font-semibold text-gray-700">Quartz</h4>
              <p className="mt-2 text-gray-500">Starting Level</p>
              <p className="mt-4 text-gray-600">
                You're just starting your adventure! Collect points and rise through the ranks.
              </p>
            </div>

            {/* Emerald Tier */}
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <img
                src="Emerald.png"
                alt="Emerald Tier"
                className="max-w-[150px] max-h-[150px] object-cover mx-auto mb-4"
              />
              <h4 className="text-xl font-semibold text-gray-700">Emerald</h4>
              <p className="mt-2 text-gray-500">Intermediate Level</p>
              <p className="mt-4 text-gray-600">
                You've earned a wealth of points! Enjoy better rewards as you move closer to Sapphire.
              </p>
            </div>

            {/* Sapphire Tier */}
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <img
                src="Sapphire.png"
                alt="Sapphire Tier"
                className="max-w-[150px] max-h-[150px] object-cover mx-auto mb-4"
              />
              <h4 className="text-xl font-semibold text-gray-700">Sapphire</h4>
              <p className="mt-2 text-gray-500">Advanced Level</p>
              <p className="mt-4 text-gray-600">
                You're a treasure hunter with impressive rewards at your fingertips. Keep it up!
              </p>
            </div>

            {/* Diamond Tier */}
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <img
                src="Diamond.png"
                alt="Diamond Tier"
                className="max-w-[150px] max-h-[150px] object-cover mx-auto mb-4"
              />
              <h4 className="text-xl font-semibold text-gray-700">Diamond</h4>
              <p className="mt-2 text-gray-500">Top Level</p>
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
              <div className="h-5 bg-purple rounded-lg" style={{ width: `${progress > 0 ? progress : 0}%` }}></div>
            </div>
            <p className="mt-2 text-gray-500 text-sm text-center">{progress > 0 ? `${progress}% to your next tier` : "Loading progress..."}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
