import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getWeb3 from "../utils/getWeb3"; // Import the getWeb3 function
import getContractInstance from "../utils/contract"; // Adjusted import

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user"); // Default role is 'user'
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null); // State to store MetaMask account
  const [web3, setWeb3] = useState(null); // State to store web3 instance
  const navigate = useNavigate();

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3Instance = await getWeb3(); // Initialize Web3 using getWeb3 utility
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts(); // Fetch connected accounts
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          alert("No accounts found. Please connect your MetaMask wallet.");
        }

        // Handle account or chain changes
        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);
      } catch (error) {
        console.error("Failed to initialize Web3:", error);
        alert("Please connect your MetaMask wallet to proceed.");
      }
    };

    initWeb3();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]); // Update the account
    } else {
      alert("Please connect your MetaMask wallet!");
    }
  };

  const handleChainChanged = () => {
    alert("Network changed! Please reconnect your wallet.");
    window.location.reload(); // Reload the page to reflect network change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!account) {
      alert("Please connect your MetaMask wallet!");
      return;
    }

    setLoading(true);

    try {
      // Get the PointlyUser contract instance using getContractInstance
      const pointlyUserInstance = await getContractInstance("PointlyUser");

      if (!pointlyUserInstance) {
        throw new Error("Failed to get contract instance.");
      }

      // Log the contract instance methods
      console.log("Contract instance:", pointlyUserInstance);
      console.log("Contract methods:", pointlyUserInstance.methods); // Log available methods

      // Ensure createUser exists as a method
      if (typeof pointlyUserInstance.methods.createUser !== "function") {
        throw new Error("createUser method is not available on the contract.");
      }

      // Call the createUser method on the contract
      await pointlyUserInstance.methods
        .createUser(email, "", "", "", "default_avatar.jpg", role)
        .send({ from: account, gas: 500000 });

      alert("User registered on the blockchain!");
      navigate("/login"); // Redirect to login page
    } catch (err) {
      console.error("Error during signup:", err);
      alert(`Something went wrong during registration: ${err.message}`);
    } finally {
      setLoading(false);
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
            <label className="block text-lg text-gray-700 text-center font-cabin" htmlFor="email">
              Email
            </label>
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
            <label className="block text-lg text-gray-700 text-center font-cabin" htmlFor="role">
              Select Role
            </label>
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
            type="submit"
            className="px-6 py-3 bg-gold-dark text-white font-semibold rounded-lg hover:bg-purple-dark transition-colors mt-4"
            disabled={loading || !account}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          {loading && (
            <div className="flex justify-center mt-4">
              <div className="w-8 h-8 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
            </div>
          )}

          <p className="mt-4 text-center font-cabin">
            Already have an account?{" "}
            <a href="/login" className="text-purple">
              Log in here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
