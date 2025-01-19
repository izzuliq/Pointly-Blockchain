const PointlyUser = artifacts.require("PointlyUser");
const Rewards = artifacts.require("Rewards");

module.exports = async function(deployer) {
    // Deploy the PointlyUser contract first
    await deployer.deploy(PointlyUser);
    const pointlyUserInstance = await PointlyUser.deployed();

    // Deploy the Rewards contract with the PointlyUser contract address
    await deployer.deploy(Rewards, pointlyUserInstance.address);
};
