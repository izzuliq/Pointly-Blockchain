import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sql } from './db.js'; // Adjust the import path as needed

const router = express.Router();

// Sign-up route
router.post('/', async (req, res) => {
  const { email, password, role } = req.body;

  // Default values for optional fields
  const name = req.body.name || 'Default Name';
  const phone = req.body.phone || '000-000-0000';
  const address = req.body.address || 'Default Address';
  const dob = req.body.dob || '2000-01-01';

  console.log('Request received:', { email, password, role, name, phone, address, dob });

  // Check if required fields are provided
  if (!email || !password || !role) {
    console.error('Missing required fields');
    return res.status(400).json({ message: 'Please provide email, password, and role' });
  }

  try {
    // Check if the email already exists
    const tableName = role === 'admin' ? 'Admins' : 'Users';
    console.log(`Checking if email exists in ${tableName}...`);
    const existingUser = await sql.query`SELECT * FROM ${sql.escapeIdentifier(tableName)} WHERE email = ${email}`;
    if (existingUser.recordset.length > 0) {
      console.warn('Email already exists:', email);
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Inserting user into database...');
    // Insert new user into the appropriate table
    if (role === 'admin') {
      const company_id = req.body.company_id || 1; // Default company_id
      await sql.query(`
        INSERT INTO Admins (email, password, name, phone, address, dob, role, company_id)
        VALUES (@Email, @PasswordHash, @Name, @Phone, @Address, @Dob, @Role, @CompanyId)
      `, { Email: email, PasswordHash: hashedPassword, Name: name, Phone: phone, Address: address, Dob: dob, Role: role, CompanyId: company_id });
    } else {
      await sql.query(`
        INSERT INTO Users (email, password, name, phone, address, dob, role)
        VALUES (@Email, @PasswordHash, @Name, @Phone, @Address, @Dob, @Role)
      `, { Email: email, PasswordHash: hashedPassword, Name: name, Phone: phone, Address: address, Dob: dob, Role: role });
    }

    // Create JWT token
    console.log('Creating JWT token...');
    const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send success response
    console.log('Sign-up successful');
    res.status(201).json({ message: 'Sign-up successful', token });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
