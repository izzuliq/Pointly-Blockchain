// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PointlyUser {

    // Owner of the contract (platform admin)
    address public owner;

    // User structure for storing user data
    struct User {
        string email;
        string name;
        string phone;
        string addressDetails;  // Renamed to avoid keyword conflict
        string profileImage;
        string tier;
        uint256 totalPoints;
        uint256 availablePoints;
        bool exists; // To check if a user exists
    }

    // Mapping of addresses to users
    mapping(address => User) private users;

    // Events for logging actions
    event UserCreated(address indexed userAddress, string name);
    event PointsUpdated(address indexed userAddress, uint256 newTotalPoints, uint256 newAvailablePoints);
    event TierUpdated(address indexed userAddress, string newTier);
    event UserDeleted(address indexed userAddress);

    // Modifier for restricting access to owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender; // Assign contract deployer as owner
    }

    // Function to create a new user
    function createUser(
        address userAddress,
        string memory email,
        string memory name,
        string memory phone,
        string memory addressDetails,
        string memory profileImage
    ) public onlyOwner {
        require(!users[userAddress].exists, "User already exists");
        
        users[userAddress] = User({
            email: email,
            name: name,
            phone: phone,
            addressDetails: addressDetails,
            profileImage: profileImage,
            tier: "Quartz",
            totalPoints: 0,
            availablePoints: 0,
            exists: true
        });

        emit UserCreated(userAddress, name);
    }

    // Function to get user details
    function getUser(address userAddress) 
        public 
        view 
        returns (
            string memory email,
            string memory name,
            string memory phone,
            string memory addressDetails,
            string memory profileImage,
            string memory tier,
            uint256 totalPoints,
            uint256 availablePoints
        ) 
    {
        require(users[userAddress].exists, "User does not exist");
        User memory user = users[userAddress];

        return (
            user.email,
            user.name,
            user.phone,
            user.addressDetails,
            user.profileImage,
            user.tier,
            user.totalPoints,
            user.availablePoints
        );
    }

    // Function to update points
    function updatePoints(address userAddress, uint256 points, bool isAddition) public onlyOwner {
        require(users[userAddress].exists, "User does not exist");

        if (isAddition) {
            users[userAddress].totalPoints += points;
            users[userAddress].availablePoints += points;
        } else {
            require(users[userAddress].availablePoints >= points, "Insufficient points");
            users[userAddress].availablePoints -= points;
        }

        updateUserTier(userAddress);

        emit PointsUpdated(
            userAddress,
            users[userAddress].totalPoints,
            users[userAddress].availablePoints
        );
    }

    // Internal function to update the user's tier
    function updateUserTier(address userAddress) internal {
        uint256 totalPoints = users[userAddress].totalPoints;

        if (totalPoints >= 10000) {
            users[userAddress].tier = "Diamond";
        } else if (totalPoints >= 5000) {
            users[userAddress].tier = "Sapphire";
        } else if (totalPoints >= 1000) {
            users[userAddress].tier = "Emerald";
        } else {
            users[userAddress].tier = "Quartz";
        }

        emit TierUpdated(userAddress, users[userAddress].tier);
    }

    // Function to delete a user
    function deleteUser(address userAddress) public onlyOwner {
        require(users[userAddress].exists, "User does not exist");

        delete users[userAddress];
        emit UserDeleted(userAddress);
    }
}
