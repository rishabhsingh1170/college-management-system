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

    if (userType === "admin") {
      // Admin sees notifications for students and faculty separately
      const [studentNotifications] = await pool.query(`
        SELECT * FROM Notifications
        WHERE user_type = 'student'
        ORDER BY created_at DESC;
      `);

      const [facultyNotifications] = await pool.query(`
        SELECT * FROM Notifications
        WHERE user_type = 'faculty'
        ORDER BY created_at DESC;
      `);

      return res.json({
        studentNotifications: studentNotifications,
        facultyNotifications: facultyNotifications,
      });
    } else if (userType === "student" || userType === "faculty") {
      // Original logic for student and faculty
      const userId =
        userType === "student" ? decoded.student_id : decoded.faculty_id;
      const [rows] = await pool.query(
        `
        SELECT * FROM Notifications
        WHERE user_type = ? AND (recipient_id = ? OR recipient_id IS NULL)
        ORDER BY created_at DESC;
      `,
        [userType, userId]
      );

      return res.json(rows);
    } else {
      return res
        .status(403)
        .json({ message: "Access denied for this user type." });
    }
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//post a notification (admin only)
export const publishNotification = async (req, res) => {
  let conn; // Initialize connection outside try-catch
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    let decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.user_type !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });
    }

    const { title, message, user_type } = req.body;
    if (!title || !message || !user_type) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const insertQuery = `
          INSERT INTO Notifications (title, message, user_type)
          VALUES (?, ?, ?);
        `;

    conn = await pool.getConnection();
    await conn.beginTransaction();

    if (user_type === "both") {
      // Handle 'both': insert one record for student and one for faculty
      await conn.query(insertQuery, [title, message, "student"]);
      await conn.query(insertQuery, [title, message, "faculty"]);
    } else {
      // Standard insert for 'student', 'faculty', or 'admin'
      await conn.query(insertQuery, [title, message, user_type]);
    }

    await conn.commit();
    res.status(201).json({ message: "Notification published successfully." });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("Server error:", err);
    res
      .status(500)
      .json({ message: "Server error: Failed to publish notification." });
  } finally {
    if (conn) conn.release();
  }
};

//delete notification
export const deleteNotification = async (req, res) => {
  console.log("delerting notification");
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

    if (decoded.user_type !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin role required." });
    }

    const { notificationId } = req.params;
    if (!notificationId) {
      return res.status(400).json({ message: "Notification ID is required." });
    }

    const query = `
      DELETE FROM Notifications
      WHERE notification_id = ?;
    `;
    const [result] = await pool.query(query, [notificationId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.status(200).json({ message: "Notification deleted successfully." });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
