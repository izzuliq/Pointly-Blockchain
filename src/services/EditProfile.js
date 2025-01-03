import multer from 'multer';
import express from 'express';
import { sql } from './db.js';
import authenticateToken from './middleware/authMiddleware.js';

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile-pictures'); // Folder to store profile pictures
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Update user profile
router.put(
  '/user/profile',
  authenticateToken,
  upload.single('profilePicture'), // Middleware for handling file uploads
  async (req, res) => {
    const userEmail = req.user.email; // Extract email from JWT token
    const { name, phone, address, dob } = req.body;
    let profileImage = req.file ? req.file.path : null; // Path to uploaded profile picture

    try {
      // Fetch existing user data
      const result = await sql.query`SELECT * FROM ShopAdmins WHERE Email = ${userEmail}`;
      if (result.recordset.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // If no new image uploaded, retain the old one
      if (!profileImage) {
        profileImage = result.recordset[0].ProfileImage;
      }

      // Update user details
      await sql.query`
        UPDATE ShopAdmins
        SET Name = ${name || result.recordset[0].Name},
            Phone = ${phone || result.recordset[0].Phone},
            Address = ${address || result.recordset[0].Address},
            DateOfBirth = ${dob || result.recordset[0].DateOfBirth},
            ProfileImage = ${profileImage}
        WHERE Email = ${userEmail}
      `;

      res.json({ message: 'Profile updated successfully', profileImage });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
