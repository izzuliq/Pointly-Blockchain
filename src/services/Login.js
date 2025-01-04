// API Endpoint for User Login
app.post('/api/login', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
  }

  try {
      // Connect to the database
      const pool = await sql.connect(dbConfig);

      let query, user;

      if (role === 'admin') {
          // For admin login, check the Admins table
          query = `SELECT id, PasswordHash, Role, company_id FROM Admins WHERE email = @Email`;
      } else {
          // For regular user login, check the Users table
          query = `SELECT id, PasswordHash, Role FROM Users WHERE email = @Email`;
      }

      // Fetch user details based on the role
      const result = await pool.request()
          .input('Email', sql.NVarChar, email)
          .query(query);

      if (result.recordset.length === 0) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      user = result.recordset[0];

      // Check if roles match
      if (user.Role !== role) {
          return res.status(403).json({ message: 'Role mismatch' });
      }

      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Send the response based on role
      if (role === 'admin') {
          // Admins also get their associated company info in the response
          res.status(200).json({
              message: 'Admin login successful',
              userId: user.id,
              role,
              companyId: user.company_id  // Company info for the admin
          });
      } else {
          // For regular users, only send basic user info
          res.status(200).json({
              message: 'Login successful',
              userId: user.id,
              role
          });
      }

  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
  }
});
