const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const sql = require('mssql');
const cors = require('cors');

// MSSQL Configuration
const dbConfig = {
  user: 'your_username',
  password: 'your_password',
  server: 'your_server',
  database: 'your_database',
  options: {
    encrypt: true,
    trustServerCertificate: true, // For self-signed certificates
  },
};

const app = express();
app.use(bodyParser.json());
app.use(cors());

// API Endpoint for User Registration
app.post('/api/signup', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Connect to the database
    const pool = await sql.connect(dbConfig);

    // Insert the user into the database
    const result = await pool.request()
      .input('Email', sql.NVarChar, email)
      .input('PasswordHash', sql.NVarChar, passwordHash)
      .input('Role', sql.NVarChar, role)
      .query(`
        INSERT INTO Users (Email, PasswordHash, Role) 
        VALUES (@Email, @PasswordHash, @Role)
      `);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    if (err.originalError && err.originalError.info && err.originalError.info.number === 2627) {
      // Unique constraint error
      res.status(400).json({ message: 'Email already exists' });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});