// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Invalid token:", err);
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.log("Authenticated user:", user); // Log user details
    req.user = user;
    next();
  });
};
