const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql } = require('./db');

// Handle user sign-up
const signUp = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if email already exists
    const result = await sql.query`SELECT * FROM ShopAdmins WHERE Email = ${email}`;
    if (result.recordset.length > 0) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user into ShopAdmins table
    const query = `
      INSERT INTO ShopAdmins (Email, PasswordHash, Role) 
      VALUES (@Email, @PasswordHash, @Role)
    `;
    await sql.query(query, { email, PasswordHash: hashedPassword, Role: role });

    // Send a success message or token
    const token = jwt.sign({ email }, 'your-secret-key', { expiresIn: '1h' });
    res.status(201).json({ message: 'Sign-up successful', token });
  } catch (err) {
    console.error('Sign-up error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Handle user login (optional)
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await sql.query`SELECT * FROM ShopAdmins WHERE Email = ${email}`;
    if (result.recordset.length === 0) {
      return res.status(400).json({ message: 'Email or password is incorrect' });
    }

    const user = result.recordset[0];

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email or password is incorrect' });
    }

    // Create JWT token
    const token = jwt.sign({ email: user.Email, role: user.Role }, 'your-secret-key', { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signUp, login };
