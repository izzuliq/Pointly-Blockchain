const PointlyUser = artifacts.require("PointlyUser");

module.exports = function (deployer) {
  deployer.deploy(PointlyUser);
};
