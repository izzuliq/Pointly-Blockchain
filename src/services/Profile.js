import express from 'express';
import { sql } from './db.js'; // Assuming `db.js` handles the database connection and exports the `sql` object
import authenticateToken from './middleware/authMiddleware.js'; // Middleware to validate JWT token

const router = express.Router();

// Fetch user profile
router.get('/user/profile', authenticateToken, async (req, res) => {
  const userEmail = req.user.email; // Assuming email is stored in the JWT token
  
  try {
    const result = await sql.query`SELECT * FROM ShopAdmins WHERE Email = ${userEmail}`;
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.recordset[0];
    const userData = {
      name: user.Name,
      email: user.Email,
      phone: user.Phone || '',
      address: user.Address || '',
      dob: user.DateOfBirth || '',
      profileImage: user.ProfileImage || 'default.png', // Default image if not set
    };

    res.json(userData);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/user/profile', authenticateToken, async (req, res) => {
  const userEmail = req.user.email; // Extract email from JWT token
  const { name, phone, address, dob, profileImage } = req.body;

  try {
    const result = await sql.query`SELECT * FROM ShopAdmins WHERE Email = ${userEmail}`;
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateQuery = `
      UPDATE ShopAdmins
      SET Name = @Name, Phone = @Phone, Address = @Address, 
          DateOfBirth = @DateOfBirth, ProfileImage = @ProfileImage
      WHERE Email = @Email
    `;

    await sql.query(updateQuery, {
      Email: userEmail,
      Name: name || result.recordset[0].Name,
      Phone: phone || result.recordset[0].Phone,
      Address: address || result.recordset[0].Address,
      DateOfBirth: dob || result.recordset[0].DateOfBirth,
      ProfileImage: profileImage || result.recordset[0].ProfileImage,
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
