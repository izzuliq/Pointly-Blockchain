import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getWeb3 from '../utils/getWeb3.js';  // Import getWeb3 utility
import PointlyUser from '../../build/contracts/PointlyUser.json';  // Import ABI of your contract

function LoginPage() {
  const [account, setAccount] = useState(null);  // Store MetaMask account
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const handleMetaMaskLogin = async () => {
    setLoading(true);  // Start loading
  
    try {
      console.log("Attempting to connect to MetaMask...");
  
      // Connect to Web3 and MetaMask
      const web3 = await getWeb3();
      console.log("Web3 initialized:", web3); // Debugging Web3
  
      const accounts = await web3.eth.getAccounts();
      console.log("MetaMask Accounts:", accounts); // Debugging accounts
  
      if (accounts.length === 0) {
        alert('Please connect MetaMask!');
        return;
      }
  
      const userAccount = accounts[0];  // MetaMask account
      setAccount(userAccount);  // Store account in state
  
      // Initialize the contract
      const contractAddress = '0x07E79cE4F3dFc9C4A35757A4228f44241dfce325'; // Replace with your contract address
      const contract = new web3.eth.Contract(PointlyUser.abi, contractAddress);
  
      console.log("Contract initialized:", contract); // Debugging contract
  
      const user = await contract.methods.getUser(userAccount).call();
      console.log("User details:", user);
      console.log("User role:", user.role); // Log role value for debugging
  
      if (user.exists === true || user.exists === 'true' || user.exists === 1) {
        alert(`Welcome back! You are logged in as a ${user.tier} member.`);
        sessionStorage.setItem('userAccount', userAccount);
        sessionStorage.setItem('userRole', user.role);
  
        // Redirect based on role
        if (user.role === 'user') {
          navigate('/home');
        } else if (user.role === 'vendor') {
          navigate('/vendor-home');
        } else {
          alert('Unknown user role.');
          navigate('/'); // Redirect to homepage or error page
        }
      } else {
        alert('You are not registered. Please sign up first!');
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert('You are not registered. Please sign up first!');
    } finally {
      setLoading(false);  // End loading
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-purple font-cabin">
      <header className="flex flex-col items-center text-center mt-10 mb-8">
        <img src="./PointlyLogoWhite.png" alt="Company Logo" className="w-[200px] h-auto mb-4" />
        <h1 className="text-4xl font-bold text-white">Welcome to Pointly</h1>
        <p className="mt-2 text-xl font-bold text-white italic">"Points Simplified"</p>
      </header>

      <div className="p-6 bg-white shadow-md rounded-lg max-w-xl w-full mb-10">
        <h2 className="text-3xl font-semibold text-gray-800 text-center">Login</h2>
        <form onSubmit={(e) => e.preventDefault()} className="mt-8 flex flex-col">
          {/* MetaMask Connect Button */}
          <button
            type="button"
            onClick={handleMetaMaskLogin}
            className="px-6 py-3 bg-gold-dark text-white font-semibold rounded-lg hover:bg-purple-dark transition-colors"
            disabled={loading} // Disable button when loading
          >
            {loading ? 'Logging in...' : 'Login with MetaMask'}
          </button>

          {loading && (
            <div className="flex justify-center mt-4">
              <div className="w-8 h-8 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
            </div>
          )}

          {/* Optionally: Display connected account */}
          {account && <p className="mt-4 text-center text-gray-700">Connected as: {account}</p>}

          <p className="mt-4 text-center font-cabin">
            Don't have an account?{" "}
            <a href="/" className="text-purple">Sign up here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
