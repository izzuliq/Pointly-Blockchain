import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';  // Import the JWT library
import { sql, connectDB } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Login route
router.post('/', async (req, res) => {
  const { email, password, role } = req.body;

  console.log('Received login request:', { email, role });

  try {
    console.log('Connecting to the database...');
    const pool = await connectDB();
    const request = pool.request();

    // Query to fetch user based on email (case-insensitive) and role
    console.log('Preparing and executing query...');
    const query = `
      SELECT Id, Role, Password FROM Users WHERE LOWER(Email) = LOWER(@Email) AND Role = @Role
    `;
    const result = await request
      .input('Email', sql.VarChar, email)
      .input('Role', sql.VarChar, role)
      .query(query);

    console.log('Query result:', result);

    // Check if the user exists
    if (result.recordset.length === 0) {
      console.log('User not found or invalid role');
      return res.status(404).json({ message: 'User not found or invalid role' });
    }

    const user = result.recordset[0];
    console.log('User found:', user);

    // Validate if the required fields are present
    if (!user.Password) {
      console.error('Password field is missing in the query result:', user);
      return res.status(500).json({ message: 'Internal server error: Password field is missing' });
    }

    // Compare the entered password with the hashed password in the database
    console.log('Comparing passwords...');
    const isPasswordCorrect = await bcrypt.compare(password, user.Password);
    console.log('Password comparison result:', isPasswordCorrect);

    if (!isPasswordCorrect) {
      console.log('Incorrect password');
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate JWT token
    const payload = { email, role, userId: user.Id }; // Include relevant user information in the token
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' }); // 1 hour expiration

    console.log('Login successful');
    res.status(200).json({
      message: 'Login successful',
      token, // Send the JWT token back to the frontend
      userRole: user.Role,
      userId: user.Id,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

export default router;
