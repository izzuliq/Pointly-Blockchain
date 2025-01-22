import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getWeb3 from "../utils/getWeb3"; // Import getWeb3
import getContractInstance from "../utils/contract"; // Adjusted import

function LoginPage() {
  const [web3, setWeb3] = useState(null); // Store Web3 instance
  const [account, setAccount] = useState(null); // Store MetaMask account
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Web3 and connect to MetaMask
    const initWeb3 = async () => {
      try {
        const web3Instance = await getWeb3(); // Use getWeb3 to initialize Web3
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts(); // Get accounts
        setAccount(accounts[0]); // Set default account
      } catch (error) {
        console.error("Failed to initialize Web3:", error);
        alert("Please connect your MetaMask wallet.");
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
      setAccount(accounts[0]); // Update account state
    } else {
      alert("Please connect your MetaMask wallet!");
    }
  };

  const handleChainChanged = () => {
    alert("Network changed! Please reconnect your wallet.");
    window.location.reload(); // Reload the page to reflect network changes
  };

  const handleMetaMaskLogin = async () => {
    setLoading(true); // Start loading

    try {
      if (!web3) {
        alert("Web3 is not initialized. Please reload the page.");
        return;
      }

      console.log("Attempting to connect to MetaMask...");
      const accounts = await web3.eth.requestAccounts(); // Connect to MetaMask
      const userAccount = accounts[0];
      setAccount(userAccount); // Set account state

      // Fetch the PointlyUser contract instance
      const contract = await getContractInstance("PointlyUser");
      console.log("Contract instance:", contract); // Debugging contract

      // Fetch user data from the blockchain
      const user = await contract.methods.getUser(userAccount).call();
      console.log("User details:", user);

      if (user.exists === true || user.exists === "true" || user.exists === 1) {
        sessionStorage.setItem("userAccount", userAccount);
        sessionStorage.setItem("userRole", user.role);

        // Handle role-based messages and redirection
        if (user.role === "user") {
          alert(`Welcome back! You are logged in as a ${user.tier} member.`);
          navigate("/home");
        } else if (user.role === "vendor") {
          alert(`Welcome back, our Pointly Vendor!`);
          navigate("/vendor-home");
        } else {
          alert("Unknown user role.");
          navigate("/"); // Redirect to homepage or error page
        }
      } else {
        alert("You are not registered. Please sign up first!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Something went wrong during login. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to refresh the wallet and account details
  const refreshWallet = async () => {
    try {
      // Re-initialize Web3 and update account
      const web3Instance = await getWeb3();
      setWeb3(web3Instance);

      const accounts = await web3Instance.eth.getAccounts();
      setAccount(accounts[0]); // Update account
    } catch (error) {
      console.error("Error refreshing wallet:", error);
      alert("Failed to refresh wallet. Please try again.");
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
            {loading ? "Logging in..." : "Login with MetaMask"}
          </button>

          {/* Refresh Wallet Button */}
          <button
            type="button"
            onClick={refreshWallet}
            className="mt-4 px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
            disabled={loading}
          >
            Refresh Wallet
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
            <a href="/" className="text-purple">
              Sign up here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
