import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';  // Import CORS
import { connectDB } from './db.js';  // Ensure this is correctly imported
import signUpRoute from './SignUp.js';  // Import the signup route
import logInRoute from './Login.js';  // Import the signup route

const app = express();
const port = 5000;

// Use CORS middleware to allow requests from your frontend
app.use(cors({
  origin: 'http://localhost:5173',  // Allow frontend to access the backend
  methods: ['GET', 'POST'],        // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow specific headers
}));

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Variable to track if the DB connection is successful
let dbConnected = false;

// Connect to the database
connectDB()
  .then(() => {
    dbConnected = true;
  })
  .catch((err) => {
    dbConnected = false;
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

// Use the signUp route from signup.js
app.use('/api/signup', signUpRoute);

// Define other routes as necessary (e.g., for login)
app.post('/api/login', logInRoute);

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
