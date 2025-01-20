const fs = require("fs");
const path = require("path");

const PointlyUser = artifacts.require("PointlyUser");
const Rewards = artifacts.require("Rewards");
const PointlyVendor = artifacts.require("PointlyVendor"); // Import the PointlyVendor contract

module.exports = async function (deployer, network) {
  // Object to store contract addresses
  const addresses = {};

  // Deploy PointlyUser contract
  await deployer.deploy(PointlyUser);
  const pointlyUserInstance = await PointlyUser.deployed();
  addresses.PointlyUser = pointlyUserInstance.address;

  // Deploy Rewards contract with PointlyUser's address as constructor argument
  await deployer.deploy(Rewards, pointlyUserInstance.address);
  const rewardsInstance = await Rewards.deployed();
  addresses.Rewards = rewardsInstance.address;

  // Log the addresses object for debugging
  console.log("Contract addresses:", addresses);

  // Ensure the directory exists before writing to the file
  const configPath = path.resolve(__dirname, "./config.js");
  const configDir = path.dirname(configPath);

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Save contract addresses to config.js
  const configData = `
    const CONFIG = ${JSON.stringify(addresses, null, 2)};
    export default CONFIG;
  `;

  fs.writeFileSync(configPath, configData, "utf8");
  console.log("Generated config.js with contract addresses.");
};
