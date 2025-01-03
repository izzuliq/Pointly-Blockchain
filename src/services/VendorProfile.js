import express from 'express';
import { sql } from './db.js'; // Adjust the import path as needed
import { verifyToken } from './middleware/auth.js'; // A middleware for verifying JWT

const router = express.Router();

// Middleware to protect routes (ensure the user is authenticated)
router.use(verifyToken);

// Get Vendor Admin and Company Profile Data
router.get('/admin', async (req, res) => {
  try {
    const email = req.user.email; // Get the email from the JWT token payload (verified)

    // Query the database to get the vendor's admin profile information
    const adminQuery = await sql.query`
      SELECT Name, Email, Phone, ProfilePicture
      FROM ShopAdmins
      WHERE Email = ${email}
    `;
    if (adminQuery.recordset.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    const adminData = adminQuery.recordset[0];

    // Query the database to get the vendor's company profile information
    const companyQuery = await sql.query`
      SELECT CompanyName, CompanyAddress, CompanyIndustry, CompanyLogo
      FROM Companies
      WHERE AdminEmail = ${email}
    `;
    if (companyQuery.recordset.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    const companyData = companyQuery.recordset[0];

    // Respond with both the admin and company data
    res.status(200).json({
      name: adminData.Name,
      email: adminData.Email,
      phone: adminData.Phone,
      profilePicture: adminData.ProfilePicture || 'default-profile.png', // Fallback to default if not available
      companyName: companyData.CompanyName,
      companyAddress: companyData.CompanyAddress,
      companyIndustry: companyData.CompanyIndustry,
      companyLogo: companyData.CompanyLogo || 'default-company-logo.png', // Fallback to default logo
    });
  } catch (error) {
    console.error('Error fetching vendor data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
