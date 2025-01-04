import express from 'express';
import jwt from 'jsonwebtoken';
import sql from 'mssql'; // Assuming you're using SQL Server for your database
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Fetch user profile data
router.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email; // Extract email from JWT

    // Query to fetch user profile details
    const result = await sql.query`
      SELECT name, tier, profile_image AS avatarUrl 
      FROM Users 
      WHERE email = ${userEmail}
    `;
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch points data (from Users table)
router.get('/api/user/points', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    // Query to fetch points directly from the Users table
    const result = await sql.query`
      SELECT total_points AS total, available_points AS available 
      FROM Users 
      WHERE email = ${userEmail}
    `;
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Points data not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching points:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch recent activities
router.get('/api/user/activities', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Get user ID from email
    const userResult = await sql.query`
      SELECT id FROM Users WHERE email = ${userEmail}
    `;
    if (userResult.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userId = userResult.recordset[0].id;

    // Query to fetch activities for the user
    const activitiesResult = await sql.query`
      SELECT description, created_at AS timeAgo
      FROM Activities
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      FETCH NEXT 10 ROWS ONLY
    `;

    res.json(activitiesResult.recordset);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch progress data (assuming a Progress table exists in your database)
router.get('/api/user/progress', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    
    // Get user ID from email
    const userResult = await sql.query`
      SELECT id FROM Users WHERE email = ${userEmail}
    `;
    if (userResult.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userId = userResult.recordset[0].id;

    // Query to fetch progress for the user (assuming a Progress table)
    const progressResult = await sql.query`
      SELECT ProgressPercentage AS percentage
      FROM Progress
      WHERE user_id = ${userId}
    `;
    
    if (progressResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Progress data not found' });
    }

    res.json(progressResult.recordset[0]);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
