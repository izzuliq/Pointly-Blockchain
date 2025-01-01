const express = require('express');
const sql = require('mssql');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Database connection configuration
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

// Route: Get Dashboard Data
app.get('/dashboard', async (req, res) => {
  // Assuming userId is sent as a query parameter (or could be decoded from a JWT)
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    const pool = await sql.connect(dbConfig);

    // Fetch user profile
    const userProfile = await pool
      .request()
      .input('userId', sql.Int, userId)
      .query(
        `SELECT Name, PictureUrl, TotalPoints, AvailablePoints 
         FROM Users 
         WHERE Id = @userId`
      );

    if (userProfile.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Fetch recent activities
    const recentActivities = await pool
      .request()
      .input('userId', sql.Int, userId)
      .query(
        `SELECT Activity, Timestamp 
         FROM Activities 
         WHERE UserId = @userId 
         ORDER BY Timestamp DESC 
         OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY`
      );

    // Calculate progress (example logic)
    const progress = Math.min(
      100,
      (userProfile.recordset[0].AvailablePoints / 1000) * 100
    );

    res.status(200).json({
      profile: userProfile.recordset[0],
      recentActivities: recentActivities.recordset,
      progress,
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
