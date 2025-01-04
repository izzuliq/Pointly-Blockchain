import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sql } from './db.js'; // Adjust the import path as needed

const router = express.Router();

// Sign-up route
router.post('/', async (req, res) => {
  const { email, password, role, name, phone, address, dob } = req.body;

  // Check if all required fields are provided
  if (!email || !password || !role || !name || !phone || !address || !dob) {
    return res.status(400).json({ message: 'Please provide email, password, role, name, phone, address, and dob' });
  }

  try {
    // Check if the email already exists (check against Users for regular users and Admins for admins)
    const existingUser = await sql.query`SELECT * FROM ${role === 'admin' ? 'Admins' : 'Users'} WHERE email = ${email}`;
    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user into the appropriate table (Users or Admins)
    if (role === 'admin') {
      const { company_id } = req.body; // Assuming company_id is provided for admin
      await sql.query(`
        INSERT INTO Admins (email, password, name, phone, address, dob, role, company_id)
        VALUES (@Email, @PasswordHash, @Name, @Phone, @Address, @Dob, @Role, @CompanyId)
      `, { email, PasswordHash: hashedPassword, Name: name, Phone: phone, Address: address, Dob: dob, Role: role, CompanyId: company_id });
    } else {
      await sql.query(`
        INSERT INTO Users (email, password, name, phone, address, dob, role)
        VALUES (@Email, @PasswordHash, @Name, @Phone, @Address, @Dob, @Role)
      `, { email, PasswordHash: hashedPassword, Name: name, Phone: phone, Address: address, Dob: dob, Role: role });
    }

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
