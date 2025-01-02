import React, { useState, useEffect } from "react";
import VendorNavbar from "../components/VendorNavbar";
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios"; // Import Axios for API requests

function VendorProfile() {
  // Fallback static data for admin and company (template)
  const defaultAdminData = {
    name: "Alex Chin Wei Mei",
    email: "alexcwm@kfcmalaysia.com",
    phone: "(60)1239873456",
    profilePicture: "Alex.png", // Replace with actual URL or data
  };

  const defaultCompanyData = {
    companyName: "KFC Malaysia Sdn Bhd",
    companyAddress: "Level Ground Floor, Tower 1, V Square @ PJ City Centre, Jln Utara, Section 52, 46100 Petaling Jaya, Selangor",
    companyIndustry: "Foods & Beverages",
    companyLogo: "KFC.png", // Replace with actual URL or data
  };

  // State variables to store fetched data or fallback data
  const [adminData, setAdminData] = useState(defaultAdminData);
  const [companyData, setCompanyData] = useState(defaultCompanyData);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle error state

  useEffect(() => {
    // Fetch data from API (using Axios)
    axios
      .get("/api/vendor/admin") // Replace with actual API endpoint for admin
      .then((response) => {
        // If the API response is successful, update the state with fetched data
        setAdminData({
          name: response.data.name || defaultAdminData.name,
          email: response.data.email || defaultAdminData.email,
          phone: response.data.phone || defaultAdminData.phone,
          profilePicture: response.data.profilePicture || defaultAdminData.profilePicture,
        });

        setCompanyData({
          companyName: response.data.companyName || defaultCompanyData.companyName,
          companyAddress: response.data.companyAddress || defaultCompanyData.companyAddress,
          companyIndustry: response.data.companyIndustry || defaultCompanyData.companyIndustry,
          companyLogo: response.data.companyLogo || defaultCompanyData.companyLogo,
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching vendor data:", err);
        setError("Failed to fetch vendor data.");
        setLoading(false); // Stop loading on error
      });
  }, []); // Only run once when the component mounts

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

  if (error) {
    return <div>{error}</div>; // Display error message if API fails
  }

  return (
    <div>
      <VendorNavbar />
      <div className="p-6 bg-white shadow-md rounded-lg max-w-xl mx-auto font-cabin">
        <h2 className="text-3xl font-cabin text-gray-800 text-center">
          Vendor Profile
        </h2>
        <p className="mt-2 text-gray-600 text-center">
          View and manage your vendor details.
        </p>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        {/* Admin Profile Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-purple-dark text-center mb-4">
            Admin Profile
          </h3>

          {/* Admin Image */}
          <div className="max-w-[200px] max-h-[200px] mb-6 rounded-full overflow-hidden border-4 border-gold-dark shadow-lg mx-auto">
            <img
              src={adminData.profilePicture} // Display the admin profile picture
              alt="Admin Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Admin Name */}
          <div className="w-full mb-6 text-center">
            <label className="block text-xl font-cabin text-purple-dark">
              Name
            </label>
            <p className="mt-2 text-gray-800 text-xl">{adminData.name}</p>
          </div>

          {/* Admin Email */}
          <div className="w-full mb-6 text-center">
            <label className="block text-xl font-cabin text-purple-dark">
              Email
            </label>
            <p className="mt-2 text-gray-800 text-xl">{adminData.email}</p>
          </div>

          {/* Admin Phone */}
          <div className="w-full mb-6 text-center">
            <label className="block text-xl font-cabin text-purple-dark">
              Phone
            </label>
            <p className="mt-2 text-gray-800 text-xl">{adminData.phone}</p>
          </div>

          {/* Admin Edit Button */}
          <div className="mt-4 text-center">
            <Link to="/vendor-edit-admin">
              <button className="px-6 py-3 bg-gold-dark text-white font-semibold rounded-lg hover:bg-purple-dark transition-colors">
                Edit Admin Profile
              </button>
            </Link>
          </div>
        </div>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        {/* Company Profile Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-purple-dark text-center mb-4">
            Company Profile
          </h3>

          {/* Company Logo */}
          <div className="max-w-[200px] max-h-[200px] mb-6 rounded-full overflow-hidden border-4 border-gold-dark shadow-lg mx-auto">
            <img
              src={companyData.companyLogo} // Display the company logo
              alt="Company Logo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Company Name */}
          <div className="w-full mb-6 text-center">
            <label className="block text-xl font-cabin text-purple-dark">
              Company Name
            </label>
            <p className="mt-2 text-gray-800 text-xl">{companyData.companyName}</p>
          </div>

          {/* Company Address */}
          <div className="w-full mb-6 text-center">
            <label className="block text-xl font-cabin text-purple-dark">
              Address
            </label>
            <p className="mt-2 text-gray-800 text-xl">{companyData.companyAddress}</p>
          </div>

          {/* Company Industry */}
          <div className="w-full mb-6 text-center">
            <label className="block text-xl font-cabin text-purple-dark">
              Industry
            </label>
            <p className="mt-2 text-gray-800 text-xl">{companyData.companyIndustry}</p>
          </div>

          {/* Company Edit Button */}
          <div className="mt-4 text-center">
            <Link to="/vendor-edit-company">
              <button className="px-6 py-3 bg-gold-dark text-white font-semibold rounded-lg hover:bg-purple-dark transition-colors">
                Edit Vendor Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorProfile;
