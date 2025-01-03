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
    const uploadPath = path.join(__dirname, 'uploads/rewards');
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

// Endpoint to get reward details by ID
app.get('/api/rewards/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT id, name, description, cost, img, expiration, terms
      FROM Rewards
      WHERE id = @id
    `;

    const request = new sql.Request();
    request.input('id', sql.Int, id);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    const reward = result.recordset[0];
    res.status(200).json(reward);
  } catch (error) {
    console.error('Error fetching reward details:', error);
    res.status(500).json({ message: 'Failed to fetch reward details' });
  }
});

// Endpoint to update reward details
app.put('/api/rewards/:id', upload.single('img'), async (req, res) => {
  const { id } = req.params;
  const { name, description, cost, expiration, terms } = req.body;
  const img = req.file ? `/uploads/rewards/${req.file.filename}` : null;

  try {
    // Validate input
    if (!name || !description || !cost || !expiration || !terms) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Update query for reward details
    const query = `
      UPDATE Rewards
      SET name = @name,
          description = @description,
          cost = @cost,
          img = COALESCE(@img, img),
          expiration = @expiration,
          terms = @terms
      WHERE id = @id
    `;

    const request = new sql.Request();
    request.input('name', sql.NVarChar, name);
    request.input('description', sql.NVarChar, description);
    request.input('cost', sql.Int, cost);
    request.input('img', sql.NVarChar, img);
    request.input('expiration', sql.Date, expiration);
    request.input('terms', sql.NVarChar, terms);
    request.input('id', sql.Int, id);

    await request.query(query);

    res.status(200).json({ message: 'Reward updated successfully' });
  } catch (error) {
    console.error('Error updating reward:', error);
    res.status(500).json({ message: 'Failed to update reward' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
