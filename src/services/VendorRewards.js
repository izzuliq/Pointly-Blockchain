import express from 'express';
import { sql } from './db.js'; // Adjust the import path for your database connection
import bodyParser from 'body-parser';
import { toast } from 'react-toastify'; // Optional: for error handling if needed

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json()); // Parse JSON data from requests

// Fetch all rewards
app.get('/api/rewards', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Rewards`;
    res.status(200).json(result.recordset); // Send rewards as response
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ message: 'Error fetching rewards' });
  }
});

// Create a new reward
app.post('/api/rewards', async (req, res) => {
  const { name, description, cost, img } = req.body;

  if (!name || !description || !cost || !img) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const result = await sql.query`
      INSERT INTO Rewards (name, description, cost, img)
      VALUES (${name}, ${description}, ${cost}, ${img})
    `;
    res.status(201).json({ message: 'Reward created successfully' });
  } catch (error) {
    console.error('Error creating reward:', error);
    res.status(500).json({ message: 'Error creating reward' });
  }
});

// Edit a reward
app.put('/api/rewards/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, cost, img } = req.body;

  if (!name || !description || !cost || !img) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const result = await sql.query`
      UPDATE Rewards
      SET name = ${name}, description = ${description}, cost = ${cost}, img = ${img}
      WHERE id = ${id}
    `;
    res.status(200).json({ message: 'Reward updated successfully' });
  } catch (error) {
    console.error('Error updating reward:', error);
    res.status(500).json({ message: 'Error updating reward' });
  }
});

// Delete a reward
app.delete('/api/rewards/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql.query`
      DELETE FROM Rewards WHERE id = ${id}
    `;
    res.status(200).json({ message: 'Reward deleted successfully' });
  } catch (error) {
    console.error('Error deleting reward:', error);
    res.status(500).json({ message: 'Error deleting reward' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
