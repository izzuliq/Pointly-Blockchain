import React, { useState } from "react";
import VendorNavbar from "../components/VendorNavbar";

function VendorEditCompanyPage() {
  const [companyName, setCompanyName] = useState("KFC Malaysia Sdn Bhd");
  const [companyAddress, setCompanyAddress] = useState("Level Ground Floor, Tower 1, V Square @ PJ City Centre, Jln Utara, Section 52, 46100 Petaling Jaya, Selangor");
  const [companyIndustry, setCompanyIndustry] = useState("Foods & Beverages");
  const [companyLogo, setCompanyLogo] = useState("https://via.placeholder.com/150");

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result); // Update company logo to the selected image
      };
      reader.readAsDataURL(file); // Read the file as a data URL (base64)
    }
  };

  const handleSave = () => {
    // Handle saving of updated details (image and text fields)
    alert("Company profile updated!");
  };

  return (
    <>
      <VendorNavbar />
      <div className="p-6 bg-white shadow-md rounded-lg max-w-xl mx-auto text-center font-cabin">
        <h2 className="text-3xl font-cabin text-gray-800 text-center">Edit Company Profile</h2>
        <p className="mt-2 text-gray-600 text-center">Update your company details below.</p>

        <div className="mt-8 flex flex-col items-center">
          {/* Company Logo */}
          <div className="w-24 h-24 mb-4 rounded-full overflow-hidden">
            <img
              src={companyLogo}  // Display the company logo (either default or uploaded)
              alt="Company Logo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Logo Upload Input */}
          <div className="w-full mb-6">
            <label className="block text-lg text-gray-700" htmlFor="company-logo">Company Logo</label>
            <input
              type="file"
              id="company-logo"
              onChange={handleLogoChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Company Name Input */}
          <div className="w-full mb-4">
            <label className="block text-lg text-gray-700" htmlFor="company-name">Company Name</label>
            <input
              type="text"
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg text-center"
              placeholder="Enter company name"
            />
          </div>

          {/* Company Address Input */}
          <div className="w-full mb-4">
            <label className="block text-lg text-gray-700" htmlFor="company-address">Address</label>
            <input
              type="text"
              id="company-address"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg text-center"
              placeholder="Enter company address"
            />
          </div>

          {/* Company Industry Input */}
          <div className="w-full mb-4">
            <label className="block text-lg text-gray-700" htmlFor="company-industry">Industry</label>
            <input
              type="text"
              id="company-industry"
              value={companyIndustry}
              onChange={(e) => setCompanyIndustry(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg text-center"
              placeholder="Enter company industry"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-purple text-white font-semibold rounded-lg hover:bg-purple-dark transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}

export default VendorEditCompanyPage;
