// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Rewards {
    address public owner;

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

    constructor() {
        owner = msg.sender;
    }

    // Function to add a new reward
    function addReward(
        string memory name,
        string memory description,
        uint256 cost,
        string memory img,
        uint256 expiration,
        string[] memory terms
    ) public onlyOwner {
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

    // Function to edit an existing reward
    function editReward(
        uint256 rewardId,
        string memory name,
        string memory description,
        uint256 cost,
        string memory img,
        uint256 expiration,
        string[] memory terms
    ) public onlyOwner {
        require(rewards[rewardId].isActive, "Reward is inactive or does not exist");

        rewards[rewardId].name = name;
        rewards[rewardId].description = description;
        rewards[rewardId].cost = cost;
        rewards[rewardId].img = img;
        rewards[rewardId].expiration = expiration;
        rewards[rewardId].terms = terms;

        emit RewardEdited(rewardId, name, cost);
    }

    // Function to deactivate a reward
    function deactivateReward(uint256 rewardId) public onlyOwner {
        require(rewards[rewardId].isActive, "Reward is already inactive");
        rewards[rewardId].isActive = false;
        emit RewardDeactivated(rewardId);
    }

    // Function to add points to a user
    function addPoints(address user, uint256 points) public onlyOwner {
        userPoints[user] += points;
        emit PointsAdded(user, points);
    }

    // Function to redeem a reward
    function redeemReward(uint256 rewardId) public {
        require(rewards[rewardId].isActive, "Reward is inactive or does not exist");
        require(block.timestamp < rewards[rewardId].expiration, "Reward has expired");
        require(!rewardRedeemed[msg.sender][rewardId], "Reward already redeemed");
        require(userPoints[msg.sender] >= rewards[rewardId].cost, "Insufficient points");

        userPoints[msg.sender] -= rewards[rewardId].cost;
        rewardRedeemed[msg.sender][rewardId] = true;

        emit RewardRedeemed(msg.sender, rewardId);
    }

    // Function to get reward details
    function getReward(uint256 rewardId) public view returns (
        string memory name,
        string memory description,
        uint256 cost,
        string memory img,
        uint256 expiration,
        string[] memory terms,
        bool isActive
    ) {
        Reward memory reward = rewards[rewardId];
        require(reward.isActive, "Reward is inactive or does not exist");

        return (
            reward.name,
            reward.description,
            reward.cost,
            reward.img,
            reward.expiration,
            reward.terms,
            reward.isActive
        );
    }
}
