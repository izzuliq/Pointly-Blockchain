// API Endpoint for User Login
app.post('/api/login', async (req, res) => {
    const { email, password, role } = req.body;
  
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      // Connect to the database
      const pool = await sql.connect(dbConfig);
  
      // Fetch user details from the database
      const result = await pool.request()
        .input('Email', sql.NVarChar, email)
        .query(`SELECT PasswordHash, Role FROM Users WHERE Email = @Email`);
  
      if (result.recordset.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const user = result.recordset[0];
  
      // Check if roles match
      if (user.Role !== role) {
        return res.status(403).json({ message: 'Role mismatch' });
      }
  
      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      res.status(200).json({ message: 'Login successful', role });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });  