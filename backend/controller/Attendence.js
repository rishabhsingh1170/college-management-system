import jwt from "jsonwebtoken";
import { pool } from "../config/database.js"; // Your database connection pool
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET

// Get attendance of all students for a subject and date
export const getAttendanceOfAllStudent = async (req, res) => {
  if (req.user.user_type !== "faculty") return res.sendStatus(403);
  const { subject_id } = req.query;
  if (!subject_id) {
    return res.status(400).json({ message: "subject_id is required" });
  }
  try {
    // Get total classes (distinct dates) for the subject
    const [totalClassRows] = await pool.query(
      "SELECT COUNT(DISTINCT date) as total_classes FROM Attendance WHERE subject_id = ?",
      [subject_id]
    );
    const total_classes = totalClassRows[0]?.total_classes || 0;

    // Get attendance summary for each student
    const [rows] = await pool.query(
      `SELECT student_id, 
        SUM(status = 'Present') as attended_classes, 
        COUNT(*) as total_records
      FROM Attendance 
      WHERE subject_id = ?
      GROUP BY student_id`,
      [subject_id]
    );

    // Format result: student_id, attended_classes, total_classes
    const result = rows.map((r) => ({
      student_id: r.student_id,
      attended_classes: r.attended_classes,
      total_classes: total_classes,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//get attendence of a student;
export const getStudentAttendance = async (req, res) => {
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

    // SQL query to get raw attendance counts per subject and semester
    const query = `
      SELECT
        s.semester_no,
        sub.subject_name,
        SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_count,
        SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) AS absent_count,
        COUNT(a.status) AS total_classes
      FROM Attendance a
      JOIN Subjects sub ON a.subject_id = sub.subject_id
      JOIN Semester s ON sub.semester_id = s.semester_id
      WHERE a.student_id = ?
      GROUP BY s.semester_no, sub.subject_name
      ORDER BY s.semester_no, sub.subject_name;
    `;
    const [rows] = await pool.query(query, [studentId]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance records found for this student." });
    }

    // --- Data Transformation: Convert flat SQL result into nested JSON structure ---
    const semesters = {};
    rows.forEach((row) => {
      const semesterKey = `Semester ${row.semester_no}`;
      if (!semesters[semesterKey]) {
        semesters[semesterKey] = {
          semester: semesterKey,
          subjects: [],
        };
      }

      const totalClasses = row.total_classes;
      const percentage =
        totalClasses > 0
          ? ((row.present_count / totalClasses) * 100).toFixed(2)
          : 0;

      semesters[semesterKey].subjects.push({
        subject_name: row.subject_name,
        present_count: row.present_count,
        absent_count: row.absent_count,
        total_classes: totalClasses,
        percentage: parseFloat(percentage),
      });
    });

    const result = Object.values(semesters);
    res.json(result);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//set attendence of a student
export const updateAttendance = async (req, res) => {
  if (req.user.user_type !== "faculty") return res.sendStatus(403);
  const { subject_id, date, presentStudentIds, allStudentIds } = req.body;
  if (
    !subject_id ||
    !date ||
    !Array.isArray(presentStudentIds) ||
    !Array.isArray(allStudentIds)
  ) {
    return res.status(400).json({
      message:
        "subject_id, date, presentStudentIds, and allStudentIds are required",
    });
  }
  try {
    // Mark present students
    for (const student_id of presentStudentIds) {
      await pool.query(
        "INSERT INTO Attendance (student_id, subject_id, date, status) VALUES (?, ?, ?, 'Present')",
        [student_id, subject_id, date]
      );
    }
    // Mark absent students (those not in presentStudentIds)
    const absentStudentIds = allStudentIds.filter(
      (id) => !presentStudentIds.includes(id)
    );
    for (const student_id of absentStudentIds) {
      await pool.query(
        "INSERT INTO Attendance (student_id, subject_id, date, status) VALUES (?, ?, ?, 'Absent')",
        [student_id, subject_id, date]
      );
    }
    res.json({ message: "Attendance updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
