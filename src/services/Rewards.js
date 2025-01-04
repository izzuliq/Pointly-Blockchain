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

// Fetch points endpoint
app.get('/api/points', async (req, res) => {
  try {
    const userId = req.query.userId; // Assuming userId is passed as a query parameter
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const pointsResult = await sql.query`SELECT TotalPoints, AvailablePoints FROM User WHERE UserID = ${userId}`;
    if (pointsResult.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const points = pointsResult.recordset[0];
    res.json({
      total: points.TotalPoints,
      available: points.AvailablePoints,
    });
  } catch (error) {
    console.error('Error fetching points:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch rewards endpoint
app.get('/api/rewards', async (req, res) => {
  try {
    const rewardsResult = await sql.query`SELECT RewardID AS id, Name, Description, PointsRequired AS points, ImgSrc AS imgSrc FROM Rewards`;
    res.json(rewardsResult.recordset);
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
