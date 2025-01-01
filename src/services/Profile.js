const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  user: "your_username",
  password: "your_password",
  server: "your_server_address",
  database: "MultiShopSystem",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// 1. Get User Profile
app.get("/profile", async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input("userId", sql.Int, userId)
      .query(
        `SELECT Name, Email, Phone, Address, DateOfBirth FROM Users WHERE Id = @userId`
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

// 2. Update User Profile
app.put("/profile", async (req, res) => {
  const { userId, name, email, phone, address, dob } = req.body;

  if (!userId || !name || !email || !phone || !address || !dob) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("userId", sql.Int, userId)
      .input("name", sql.NVarChar, name)
      .input("email", sql.NVarChar, email)
      .input("phone", sql.NVarChar, phone)
      .input("address", sql.NVarChar, address)
      .input("dob", sql.Date, dob)
      .query(
        `UPDATE Users SET Name = @name, Email = @email, Phone = @phone, Address = @address, DateOfBirth = @dob WHERE Id = @userId`
      );

    res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
