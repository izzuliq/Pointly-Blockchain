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
import RewardDetails from "./pages/RewardsDetails"; // Import the new RewardDetails page

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<SignUpPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/editprofile" element={<EditProfile />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/reward-details" element={<RewardDetails />} /> {/* Add RewardDetails route */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
