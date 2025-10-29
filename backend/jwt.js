// backend/jwt.js
const jwt = require("jsonwebtoken");

// Middleware to verify JWT
const jwtAuthMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token not found or invalid format" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Function to generate JWT
const generateToken = (userData) => {
  // Expiry time = 1 hour
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "1day" });
};

module.exports = { jwtAuthMiddleware, generateToken };
