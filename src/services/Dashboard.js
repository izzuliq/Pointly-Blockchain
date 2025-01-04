import express from 'express';
import jwt from 'jsonwebtoken';
import sql from 'mssql'; // Assuming you're using SQL Server for your database
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Fetch user profile data
router.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    console.log('Fetching profile for email:', userEmail);

    const result = await sql.query`
      SELECT name, tier, profile_image AS avatarUrl 
      FROM Users 
      WHERE email = ${userEmail}
    `;

    console.log('Profile query result:', result.recordset);

    if (result.recordset.length === 0) {
      console.log('No profile data found for email:', userEmail);
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch points data
router.get('/api/user/points', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    console.log('Fetching points for email:', userEmail);

    const result = await sql.query`
      SELECT total_points AS total, available_points AS available 
      FROM Users 
      WHERE email = ${userEmail}
    `;

    console.log('Points query result:', result.recordset);

    if (result.recordset.length === 0) {
      console.log('No points data found for email:', userEmail);
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
    console.log('Fetching activities for email:', userEmail);

    const userResult = await sql.query`
      SELECT id FROM Users WHERE email = ${userEmail}
    `;
    console.log('User ID query result:', userResult.recordset);

    if (userResult.recordset.length === 0) {
      console.log('No user found for email:', userEmail);
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = userResult.recordset[0].id;

    const activitiesResult = await sql.query`
      SELECT description, created_at AS timeAgo
      FROM Activities
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      FETCH NEXT 10 ROWS ONLY
    `;
    console.log('Activities query result:', activitiesResult.recordset);

    res.json(activitiesResult.recordset);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch progress data
router.get('/api/user/progress', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    console.log('Fetching progress for email:', userEmail);

    const userResult = await sql.query`
      SELECT id FROM Users WHERE email = ${userEmail}
    `;
    console.log('User ID query result:', userResult.recordset);

    if (userResult.recordset.length === 0) {
      console.log('No user found for email:', userEmail);
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = userResult.recordset[0].id;

    const progressResult = await sql.query`
      SELECT ProgressPercentage AS percentage
      FROM Progress
      WHERE user_id = ${userId}
    `;
    console.log('Progress query result:', progressResult.recordset);

    if (progressResult.recordset.length === 0) {
      console.log('No progress data found for user ID:', userId);
      return res.status(404).json({ message: 'Progress data not found' });
    }

    res.json(progressResult.recordset[0]);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
