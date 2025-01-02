import React, { useState } from "react";
import VendorNavbar from "../components/VendorNavbar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function VendorEditCompanyPage() {
  const [companyName, setCompanyName] = useState("KFC Malaysia Sdn Bhd");
  const [companyAddress, setCompanyAddress] = useState(
    "Level Ground Floor, Tower 1, V Square @ PJ City Centre, Jln Utara, Section 52, 46100 Petaling Jaya, Selangor"
  );
  const [companyIndustry, setCompanyIndustry] = useState("Foods & Beverages");
  const [companyLogo, setCompanyLogo] = useState("https://via.placeholder.com/150");

  const navigate = useNavigate();

  // Handle logo upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result); // Set the logo image to the selected file
      };
      reader.readAsDataURL(file); // Convert image to base64
    }
  };

  // Handle save button click
  const handleSave = async () => {
    try {
      // Prepare the form data to be sent to the server
      const formData = new FormData();
      formData.append("companyName", companyName);
      formData.append("companyAddress", companyAddress);
      formData.append("companyIndustry", companyIndustry);
      formData.append("companyLogo", companyLogo); // Include the base64 encoded logo image

      // Send the data using Axios (replace with your API endpoint)
      const response = await axios.put("/api/vendor/company", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Check the response status
      if (response.status === 200) {
        toast.success("Company profile updated successfully!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });

        // Redirect after 3 seconds
        setTimeout(() => {
          navigate("/vendor/profile"); // Redirect to the vendor profile page
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating company profile:", error);

      toast.error("Failed to update company profile. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <VendorNavbar />
      <div className="p-6 bg-white shadow-md rounded-lg max-w-xl mx-auto text-center font-cabin">
        <h2 className="text-3xl font-cabin text-gray-800">Edit Company Profile</h2>
        <p className="mt-2 text-gray-600">Update your company details below.</p>

        <hr className="my-8 w-3/4 border-t-4 border-gold-100 mx-auto mb-10 mt-10" />

        <div className="mt-8 flex flex-col items-center">
          {/* Company Logo */}
          <div className="w-24 h-24 mb-4 rounded-full overflow-hidden">
            <img
              src={companyLogo}
              alt="Company Logo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Logo Upload Input */}
          <div className="w-full mb-6">
            <label className="block text-lg text-gray-700" htmlFor="company-logo">
              Company Logo
            </label>
            <input
              type="file"
              id="company-logo"
              onChange={handleLogoChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Company Name Input */}
          <div className="w-full mb-4">
            <label className="block text-lg text-gray-700" htmlFor="company-name">
              Company Name
            </label>
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
            <label className="block text-lg text-gray-700" htmlFor="company-address">
              Address
            </label>
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
            <label className="block text-lg text-gray-700" htmlFor="company-industry">
              Industry
            </label>
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

      {/* Toast container for success/error messages */}
      <ToastContainer />
    </>
  );
}

export default VendorEditCompanyPage;
