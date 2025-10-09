// Submit a support ticket
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js"; // Your database connection pool
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const submitSupportTicket = async (req, res) => {
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

    // Only students can submit a ticket in this example
    if (decoded.user_type !== "student") {
      return res
        .status(403)
        .json({ message: "Access denied. Only students can submit tickets." });
    }

    const { issue } = req.body;
    const studentId = decoded.student_id;

    const query = `
      INSERT INTO StudentSupport (student_id, status, issue)
      VALUES (?, ?, ?);
    `;
    const status = "Pending";
    await pool.query(query, [studentId, status, issue]);

    res.status(201).json({ message: "Support ticket submitted successfully." });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all support tickets for the logged-in student
export const getStudentSupportTickets = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user_type !== "student") {
      return res.status(403).json({ message: "Access denied. Student role required." });
    }

    const studentId = decoded.student_id;

    const query = `
      SELECT support_id, issue, status, created_at, resolved_at
      FROM StudentSupport
      WHERE student_id = ?
      ORDER BY created_at DESC;
    `;
    const [rows] = await pool.query(query, [studentId]);

    res.json(rows);

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//admin
export const getSupportTickets = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user_type !== "admin") return res.status(403).json({ message: "Access denied. Admin role required." });

    const query = `
      SELECT
        ss.support_id,
        ss.issue,
        ss.status,
        ss.created_at,
        s.name AS student_name,
        s.student_id
      FROM StudentSupport ss
      JOIN Student s ON ss.student_id = s.student_id
      ORDER BY ss.created_at DESC;
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//for admin
export const updateSupportTicketStatus = async (req, res) => {

  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user_type !== "admin") return res.status(403).json({ message: "Access denied. Admin role required." });

    const { supportId } = req.params;
    const { newStatus } = req.body;

  console.log(supportId)

    const query = `
      UPDATE StudentSupport
      SET status = ?
      WHERE support_id = ?;
    `;
    await pool.query(query, [newStatus, supportId]);

    res.json({ message: "Support ticket status updated successfully." });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
