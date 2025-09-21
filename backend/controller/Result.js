// Get a specific student's results
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";
import env from "dotenv";
env.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const getStudentResults = async (req, res) => {
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

    // Corrected query to select credits from the Subjects table
    const query = `
      SELECT
        s.semester_no,
        sub.subject_name AS course,
        sub.credits,  -- Corrected line: select credits from the Subjects table
        sm.grade,
        sm.marks,
        e.exam_type AS status
      FROM SubjectMarks sm
      JOIN Examination e ON sm.exam_id = e.exam_id
      JOIN Subjects sub ON sm.subject_id = sub.subject_id
      JOIN Semester s ON sub.semester_id = s.semester_id
      WHERE sm.student_id = ?
      ORDER BY s.semester_no, sub.subject_name;
    `;
    const [rows] = await pool.query(query, [studentId]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No results found for this student." });
    }

    const semesters = {};
    const gradeScale = { A: 10, "A-": 9, "B+": 8, B: 7, C: 6, D: 5, F: 0 };

    rows.forEach((row) => {
      const semesterKey = `Semester ${row.semester_no}`;
      if (!semesters[semesterKey]) {
        semesters[semesterKey] = {
          semester: semesterKey,
          summary: {
            sgpa: 0,
            cgpa: 0,
            creditsEarned: 0,
            totalCredits: 0,
            totalPoints: 0,
          },
          courses: [],
        };
      }

      const qualityPoints = (gradeScale[row.grade] || 0) * (row.credits || 0);

      semesters[semesterKey].courses.push({
        course: row.course,
        grade: row.grade,
        status: row.grade === "F" ? "Failed" : "Passed",
        credits: row.credits,
      });

      semesters[semesterKey].summary.creditsEarned += row.credits || 0;
      semesters[semesterKey].summary.totalCredits += row.credits || 0;
      semesters[semesterKey].summary.totalPoints += qualityPoints;
    });

    const result = Object.values(semesters);
    let cumulativeCredits = 0;
    let cumulativePoints = 0;

    result.forEach((sem) => {
      sem.summary.sgpa =
        sem.summary.creditsEarned > 0
          ? (sem.summary.totalPoints / sem.summary.creditsEarned).toFixed(2)
          : 0;

      cumulativeCredits += sem.summary.creditsEarned;
      cumulativePoints += sem.summary.totalPoints;

      sem.summary.cgpa =
        cumulativeCredits > 0
          ? (cumulativePoints / cumulativeCredits).toFixed(2)
          : 0;

      delete sem.summary.totalPoints;
    });

    res.json(result);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};