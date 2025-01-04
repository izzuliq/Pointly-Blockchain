import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';  // Import JWT library
import { sql, connectDB } from './db.js'; // Ensure correct path for db.js
import dotenv from 'dotenv';

// Explicitly load the .env file
dotenv.config();  // No need to specify the path unless the .env file is not at the root
console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);

const router = express.Router();

// Sign-up route
router.post('/', async (req, res) => {
  const { email, password, role } = req.body;

  // Default values for optional fields
  const name = req.body.name || 'Default Name';
  const phone = req.body.phone || '000-000-0000';
  const address = req.body.address || 'Default Address';
  const dob = req.body.dob || '2000-01-01';

  console.log('Request received:', { email, role, name, phone, address, dob });

  // Validate required fields
  if (!email || !password || !role) {
    console.error('Missing required fields');
    return res.status(400).json({ message: 'Please provide email, password, and role' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Connect to the database
    const pool = await connectDB();
    const request = pool.request();

    // Insert user into the database
    const query = `
      INSERT INTO Users (Email, Password, Name, Phone, Address, Dob, Role)
      VALUES (@Email, @Password, @Name, @Phone, @Address, @Dob, @Role)
    `;

    request.input('Email', sql.VarChar, email)
      .input('Password', sql.VarChar, hashedPassword)
      .input('Name', sql.VarChar, name)
      .input('Phone', sql.VarChar, phone)
      .input('Address', sql.VarChar, address)
      .input('Dob', sql.Date, dob)
      .input('Role', sql.VarChar, role);

    if (role === 'admin') {
      const company_id = req.body.company_id || 1; // Default company_id
      request.input('CompanyId', sql.Int, company_id);
    }

    await request.query(query);

    // Generate JWT token after successful sign-up
    const payload = { email, role }; // Include the email and role in the token payload
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' }); // 1 hour expiration time

    // Send success response with JWT token
    console.log('Sign-up successful');
    res.status(201).json({
      message: 'Sign-up successful',
      token, // Return the JWT token to the frontend
    });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ message: 'Error during sign-up', error: error.message });
  }
});

export default router;
