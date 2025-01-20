const PointlyUser = artifacts.require("PointlyUser");
const Rewards = artifacts.require("Rewards");
const PointlyVendor = artifacts.require("PointlyVendor"); // Import the PointlyVendor contract

module.exports = async function(deployer) {
    // Deploy the PointlyUser contract first
    await deployer.deploy(PointlyUser);
    const pointlyUserInstance = await PointlyUser.deployed();

    // Deploy the Rewards contract with the PointlyUser contract address
    await deployer.deploy(Rewards, pointlyUserInstance.address);
    const rewardsInstance = await Rewards.deployed();

    // Deploy the PointlyVendor contract with the PointlyUser contract address (if required)
    await deployer.deploy(PointlyVendor);
    const pointlyVendorInstance = await PointlyVendor.deployed();

    console.log("Contracts deployed:");
    console.log("PointlyUser address:", pointlyUserInstance.address);
    console.log("Rewards address:", rewardsInstance.address);
    console.log("PointlyVendor address:", pointlyVendorInstance.address);
};
