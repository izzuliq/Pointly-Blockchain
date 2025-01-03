import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { connectDB, sql } from './db.js'; // Replace with your actual database configuration

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads/company-logos');
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

// Endpoint to update company profile
app.put('/api/vendor/company/profile', upload.single('companyLogo'), async (req, res) => {
  try {
    const { companyName, companyAddress, companyIndustry } = req.body;
    const companyLogo = req.file ? `/uploads/company-logos/${req.file.filename}` : null;

    // Validate input
    if (!companyName || !companyAddress || !companyIndustry) {
      return res.status(400).json({ message: 'Company name, address, and industry are required' });
    }

    // Replace with actual vendor ID or logic for determining which company's profile to update
    const vendorId = 1; // Example vendor ID

    // Update query for company profile
    const query = `
      UPDATE Companies
      SET CompanyName = @CompanyName,
          Address = @Address,
          Industry = @Industry,
          Logo = @Logo
      WHERE VendorID = @VendorID
    `;

    const request = new sql.Request();
    request.input('CompanyName', sql.NVarChar, companyName);
    request.input('Address', sql.NVarChar, companyAddress);
    request.input('Industry', sql.NVarChar, companyIndustry);
    request.input('Logo', sql.NVarChar, companyLogo);
    request.input('VendorID', sql.Int, vendorId);

    await request.query(query);

    res.status(200).json({
      message: 'Company profile updated successfully',
      companyLogo,
    });
  } catch (error) {
    console.error('Error updating company profile:', error);
    res.status(500).json({ message: 'Failed to update company profile' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
