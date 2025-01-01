const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Database connection configuration
const dbConfig = {
  user: 'your_username',
  password: 'your_password',
  server: 'your_server_address',
  database: 'MultiShopSystem',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Route: User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const pool = await sql.connect(dbConfig);

    // Fetch user from the database by email
    const userResult = await pool
      .request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM Users WHERE Email = @email');

    if (userResult.recordset.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = userResult.recordset[0];

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.Password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.Id, email: user.Email, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful.', token, role: user.Role });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
