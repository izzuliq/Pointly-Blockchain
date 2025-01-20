// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transaction {
    // Owner of the contract (platform admin)
    address public owner;

    // Struct for storing transaction details
    struct TransactionRecord {
        uint256 transactionId;
        address userAddress;
        address vendorAddress;
        uint256 pointsChanged;  // Positive for points added, negative for points deducted
        uint256 rewardId;      // ID of the reward involved (0 if no reward)
        uint256 timestamp;     // Timestamp of the transaction
        string transactionType; // "Reward Redemption" or "Points Update"
        bool success;           // Whether the transaction was successful
    }

    uint256 public transactionCounter;
    mapping(uint256 => TransactionRecord) public transactions;

    // Events for logging transactions
    event TransactionLogged(
        uint256 transactionId,
        address indexed userAddress,
        address indexed vendorAddress,
        uint256 pointsChanged,
        uint256 rewardId,
        string transactionType,
        bool success
    );

    // Constructor to initialize the contract owner
    constructor() {
        owner = msg.sender; // Assign contract deployer as owner
    }

    // Function to log a transaction (used by both users and vendors)
    function logTransaction(
        address userAddress,
        address vendorAddress,
        uint256 pointsChanged,
        uint256 rewardId,
        string memory transactionType,
        bool success
    ) public {
        // Increment the transaction counter for a new transaction ID
        transactionCounter++;

        // Create a new transaction record
        transactions[transactionCounter] = TransactionRecord({
            transactionId: transactionCounter,
            userAddress: userAddress,
            vendorAddress: vendorAddress,
            pointsChanged: pointsChanged,
            rewardId: rewardId,
            timestamp: block.timestamp,
            transactionType: transactionType,
            success: success
        });

        // Emit event for the logged transaction
        emit TransactionLogged(
            transactionCounter,
            userAddress,
            vendorAddress,
            pointsChanged,
            rewardId,
            transactionType,
            success
        );
    }

    // Function to get a transaction record by its ID
    function getTransaction(uint256 transactionId)
        public
        view
        returns (
            address userAddress,
            address vendorAddress,
            uint256 pointsChanged,
            uint256 rewardId,
            uint256 timestamp,
            string memory transactionType,
            bool success
        )
    {
        require(transactionId <= transactionCounter, "Transaction does not exist");

        TransactionRecord memory txRecord = transactions[transactionId];
        return (
            txRecord.userAddress,
            txRecord.vendorAddress,
            txRecord.pointsChanged,
            txRecord.rewardId,
            txRecord.timestamp,
            txRecord.transactionType,
            txRecord.success
        );
    }

    // Function to get all transactions of a particular user
    function getUserTransactions(address userAddress) public view returns (TransactionRecord[] memory) {
        uint256 userTransactionCount = 0;

        // Count how many transactions the user has
        for (uint256 i = 1; i <= transactionCounter; i++) {
            if (transactions[i].userAddress == userAddress) {
                userTransactionCount++;
            }
        }

        // Create an array to hold the user's transactions
        TransactionRecord[] memory userTransactions = new TransactionRecord[](userTransactionCount);
        uint256 index = 0;

        // Populate the user's transaction array
        for (uint256 i = 1; i <= transactionCounter; i++) {
            if (transactions[i].userAddress == userAddress) {
                userTransactions[index] = transactions[i];
                index++;
            }
        }

        return userTransactions;
    }

    // Function to get all transactions of a particular vendor
    function getVendorTransactions(address vendorAddress) public view returns (TransactionRecord[] memory) {
        uint256 vendorTransactionCount = 0;

        // Count how many transactions the vendor has
        for (uint256 i = 1; i <= transactionCounter; i++) {
            if (transactions[i].vendorAddress == vendorAddress) {
                vendorTransactionCount++;
            }
        }

        // Create an array to hold the vendor's transactions
        TransactionRecord[] memory vendorTransactions = new TransactionRecord[](vendorTransactionCount);
        uint256 index = 0;

        // Populate the vendor's transaction array
        for (uint256 i = 1; i <= transactionCounter; i++) {
            if (transactions[i].vendorAddress == vendorAddress) {
                vendorTransactions[index] = transactions[i];
                index++;
            }
        }

        return vendorTransactions;
    }

    // Modifier to check if the caller is the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    // Function to delete a transaction (if needed for any reason, could be optional)
    function deleteTransaction(uint256 transactionId) public onlyOwner {
        require(transactionId <= transactionCounter, "Transaction does not exist");
        delete transactions[transactionId];
    }
}
