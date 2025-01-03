import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';  // Import cors
import { connectDB } from './db.js';
import { signUp, login } from './SignUp.js';

const app = express();
const port = 5000;

// Use CORS middleware to allow requests from your frontend
app.use(cors({
  origin: 'http://localhost:5173',  // Allow frontend to access the backend
  methods: ['GET', 'POST', 'OPTIONS'], // Allow specific methods, including OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  preflightContinue: false,  // Do not pass control to the next middleware after preflight response
  optionsSuccessStatus: 204, // Send 204 status for successful OPTIONS requests
}));

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Variable to track if the DB connection is successful
let dbConnected = false;

// Connect to the database
connectDB()
  .then(() => {
    dbConnected = true;  // Set the flag to true once DB connection is successful
  })
  .catch((err) => {
    dbConnected = false;  // Set the flag to false if there was an error
    console.error('Error connecting to the database:', err);
  });

// Define the root route with a status message
app.get('/', (req, res) => {
  const statusMessage = dbConnected 
    ? 'Database connection is good. Welcome to the Backend API!' 
    : 'Database connection failed. Please check the connection settings.';

  res.send(`
    <h1>${statusMessage}</h1>
    <p>All systems are operational. You can now access the API endpoints.</p>
  `);
});

// Define other routes
app.post('/api/signup', signUp);
app.post('/api/login', login);

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Handle preflight OPTIONS requests
app.options('*', cors());  // Allow preflight requests for all routes

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
