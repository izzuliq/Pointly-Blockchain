import express from 'express';
import bodyParser from 'body-parser';
import { connectDB } from './db.js';
import { signUp, login } from './SignUp.js';

const app = express();
const port = 5000; // or any port you want to use

app.use(bodyParser.json()); // to parse JSON requests

// Connect to the database
connectDB();

// Routes
app.post('/api/signup', signUp);
app.post('/api/login', login);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
