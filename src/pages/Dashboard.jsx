import React, { useEffect, useState } from "react";
import Navbar from "../components/UserNavbar";

function Dashboard() {
  const [user, setUser] = useState({});
  const [activities, setActivities] = useState([]);
  const [tiers, setTiers] = useState([]);

  const userID = 1; // Replace with dynamic user ID from authentication

  useEffect(() => {
    // Fetch user profile
    fetch(`http://localhost:5000/api/dashboard/user/${userID}`)
      .then((res) => res.json())
      .then(setUser)
      .catch((err) => console.error(err));

    // Fetch recent activities
    fetch(`http://localhost:5000/api/dashboard/activities/${userID}`)
      .then((res) => res.json())
      .then(setActivities)
      .catch((err) => console.error(err));

    // Fetch treasure tiers
    fetch("http://localhost:5000/api/dashboard/tiers")
      .then((res) => res.json())
      .then(setTiers)
      .catch((err) => console.error(err));
  }, [userID]);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-white shadow-md rounded-lg max-w-6xl mx-auto">
        <h2 className="text-3xl font-cabin text-gray-800 text-center">Dashboard</h2>
        <p className="mt-2 text-gray-600 text-center">
          Track your activities, points, and progress towards your next treasure tier.
        </p>
        {/* User Profile */}
        <div className="text-center mt-6">
          <h3 className="text-2xl font-semibold">{user.Name}</h3>
          <p className="text-lg text-gray-500">{user.Tier} Member</p>
        </div>

        {/* Points Overview */}
        <div className="mt-8 bg-gold-100 p-4 rounded-lg shadow-sm text-center">
          <h3 className="text-lg font-semibold">Points Overview</h3>
          <p>Total Points: {user.PointsTotal}</p>
          <p>Available Points: {user.PointsAvailable}</p>
        </div>

        {/* Recent Activities */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-center">Recent Activities</h3>
          <ul>
            {activities.map((activity, index) => (
              <li key={index} className="p-4 bg-gray-50 shadow-sm rounded-lg mb-4">
                <span>{activity.ActivityDescription}</span>
                <span className="float-right">{activity.Timestamp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Treasure Tiers */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-center">Treasure Tiers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiers.map((tier, index) => (
              <div key={index} className="p-4 bg-white shadow-sm rounded-lg text-center">
                <h4 className="text-xl font-semibold">{tier.TierName}</h4>
                <p>{tier.Description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
