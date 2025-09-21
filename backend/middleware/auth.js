// Authentication middleware
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Use optional chaining for safety

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication failed: No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Token is invalid or expired
      return res
        .status(403)
        .json({ message: "Authentication failed: Invalid token" });
    }

    // Attach the decoded user payload to the request object
    req.user = user;
    next();
  });
};
