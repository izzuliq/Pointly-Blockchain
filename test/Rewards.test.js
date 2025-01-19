const Rewards = artifacts.require("Rewards");

contract("Rewards", (accounts) => {
  let rewardsInstance;
  const owner = accounts[0];
  const user = accounts[1];

  before(async () => {
    rewardsInstance = await Rewards.new({ from: owner });
  });

  it("should add a reward", async () => {
    const rewardName = "Free Coffee";
    const description = "Redeem for a free coffee.";
    const cost = 100;
    const img = "https://example.com/image.png";
    const expiration = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days from now
    const terms = ["Valid at all locations", "One per customer"];

    await rewardsInstance.addReward(rewardName, description, cost, img, expiration, terms, { from: owner });

    const reward = await rewardsInstance.getReward(1);
    assert.equal(reward[0], rewardName, "Reward name does not match");
    assert.equal(reward[1], description, "Reward description does not match");
    assert.equal(reward[2].toNumber(), cost, "Reward cost does not match");
    assert.equal(reward[3], img, "Reward image does not match");
    assert.equal(reward[4].toNumber(), expiration, "Reward expiration does not match");
    assert.equal(reward[6], true, "Reward should be active");
  });

  it("should edit an existing reward", async () => {
    const newName = "Free Latte";
    const newDescription = "Redeem for a free latte.";
    const newCost = 150;
    const newImg = "https://example.com/newimage.png";
    const newExpiration = Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60; // 14 days from now
    const newTerms = ["Valid at selected locations", "Not combinable with other offers"];

    await rewardsInstance.editReward(1, newName, newDescription, newCost, newImg, newExpiration, newTerms, { from: owner });

    const reward = await rewardsInstance.getReward(1);
    assert.equal(reward[0], newName, "Updated reward name does not match");
    assert.equal(reward[1], newDescription, "Updated reward description does not match");
    assert.equal(reward[2].toNumber(), newCost, "Updated reward cost does not match");
    assert.equal(reward[3], newImg, "Updated reward image does not match");
    assert.equal(reward[4].toNumber(), newExpiration, "Updated reward expiration does not match");
  });

  it("should deactivate a reward", async () => {
    await rewardsInstance.deactivateReward(1, { from: owner });
    const reward = await rewardsInstance.getReward(1);

    assert.equal(reward[6], false, "Reward should be inactive");
  });

  it("should add points to a user", async () => {
    const points = 200;

    await rewardsInstance.addPoints(user, points, { from: owner });

    const userPoints = await rewardsInstance.userPoints(user);
    assert.equal(userPoints.toNumber(), points, "User points were not added correctly");
  });

  it("should redeem a reward", async () => {
    // Reactivate reward for testing redemption
    const rewardName = "Free Coffee";
    const description = "Redeem for a free coffee.";
    const cost = 100;
    const img = "https://example.com/image.png";
    const expiration = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days from now
    const terms = ["Valid at all locations", "One per customer"];

    await rewardsInstance.addReward(rewardName, description, cost, img, expiration, terms, { from: owner });

    // Redeem reward
    await rewardsInstance.redeemReward(2, { from: user });

    const userPoints = await rewardsInstance.userPoints(user);
    assert.equal(userPoints.toNumber(), 100, "User points were not deducted correctly");

    const redeemed = await rewardsInstance.rewardRedeemed(user, 2);
    assert.equal(redeemed, true, "Reward was not marked as redeemed");
  });

  it("should not allow redemption of an inactive or expired reward", async () => {
    const expiredRewardId = 3;
    const rewardName = "Expired Reward";
    const description = "This reward is expired.";
    const cost = 50;
    const img = "https://example.com/expired.png";
    const expiration = Math.floor(Date.now() / 1000) - 1; // Expired timestamp
    const terms = ["Expired reward"];

    await rewardsInstance.addReward(rewardName, description, cost, img, expiration, terms, { from: owner });

    try {
      await rewardsInstance.redeemReward(expiredRewardId, { from: user });
      assert.fail("Redemption of an expired reward should fail");
    } catch (error) {
      assert(error.message.includes("Reward has expired"), "Expected 'Reward has expired' error");
    }

    await rewardsInstance.deactivateReward(2, { from: owner });

    try {
      await rewardsInstance.redeemReward(2, { from: user });
      assert.fail("Redemption of an inactive reward should fail");
    } catch (error) {
      assert(error.message.includes("Reward is inactive"), "Expected 'Reward is inactive' error");
    }
  });
});
