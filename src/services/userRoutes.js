import express from 'express';
import authenticateJWT from './middlewares/authenticateJWT.js'; // Assuming the middleware is saved here

const router = express.Router();

// Protected route that requires JWT token for authentication
router.get('/user', authenticateJWT, (req, res) => {
  // Send user information (e.g., role) from the request object
  res.json({
    role: req.user.role, // Assuming the user data contains the role
  });
});

export default router;
