import express from 'express';
import bcrypt from 'bcryptjs';
import { sql, connectDB } from './db.js'; // Ensure correct path for db.js
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Login route
router.post('/', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Connect to the database
    const pool = await connectDB();
    const request = pool.request();

    // Query to fetch user based on email and role
    const query = `
      SELECT * FROM Users WHERE Email = @Email AND Role = @Role
    `;

    const result = await request
      .input('Email', sql.VarChar, email)
      .input('Role', sql.VarChar, role)
      .query(query);

    if (result.recordset.length === 0) {
      console.log('User not found or invalid role');
      return res.status(404).json({ message: 'User not found or invalid role' });
    }

    const user = result.recordset[0];

    // Compare the password with the hashed password stored in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.Password);

    if (!isPasswordCorrect) {
      console.log('Incorrect password');
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Send success response with the token
    console.log('Login successful');
    res.status(200).json({
      message: 'Login successful',
      token,
      userRole: user.Role,
      userId: user.UserId,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

export default router;
