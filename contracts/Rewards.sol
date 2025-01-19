// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PointlyUser.sol";

contract Rewards {
    address public owner;
    address public pointlyUserContract;  // PointlyUser contract address

    struct Reward {
        uint256 id;
        string name;
        string description;
        uint256 cost;
        string img;
        uint256 expiration; // Unix timestamp
        string[] terms;
        bool isActive;
    }

    uint256 private rewardCounter;
    mapping(uint256 => Reward) public rewards;

    mapping(address => uint256) public userPoints;
    mapping(address => mapping(uint256 => bool)) public rewardRedeemed;

    event RewardAdded(uint256 rewardId, string name, uint256 cost);
    event RewardEdited(uint256 rewardId, string name, uint256 cost);
    event RewardDeactivated(uint256 rewardId);
    event RewardRedeemed(address indexed user, uint256 rewardId);
    event PointsAdded(address indexed user, uint256 points);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyVendor() {
        require(
            keccak256(abi.encodePacked(getUserRole(msg.sender))) == keccak256(abi.encodePacked("vendor")),
            "Only vendors can perform this action"
        );
        _;
    }

    constructor(address _pointlyUserContract) {
        owner = msg.sender;
        pointlyUserContract = _pointlyUserContract;
    }

    // Vendor Functions
    function addReward(
        string memory name,
        string memory description,
        uint256 cost,
        string memory img,
        uint256 expiration,
        string[] memory terms
    ) public onlyVendor {
        rewardCounter++;
        rewards[rewardCounter] = Reward({
            id: rewardCounter,
            name: name,
            description: description,
            cost: cost,
            img: img,
            expiration: expiration,
            terms: terms,
            isActive: true
        });

        emit RewardAdded(rewardCounter, name, cost);
    }

    function editReward(
        uint256 rewardId,
        string memory name,
        string memory description,
        uint256 cost,
        string memory img,
        uint256 expiration,
        string[] memory terms
    ) public onlyVendor {
        require(rewards[rewardId].isActive, "Reward is inactive or does not exist");

        rewards[rewardId].name = name;
        rewards[rewardId].description = description;
        rewards[rewardId].cost = cost;
        rewards[rewardId].img = img;
        rewards[rewardId].expiration = expiration;
        rewards[rewardId].terms = terms;

        emit RewardEdited(rewardId, name, cost);
    }

    function deactivateReward(uint256 rewardId) public onlyVendor {
        require(rewards[rewardId].isActive, "Reward is already inactive");
        rewards[rewardId].isActive = false;
        emit RewardDeactivated(rewardId);
    }

    // User Functions
    function getAllRewards() public view returns (Reward[] memory) {
        uint256 activeCount = 0;

        // Count active rewards
        for (uint256 i = 1; i <= rewardCounter; i++) {
            if (rewards[i].isActive) {
                activeCount++;
            }
        }

        // Create an array of active rewards
        Reward[] memory activeRewards = new Reward[](activeCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= rewardCounter; i++) {
            if (rewards[i].isActive) {
                activeRewards[index] = rewards[i];
                index++;
            }
        }

        return activeRewards;
    }

    function redeemReward(uint256 rewardId) public {
        require(rewards[rewardId].isActive, "Reward is inactive or does not exist");
        require(block.timestamp < rewards[rewardId].expiration, "Reward has expired");
        require(!rewardRedeemed[msg.sender][rewardId], "Reward already redeemed");
        require(userPoints[msg.sender] >= rewards[rewardId].cost, "Insufficient points");

        userPoints[msg.sender] -= rewards[rewardId].cost;
        rewardRedeemed[msg.sender][rewardId] = true;

        emit RewardRedeemed(msg.sender, rewardId);
    }

    function getRewardDetails(uint256 rewardId) public view returns (Reward memory) {
        require(rewards[rewardId].isActive, "Reward is inactive or does not exist");
        return rewards[rewardId];
    }

    function checkRedeemedRewards(address user) public view returns (uint256[] memory) {
        uint256 redeemedCount = 0;

        // Count redeemed rewards
        for (uint256 i = 1; i <= rewardCounter; i++) {
            if (rewardRedeemed[user][i]) {
                redeemedCount++;
            }
        }

        // Create an array of redeemed reward IDs
        uint256[] memory redeemedRewards = new uint256[](redeemedCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= rewardCounter; i++) {
            if (rewardRedeemed[user][i]) {
                redeemedRewards[index] = i;
                index++;
            }
        }

        return redeemedRewards;
    }

    // Helper function to get the user's role from PointlyUser contract
    function getUserRole(address user) public view returns (string memory) {
        ( , , , , , , , ,string memory role,) = PointlyUser(pointlyUserContract).getUser(user);
        return role;  // Return the role
    }

}
