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
    if (err) {
      console.error('JWT error:', err); // Log the error
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.log('Decoded JWT for user:', user); // Log decoded user info
    req.user = user;
    next();
  });
};

// Fetch user profile data
router.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email; // Extract email from JWT
    console.log('Fetching profile for user:', userEmail); // Log the user email

    const result = await sql.query`
      SELECT Name, Tier, ProfileImage AS avatarUrl 
      FROM ShopAdmins 
      WHERE Email = ${userEmail}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error); // Log any server errors
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch points data
router.get('/api/user/points', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    console.log('Fetching points for user:', userEmail); // Log the user email

    const result = await sql.query`
      SELECT TotalPoints AS total, AvailablePoints AS available 
      FROM Points 
      WHERE Email = ${userEmail}
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
    console.log('Fetching activities for user:', userEmail); // Log the user email

    const result = await sql.query`
      SELECT Description AS description, TimeAgo AS timeAgo
      FROM Activities
      WHERE Email = ${userEmail}
      ORDER BY CreatedAt DESC
      FETCH NEXT 10 ROWS ONLY
    `;

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch progress data
router.get('/api/user/progress', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    console.log('Fetching progress for user:', userEmail); // Log the user email

    const result = await sql.query`
      SELECT ProgressPercentage AS percentage 
      FROM Progress 
      WHERE Email = ${userEmail}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Progress data not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
