// Get all notifications for the logged-in user (student or faculty)
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js"; // Your database connection pool
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET

export const getNotifications = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userType = decoded.user_type;
    let userId = null;

    if (userType === "student") {
      userId = decoded.student_id;
    } else if (userType === "faculty") {
      userId = decoded.faculty_id;
    } else {
      // Handle admin or other roles if needed
      return res
        .status(403)
        .json({ message: "Access denied for this user type." });
    }

    const query = `
      SELECT * FROM Notifications
      WHERE user_type = ? AND (recipient_id = ? OR recipient_id IS NULL)
      ORDER BY created_at DESC;
    `;
    const [rows] = await pool.query(query, [userType, userId]);

    res.json(rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
