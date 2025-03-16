const jwt = require("jsonwebtoken");
const userService = require("../services/user.service");

const validateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  if (userService.isTokenBlacklisted(token)) {
    return res.status(403).json({ error: "Token has been invalidated. Please log in again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Check if the role (r) is "ADMIN"
    if (decoded.r !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }

    next(); // Proceed to the next middleware/controller
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = validateAdmin;
