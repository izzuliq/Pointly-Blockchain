import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-purple-dark text-white py-4 font-cabin">
      <ul className="flex justify-center space-x-4">
        <li><Link to="/" className="hover:underline">Home</Link></li>
        <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
        <li><Link to="/rewards" className="hover:underline">Rewards</Link></li>
        <li><Link to="/profile" className="hover:underline">Profile</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
