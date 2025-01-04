import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB } from './db.js'; // Ensure this is correctly imported
import signUpRoute from './SignUp.js'; // Import the signup route
import logInRoute from './Login.js'; // Import the login route

// Create your express app
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

// Use the logIn route from login.js
app.use('/api/login', logInRoute);

// New routes for the dashboard
// Route to get user profile
app.get('/api/user/profile', (req, res) => {
  // Fetch user profile from DB (replace with actual DB query)
  const userProfile = {
    name: 'John Doe',
    avatarUrl: 'https://example.com/avatar.jpg',
    tier: 'Gold', // Example, retrieve from DB
  };
  res.json(userProfile);
});

// Route to get user points
app.get('/api/user/points', (req, res) => {
  // Fetch user points (replace with actual DB query)
  const points = {
    total: 1500, // Example, retrieve from DB
    available: 1200,
  };
  res.json(points);
});

// Route to get user activities
app.get('/api/user/activities', (req, res) => {
  // Fetch recent user activities (replace with actual DB query)
  const activities = [
    { description: 'Completed a quiz', timeAgo: '2 hours ago' },
    { description: 'Redeemed a reward', timeAgo: '1 day ago' },
    { description: 'Joined a new challenge', timeAgo: '3 days ago' },
  ];
  res.json(activities);
});

// Route to get user progress
app.get('/api/user/progress', (req, res) => {
  // Fetch user progress (replace with actual DB query)
  const progress = {
    percentage: 75, // Example, retrieve from DB
  };
  res.json(progress);
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
