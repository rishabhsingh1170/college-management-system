// Get all courses and subjects a faculty member teaches
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js"; // Your database connection pool
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

//faculty get subjects they can teach
export const getFacultyCourses = async (req, res) => {
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

     if (decoded.user_type !== "faculty") {
       return res
         .status(403)
         .json({ message: "Access denied. Faculty role required." });
     }

     const facultyId = decoded.faculty_id;

     // Corrected SQL query to get a flat list of subjects only
     const query = `
      SELECT DISTINCT
        sub.subject_id,
        sub.subject_name
      FROM FacultySubjects fs
      JOIN Subjects sub ON fs.subject_id = sub.subject_id
      WHERE fs.faculty_id = ?
      ORDER BY sub.subject_name;
    `;
     const [rows] = await pool.query(query, [facultyId]);

     if (rows.length === 0) {
       return res
         .status(404)
         .json({ message: "No subjects found for this faculty member." });
     }

     res.json(rows);
   } catch (err) {
     console.error("Server error:", err);
     res.status(500).json({ message: "Server error" });
   }
};

// Get detailed teaching data: courses, semesters, subjects, and students

export const getFacultyTeachingData = async (req, res) => {
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

    if (decoded.user_type !== "faculty") {
      return res
        .status(403)
        .json({ message: "Access denied. Faculty role required." });
    }

    const facultyId = decoded.faculty_id;

    // Query 1: Get all courses, semesters, and subjects taught by this faculty member
    const teachingQuery = `
      SELECT DISTINCT
        c.course_id,
        c.course_name,
        s.semester_id,
        s.semester_no,
        sub.subject_id,
        sub.subject_name
      FROM FacultySubjects fs
      JOIN Subjects sub ON fs.subject_id = sub.subject_id
      JOIN Courses c ON sub.course_id = c.course_id
      JOIN Semester s ON sub.semester_id = s.semester_id
      WHERE fs.faculty_id = ?
      ORDER BY c.course_name, s.semester_no, sub.subject_name;
    `;
    const [teachingRows] = await pool.query(teachingQuery, [facultyId]);

    if (teachingRows.length === 0) {
      return res.status(404).json({ message: "No teaching data found." });
    }

    // --- Data Transformation: Group subjects by course and semester ---
    const courses = {};
    for (const row of teachingRows) {
      if (!courses[row.course_id]) {
        courses[row.course_id] = {
          course_id: row.course_id,
          course_name: row.course_name,
          semesters: {},
        };
      }
      const course = courses[row.course_id];

      if (!course.semesters[row.semester_no]) {
        course.semesters[row.semester_no] = {
          semester_no: row.semester_no,
          subjects: {},
        };
      }
      const semester = course.semesters[row.semester_no];

      if (!semester.subjects[row.subject_id]) {
        semester.subjects[row.subject_id] = {
          subject_id: row.subject_id,
          subject_name: row.subject_name,
          students: [],
        };
      }
    }

    // Query 2: Get all students for the courses and semesters found above
    const allStudentsQuery = `
        SELECT student_id, name, course_id, semester_id FROM Student
        WHERE course_id IN (
            SELECT DISTINCT c.course_id
            FROM FacultySubjects fs
            JOIN Subjects sub ON fs.subject_id = sub.subject_id
            JOIN Courses c ON sub.course_id = c.course_id
            WHERE fs.faculty_id = ?
        ) AND semester_id IN (
            SELECT DISTINCT s.semester_id
            FROM FacultySubjects fs
            JOIN Subjects sub ON fs.subject_id = sub.subject_id
            JOIN Semester s ON sub.semester_id = s.semester_id
            WHERE fs.faculty_id = ?
        );
    `;
    const [studentRows] = await pool.query(allStudentsQuery, [
      facultyId,
      facultyId,
    ]);

    // Final Data Transformation: Map students to their subjects
    for (const student of studentRows) {
      const courseId = student.course_id;
      const semesterNo = student.semester_id;

      const course = courses[courseId];
      if (course) {
        const semester = Object.values(course.semesters).find(
          (s) => s.semester_no === semesterNo
        );
        if (semester) {
          for (const subject of Object.values(semester.subjects)) {
            subject.students.push({
              student_id: student.student_id,
              name: student.name,
            });
          }
        }
      }
    }

    const result = Object.values(courses).map((course) => ({
      ...course,
      semesters: Object.values(course.semesters).map((sem) => ({
        ...sem,
        subjects: Object.values(sem.subjects),
      })),
    }));

    res.json(result);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
