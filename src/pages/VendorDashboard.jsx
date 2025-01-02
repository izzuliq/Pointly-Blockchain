import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import VendorNavbar from '../components/VendorNavbar';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register the necessary components for the chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function VendorDashboard() {
  const [chartData, setChartData] = useState(null); // State to hold chart data
  const [loading, setLoading] = useState(true); // Loading state for fetching data

  // Sample data for the chart
  const fallbackData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Redemption Trends',
        data: [120, 150, 170, 190, 230, 200, 220, 250, 300, 350, 400, 450], // Example data
        borderColor: '#4F46E5', // Purple color
        backgroundColor: 'rgba(79, 70, 229, 0.2)', // Light purple background
        fill: true, // Make the line area filled
        tension: 0.4, // Smooth line
      },
    ],
  };

  // Fetch data from API using Axios
  useEffect(() => {
    axios
      .get('https://your-api-endpoint.com/dashboard') // Replace with your actual API endpoint
      .then((response) => {
        // On success, use the fetched data
        setChartData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        // On error, use fallback data and log the error
        console.error('Error fetching chart data:', error);
        setChartData(fallbackData);
        setLoading(false);
      });
  }, []); // Empty dependency array to run once on component mount

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        {/* Spinner for loading */}
        <div className="flex flex-col items-center">
          <div className="border-t-4 border-purple-600 w-16 h-16 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }  

  return (
    <div className="flex flex-col min-h-screen">
      <VendorNavbar />
      <div className="flex-grow p-6 font-cabin">
        <h1 className="text-3xl font-cabin text-gray-800 text-center">Vendor Dashboard</h1>
        <p className="mt-2 text-gray-600 text-center">Manage your promotions and track customer engagement.</p>
        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />
        
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {/* Total Redemptions */}
          <div className="bg-gold-dark p-4 rounded-lg shadow-md font-cabin">
            <h3 className="text-lg text-white font-cabin">Total Redemptions</h3>
            <p className="text-2xl text-white">1,200</p>
          </div>
          
          {/* Active Promotions */}
          <div className="bg-gold-dark p-4 rounded-lg shadow-md">
            <h3 className="text-lg text-white font-cabin">Active Promotions</h3>
            <p className="text-2xl text-white">10</p>
          </div>
          
          {/* Revenue Generated */}
          <div className="bg-gold-dark p-4 rounded-lg shadow-md">
            <h3 className="text-lg text-white font-cabin">Revenue Generated</h3>
            <p className="text-2xl text-white">RM15,450</p>
          </div>
          
          {/* Upcoming Promotions */}
          <div className="bg-gold-dark p-4 rounded-lg shadow-md">
            <h3 className="text-lg text-white font-cabin">Upcoming Promotions</h3>
            <p className="text-2xl text-white">3</p>
          </div>
        </div>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        {/* Analytics */}
        <div className="mt-6">
          <h2 className="text-2xl font-cabin mb-10 mt-10 text-center">Redemption Trends</h2>
          <div className="bg-white shadow-lg p-6 rounded-lg flex justify-center items-center">
            {/* Line Chart for Redemption Trends */}
            <div className="w-full md:w-3/4 lg:w-1/2">
              <Line data={chartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;
