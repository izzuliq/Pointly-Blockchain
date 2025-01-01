const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MSSQL Configuration
const dbConfig = {
  user: 'your_username',
  password: 'your_password',
  server: 'your_server',
  database: 'your_database',
};

// Fetch User Profile and Points
app.get('/api/dashboard/user/:userID', async (req, res) => {
  const { userID } = req.params;

  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input('UserID', sql.Int, userID)
      .query(`
        SELECT Name, Tier, PointsTotal, PointsAvailable
        FROM Users
        WHERE UserID = @UserID
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch Recent Activities
app.get('/api/dashboard/activities/:userID', async (req, res) => {
  const { userID } = req.params;

  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input('UserID', sql.Int, userID)
      .query(`
        SELECT ActivityDescription, PointsEarned, Timestamp
        FROM Activities
        WHERE UserID = @UserID
        ORDER BY Timestamp DESC
        OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch Treasure Tiers
app.get('/api/dashboard/tiers', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .query(`
        SELECT TierName, Description, Rewards
        FROM Tiers
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));