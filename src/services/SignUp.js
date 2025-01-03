import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sql } from './db.js'; // Adjust the import path as needed

const router = express.Router();

// Sign-up route
router.post('/', async (req, res) => {
  const { email, password, role } = req.body;

  // Check if all required fields are provided
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Please provide email, password, and role' });
  }

  try {
    // Check if the email already exists
    const existingUser = await sql.query`SELECT * FROM ShopAdmins WHERE Email = ${email}`;
    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user into the database
    await sql.query(`
      INSERT INTO ShopAdmins (Email, PasswordHash, Role) 
      VALUES (@Email, @PasswordHash, @Role)
    `, { email, PasswordHash: hashedPassword, Role: role });

    // Create JWT token
    const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send success response with the token
    res.status(201).json({ message: 'Sign-up successful', token });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
