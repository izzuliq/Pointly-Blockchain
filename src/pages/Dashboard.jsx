import React from 'react';

function Dashboard() {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {/* Dashboard Header */}
      <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
      <p className="mt-2 text-gray-600">Track your activities and points here.</p>

      {/* User Profile Section */}
      <div className="mt-6 flex items-center space-x-4">
        <img 
          src="https://via.placeholder.com/100" 
          alt="User Avatar" 
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-800">John Doe</h3>
          <p className="text-gray-500">Loyalty Member</p>
        </div>
      </div>

      {/* Points Overview Section */}
      <div className="mt-8 bg-purple-100 p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">Points Overview</h3>
        <div className="mt-4 flex justify-between">
          <div>
            <h4 className="text-xl font-semibold text-gray-700">1000</h4>
            <p className="text-gray-500">Total Points</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-700">500</h4>
            <p className="text-gray-500">Available Points</p>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
        <ul className="mt-4 space-y-4">
          <li className="flex justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
            <span className="text-gray-700">Earned 100 points from a purchase</span>
            <span className="text-gray-500">2 hours ago</span>
          </li>
          <li className="flex justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
            <span className="text-gray-700">Redeemed 200 points for a reward</span>
            <span className="text-gray-500">1 day ago</span>
          </li>
          <li className="flex justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
            <span className="text-gray-700">Earned 50 points from a review</span>
            <span className="text-gray-500">3 days ago</span>
          </li>
        </ul>
      </div>

      {/* Statistics Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800">Your Progress</h3>
        <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-sm">
          {/* Placeholder for chart or progress bar */}
          <div className="h-4 bg-purple-200 rounded-lg">
            <div className="h-4 bg-purple rounded-lg" style={{ width: '50%' }}></div>
          </div>
          <p className="mt-2 text-gray-500 text-sm">50% to your next reward</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
