import React from "react";
import VendorNavbar from "../components/VendorNavbar";
import { Link } from "react-router-dom"; // Import Link for navigation

function VendorProfile() {
  // Example data for admin and company (this can be replaced with dynamic data from API or state)
  const adminData = {
    name: "Alex Chin Wei Mei",
    email: "alexcwm@kfcmalaysia.com",
    phone: "(60)1239873456",
    profilePicture: "Alex.png", // Replace with actual URL or data
  };

  const companyData = {
    companyName: "KFC Malaysia Sdn Bhd",
    companyAddress: "Level Ground Floor, Tower 1, V Square @ PJ City Centre, Jln Utara, Section 52, 46100 Petaling Jaya, Selangor",
    companyIndustry: "Foods & Beverages",
    companyLogo: "KFC.png", // Replace with actual URL or data
  };

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
