const express = require('express');
const sql = require('mssql');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const dbConfig = {
  user: 'your_username',
  password: 'your_password',
  server: 'your_server_address',
  database: 'MultiShopSystem',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// 1. Get User's Available Points
app.get('/points', async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT AvailablePoints FROM Users WHERE Id = @userId');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ availablePoints: result.recordset[0].AvailablePoints });
  } catch (error) {
    console.error('Error fetching points:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// 2. Get Available Rewards
app.get('/rewards', async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    const pool = await sql.connect(dbConfig);

    // Fetch user points
    const userPoints = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT AvailablePoints FROM Users WHERE Id = @userId');

    if (userPoints.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const availablePoints = userPoints.recordset[0].AvailablePoints;

    // Fetch rewards within user's point range
    const rewards = await pool.request()
      .input('availablePoints', sql.Int, availablePoints)
      .query('SELECT * FROM Rewards WHERE Cost <= @availablePoints');

    res.status(200).json({ rewards: rewards.recordset });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// 3. Claim Reward and Deduct Points
app.post('/claim-reward', async (req, res) => {
  const { userId, rewardId } = req.body;

  if (!userId || !rewardId) {
    return res.status(400).json({ message: 'User ID and Reward ID are required.' });
  }

  try {
    const pool = await sql.connect(dbConfig);

    // Check if user has enough points
    const userPoints = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT AvailablePoints FROM Users WHERE Id = @userId');

    if (userPoints.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const availablePoints = userPoints.recordset[0].AvailablePoints;

    // Fetch reward cost
    const reward = await pool.request()
      .input('rewardId', sql.Int, rewardId)
      .query('SELECT Cost FROM Rewards WHERE Id = @rewardId');

    if (reward.recordset.length === 0) {
      return res.status(404).json({ message: 'Reward not found.' });
    }

    const rewardCost = reward.recordset[0].Cost;

    if (availablePoints < rewardCost) {
      return res.status(400).json({ message: 'Not enough points to claim this reward.' });
    }

    // Deduct points and log the claim
    await pool.request()
      .input('userId', sql.Int, userId)
      .input('rewardId', sql.Int, rewardId)
      .input('cost', sql.Int, rewardCost)
      .query(`
        BEGIN TRANSACTION;
        UPDATE Users SET AvailablePoints = AvailablePoints - @cost WHERE Id = @userId;
        INSERT INTO ClaimedRewards (UserId, RewardId, ClaimedAt) VALUES (@userId, @rewardId, GETDATE());
        COMMIT TRANSACTION;
      `);

    res.status(200).json({ message: 'Reward claimed successfully.' });
  } catch (error) {
    console.error('Error claiming reward:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
