import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization')?.split(' ')[1]; // 'Bearer <token>'

  // If no token is provided, return an error
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided.' });
  }

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }

    // If the token is valid, attach the user data to the request object
    req.user = user;
    next(); // Pass control to the next middleware or route handler
  });
};

export default authenticateJWT;
