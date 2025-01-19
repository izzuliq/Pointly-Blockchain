import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import getWeb3 from '../utils/getWeb3.js';  // Import getWeb3 utility
import PointlyUser from '../../build/contracts/PointlyUser.json';  // Import ABI of your contract

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null); // State to store MetaMask account
  const [web3, setWeb3] = useState(null); // Store Web3 instance
  const navigate = useNavigate();

  useEffect(() => {
    // Check if MetaMask is available and listen for account changes
    if (window.ethereum) {
      console.log("MetaMask detected.");
      window.ethereum.on('accountsChanged', handleAccountsChanged); // Listen for account change
      window.ethereum.on('chainChanged', handleChainChanged); // Listen for network change
    } else {
      console.log("MetaMask not detected. Please install MetaMask.");
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      console.log("MetaMask account changed:", accounts[0]);
      setAccount(accounts[0]);  // Update the account
    } else {
      alert('Please connect your MetaMask wallet!');
    }
  };

  const handleChainChanged = () => {
    alert('Network changed! Please reconnect your wallet.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!account || !web3) {
      alert('Please connect your MetaMask wallet!');
      return;
    }
  
    setLoading(true);
  
    try {
      console.log("Web3 instance:", web3);
      console.log("Account:", account);
  
      const contract = new web3.eth.Contract(PointlyUser.abi, '0x8D67D204b25ccA0EA4Dcb249C5bFeA6Ef54C8AD9'); // Contract address
      console.log("Calling createUser method...");
  
      // Debug: Check the contract ABI and method
      console.log(contract.methods.createUser(email, '', '', '', 'default_avatar.jpg', role));
  
      await contract.methods.createUser(email, '', '', '', 'default_avatar.jpg', role)
        .send({ from: account, gas: 500000 });
  
      alert('User registered on the blockchain!');
      navigate('/login'); // Redirect to login page
    } catch (err) {
      console.error('Error during signup:', err);
      alert(`Something went wrong during registration: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };  

  const handleMetaMaskConnect = async () => {
    console.log("Attempting to connect to MetaMask...");
    try {
      const web3Instance = await getWeb3();  // Get Web3 instance
      console.log("Web3 instance created:", web3Instance);

      // Set web3 instance in state
      setWeb3(web3Instance);

      const accounts = await web3Instance.eth.getAccounts();
      if (accounts.length > 0) {
        console.log("Connected account:", accounts[0]);
        setAccount(accounts[0]);  // Store account
      } else {
        alert("No accounts found.");
      }
    } catch (error) {
      console.error("Error in handleMetaMaskConnect:", error);
      alert("Failed to connect to MetaMask.");
    }
  };  

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-purple">
      <header className="flex flex-col items-center text-center mt-10 mb-8">
        <img src="./PointlyLogoWhite.png" alt="Company Logo" className="w-[200px] h-auto mb-4" />
        <h1 className="text-4xl font-bold text-white font-cabin">Welcome to Pointly</h1>
        <p className="mt-2 text-xl font-cabin text-white italic font-cabin">"Points Simplified"</p>
      </header>

      <div className="p-6 bg-white shadow-md rounded-lg max-w-xl w-full mb-10">
        <h2 className="text-3xl font-semibold text-gray-800 text-center font-cabin">Sign Up</h2>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col">
          <div className="w-full mb-4">
            <label className="block text-lg text-gray-700 text-center font-cabin" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg text-center"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="w-full mb-4">
            <label className="block text-lg text-gray-700 text-center font-cabin" htmlFor="role">Select Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg text-center font-cabin"
              required
            >
              <option value="user">User</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleMetaMaskConnect}
            className="px-6 py-3 bg-gold-dark text-white font-semibold rounded-lg hover:bg-purple-dark transition-colors"
          >
            {account ? `Connected: ${account}` : 'Connect MetaMask'}
          </button>

          <button
            type="submit"
            className="px-6 py-3 bg-gold-dark text-white font-semibold rounded-lg hover:bg-purple-dark transition-colors mt-4"
            disabled={loading || !account || !web3}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>

          {loading && (
            <div className="flex justify-center mt-4">
              <div className="w-8 h-8 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
            </div>
          )}

          <p className="mt-4 text-center font-cabin">
            Already have an account?{' '}
            <a href="/login" className="text-purple">Log in here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
