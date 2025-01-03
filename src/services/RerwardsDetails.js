import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB, sql } from './db.js'; // Ensure your DB connection is properly configured

const app = express();
const port = 5000;

// Use middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
connectDB()
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Database connection failed:', err));

// Fetch reward details by ID
app.get('/api/reward-details/:rewardId', async (req, res) => {
  try {
    const { rewardId } = req.params;

    // Fetch reward details from the database
    const rewardResult = await sql.query`SELECT RewardID AS id, Name, Description, PointsRequired AS points, ImgSrc AS imgSrc, ExpirationDate AS expiration FROM Rewards WHERE RewardID = ${rewardId}`;
    if (rewardResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    const reward = rewardResult.recordset[0];
    reward.expiration = new Date(reward.expiration); // Convert to Date object for consistency
    res.json(reward);
  } catch (error) {
    console.error('Error fetching reward details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Redeem a reward
app.post('/api/redeem-reward', async (req, res) => {
  try {
    const { userId, rewardId } = req.body;

    // Validate request data
    if (!userId || !rewardId) {
      return res.status(400).json({ message: 'User ID and Reward ID are required' });
    }

    // Fetch reward and user data
    const rewardResult = await sql.query`SELECT PointsRequired FROM Rewards WHERE RewardID = ${rewardId}`;
    if (rewardResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    const reward = rewardResult.recordset[0];
    const userResult = await sql.query`SELECT AvailablePoints FROM Users WHERE UserID = ${userId}`;
    if (userResult.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.recordset[0];

    // Check if the user has enough points to redeem the reward
    if (user.AvailablePoints < reward.PointsRequired) {
      return res.status(400).json({ message: 'Insufficient points to redeem this reward' });
    }

    // Deduct points and log the redemption
    await sql.query`
      UPDATE Users
      SET AvailablePoints = AvailablePoints - ${reward.PointsRequired}
      WHERE UserID = ${userId}
    `;

    await sql.query`
      INSERT INTO RedemptionLogs (UserID, RewardID, RedeemedAt)
      VALUES (${userId}, ${rewardId}, GETDATE())
    `;

    res.status(200).json({ message: 'Reward redeemed successfully' });
  } catch (error) {
    console.error('Error redeeming reward:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
