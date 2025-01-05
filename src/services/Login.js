import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sql, connectDB } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Login route
router.post('/', async (req, res) => {
  const { email, password, role } = req.body;
  console.log('Received login request:', { email, role });

  try {
    const pool = await connectDB();
    const request = pool.request();

    const query = `
      SELECT Id, Role, Password FROM Users WHERE LOWER(Email) = LOWER(@Email) AND Role = @Role
    `;
    const result = await request
      .input('Email', sql.VarChar, email)
      .input('Role', sql.VarChar, role)
      .query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found or invalid role' });
    }

    const user = result.recordset[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.Password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const payload = { email, role, userId: user.Id };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    const redirectPath = role === 'user' ? '/home' : '/vendor-home';

    res.status(200).json({
      message: 'Login successful',
      token,
      redirectPath,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

export default router;
