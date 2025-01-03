import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer'; // For handling file uploads
import path from 'path';
import fs from 'fs';
import { connectDB, sql } from './db.js'; // Ensure your DB connection is configured

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Database connection
connectDB()
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Database connection failed:', err));

// Update admin profile
app.put('/api/vendor/admin/profile', upload.single('profilePicture'), async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null; // Use the uploaded file path or null

    // Validate input
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone are required' });
    }

    // Update the admin profile in the database
    const adminId = 1; // Replace with the actual admin ID from the logged-in user
    const query = `
      UPDATE Admins
      SET Name = @name, Email = @Email, Phone = @Phone, ProfilePicture = @ProfilePicture
      WHERE AdminID = @AdminID
    `;

    const request = new sql.Request();
    request.input('name', sql.NVarChar, name);
    request.input('email', sql.NVarChar, email);
    request.input('phone', sql.NVarChar, phone);
    request.input('profilePicture', sql.NVarChar, profilePicture);
    request.input('adminId', sql.Int, adminId);

    await request.query(query);

    res.status(200).json({
      message: 'Admin profile updated successfully',
      profilePicture,
    });
  } catch (error) {
    console.error('Error updating admin profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
