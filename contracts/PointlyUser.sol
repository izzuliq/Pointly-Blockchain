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
        string addressDetails; // Renamed to avoid keyword conflict
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

    // Constructor to initialize the contract owner
    constructor() {
        owner = msg.sender; // Assign contract deployer as owner
    }

    // Function to create a new user
    function createUser(
        string memory email,
        string memory name,
        string memory phone,
        string memory addressDetails,
        string memory profileImage
    ) public {
        require(!users[msg.sender].exists, "User already exists");

        users[msg.sender] = User({
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

        emit UserCreated(msg.sender, name);
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
        uint256 availablePoints,
        bool exists
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
            user.availablePoints,
            user.exists
        );
    }


    // Function to update points
    function updatePoints(address userAddress, uint256 points, bool isAddition) public {
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
    function deleteUser() public {
        require(users[msg.sender].exists, "User does not exist");

        delete users[msg.sender];
        emit UserDeleted(msg.sender);
    }
}
