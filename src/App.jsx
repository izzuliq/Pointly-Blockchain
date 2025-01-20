import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import LoginPage from "./pages/Login";
import SignUpPage from "./pages/SignUp";
import RewardDetails from "./pages/RewardsDetails";
import CreateRewardDetails from "./pages/CreateRewardDetails";

// Vendor Pages
import VendorHome from "./pages/VendorHome";
import VendorDashboard from "./pages/VendorDashboard";
import VendorRewards from "./pages/VendorRewards";
import VendorProfile from "./pages/VendorProfile";
import EditRewardDetails from "./pages/EditRewardDetails"; 
import VendorEditAdminPage from "./pages/EditAdminProfile"; 
import VendorEditCompanyPage from "./pages/EditCompanyProfile"; 
import VendorTransaction from "./pages/VendorTransaction";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<SignUpPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/editprofile" element={<EditProfile />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/reward-details/:rewardId" element={<RewardDetails />} />

            {/* Vendor Routes */}
            <Route path="/vendor-home" element={<VendorHome />} />
            <Route path="/vendor-dashboard" element={<VendorDashboard />} />
            <Route path="/vendor-rewards" element={<VendorRewards />} />
            <Route path="/vendor-create-reward" element={<CreateRewardDetails />} />
            <Route path="/vendor-profile" element={<VendorProfile />} />
            <Route path="/vendor-reward-details/:rewardId" element={<EditRewardDetails />} />
            <Route path="/vendor-edit-admin" element={<VendorEditAdminPage />} /> {/* Edit Admin Profile Route */}
            <Route path="/vendor-edit-company" element={<VendorEditCompanyPage />} /> {/* Edit Company Profile Route */}
            <Route path="/vendor-transactions" element={<VendorTransaction />} />

            {/* Catch-all route for undefined paths */}
            <Route
              path="*"
              element={
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-cabin">
                  <div className="text-center bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mb-0">
                    <div className="mb-6">
                      <img
                        src="404.png"
                        alt="Lost in cyberspace"
                        className="w-64 h-64 object-cover rounded-lg items-center mx-auto"
                      />
                    </div>
                    <h1 className="text-4xl font-semibold text-gray-800 mb-4">
                      Oops! This page is lost in cyberspace!
                    </h1>
                    <p className="text-xl text-gray-600 mb-6">
                      Looks like this page went on a little adventure and got lost. Don’t worry, we’ll guide you back home!
                    </p>
                    <a
                      href="/"
                      className="px-6 py-3 bg-gold-dark text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Take me home, please!
                    </a>
                    <p className="text-sm text-gray-400 mt-4">
                      (Or you could keep exploring, but no pressure!)
                    </p>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
