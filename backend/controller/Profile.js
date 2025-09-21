//student personal details
// Get a specific student's profile info
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js'; // Your database connection pool
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const getStudentProfile = async (req, res) => {
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

    if (decoded.user_type !== "student") {
      return res
        .status(403)
        .json({ message: "Access denied. Student role required." });
    }

    const studentId = decoded.student_id;

    // Corrected SQL query
    const query = `
      SELECT
        s.student_id AS id,
        s.name,
        s.email,
        s.phone_no AS phone,
        s.DOB AS dateOfBirth,
        d.name AS department,  -- Getting department name from the Department table
        c.course_name AS course -- Getting course name from the Courses table
      FROM Student s
      JOIN Courses c ON s.course_id = c.course_id  -- First join Student to Courses
      JOIN Department d ON c.dep_id = d.dep_id      -- Then join Courses to Department
      WHERE s.student_id = ?;
    `;
    const [rows] = await pool.query(query, [studentId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    const studentInfo = rows[0];
    res.json(studentInfo);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};