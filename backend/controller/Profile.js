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

export const getFacultyProfile = async (req, res) => {
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

    // Security check: Ensure the user is a faculty member
    if (decoded.user_type !== "faculty" && decoded.user_type !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Faculty role required." });
    }

    const facultyId = decoded.faculty_id;

    const query = `
      SELECT
        f.faculty_id AS id,
        f.name,
        f.email,
        f.phone_no AS phone,
        f.DOB AS dateOfBirth,
        f.designation AS position,
        f.specialization,
        d.name AS department,
        f.joining_date AS joiningDate
      FROM Faculty f
      JOIN Department d ON f.dep_id = d.dep_id
      WHERE f.faculty_id = ?;
    `;
    const [rows] = await pool.query(query, [facultyId]);
    console.log(facultyId);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Faculty profile not found" });
    }

    const facultyInfo = rows[0];
    res.json(facultyInfo);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


//for admin
export const getFacultyList = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user_type !== "admin") return res.status(403).json({ message: "Access denied. Admin role required." });

    const query = `
      SELECT
        f.faculty_id,
        f.name,
        f.email,
        f.designation,
        d.name AS department_name
      FROM Faculty f
      JOIN Department d ON f.dep_id = d.dep_id
      ORDER BY f.name;
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//for admin

export const getFacultyBasicDetails = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user_type !== "admin") return res.status(403).json({ message: "Access denied. Admin role required." });

    const { facultyId } = req.params;
    
    const query = `
      SELECT
        f.faculty_id, f.name, f.email, f.designation, d.name AS department_name
      FROM Faculty f
      LEFT JOIN Department d ON f.dep_id = d.dep_id
      WHERE f.faculty_id = ?;
    `;
    const [rows] = await pool.query(query, [facultyId]);
    
    if (rows.length === 0) return res.status(404).json({ message: "Faculty not found." });
    
    res.json(rows[0]);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFacultyDetailsForAdmin = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user_type !== "admin") return res.status(403).json({ message: "Access denied. Admin role required." });

    const { facultyId } = req.params;

    const facultyQuery = `
      SELECT f.faculty_id, f.name, f.email, f.phone_no, f.DOB, f.designation, f.specialization, f.dep_id, f.joining_date, f.salary
      FROM Faculty f
      WHERE f.faculty_id = ?;
    `;
    const [facultyRows] = await pool.query(facultyQuery, [facultyId]);
    if (facultyRows.length === 0) return res.status(404).json({ message: "Faculty not found." });

    const departmentsQuery = `SELECT dep_id, name FROM Department;`;
    const [departments] = await pool.query(departmentsQuery);

    res.json({ faculty: facultyRows[0], departments });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateFacultyDetails = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user_type !== "admin") return res.status(403).json({ message: "Access denied. Admin role required." });

    const { facultyId } = req.params;
    const { name, email, phone_no, DOB, designation, specialization, dep_id, joining_date, salary } = req.body;

    const updateQuery = `
      UPDATE Faculty
      SET name = ?, email = ?, phone_no = ?, DOB = ?, designation = ?, specialization = ?, dep_id = ?, joining_date = ?, salary = ?
      WHERE faculty_id = ?;
    `;
    await pool.query(updateQuery, [name, email, phone_no, DOB, designation, specialization, dep_id, joining_date, salary, facultyId]);

    res.json({ message: "Faculty details updated successfully." });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get basic details for a specific student for admin

export const getStudentBasicDetails = async (req, res) => {
   try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user_type !== "admin") return res.status(403).json({ message: "Access denied. Admin role required." });

    const { studentId } = req.params;
    
    // Corrected query with LEFT JOINs
    const query = `
      SELECT
        s.student_id, s.name, s.email, s.phone_no,
        c.course_name, d.name AS department_name
      FROM Student s
      LEFT JOIN Courses c ON s.course_id = c.course_id
      LEFT JOIN Department d ON c.dep_id = d.dep_id
      WHERE s.student_id = ?;
    `;
    const [rows] = await pool.query(query, [studentId]);
    
    if (rows.length === 0) return res.status(404).json({ message: "Student not found." });
    
    res.json(rows[0]);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//only for admin
export const getStudentsWithPendingFees = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user_type !== "admin") return res.status(403).json({ message: "Access denied. Admin role required." });

    const query = `
      SELECT
          s.student_id,
          s.name,
          s.email,
          d.name AS department_name,
          SUM(f.amount - f.paid_amount) AS total_due
      FROM Student s
      JOIN Fees f ON s.student_id = f.student_id
      JOIN Courses c ON s.course_id = c.course_id
      JOIN Department d ON c.dep_id = d.dep_id
      WHERE f.status = 'Due'
      GROUP BY s.student_id
      ORDER BY s.name;
    `;
    const [rows] = await pool.query(query);

    res.json(rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentDetailsForAdmin = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user_type !== "admin") return res.status(403).json({ message: "Access denied. Admin role required." });

    const { studentId } = req.params;

    // Query 1: Get student's personal details with LEFT JOINs
    const studentQuery = `
      SELECT s.student_id, s.name, s.email, s.phone_no, s.address, s.DOB, s.course_id, s.semester_id,
             c.course_name AS course, d.name AS department
      FROM Student s
      LEFT JOIN Courses c ON s.course_id = c.course_id
      LEFT JOIN Department d ON c.dep_id = d.dep_id
      WHERE s.student_id = ?;
    `;
    const [studentRows] = await pool.query(studentQuery, [studentId]);
    if (studentRows.length === 0) return res.status(404).json({ message: "Student not found." });

    // Query 2: Get student's fee history
    const feesQuery = `
      SELECT f.fee_id, s.semester_no, f.paid_amount, f.due_date, f.status, f.amount
      FROM Fees f
      LEFT JOIN Semester s ON f.sem_id = s.semester_id
      WHERE f.student_id = ?
      ORDER BY f.due_date DESC;
    `;
    const [feesRows] = await pool.query(feesQuery, [studentId]);
    const feeHistory = feesRows.map(row => ({
      ...row,
      paid_amount: parseFloat(row.paid_amount),
      amount: parseFloat(row.amount),
    }));

    // Query 3: Get all courses and semesters for dropdowns
    const coursesQuery = `SELECT course_id, course_name FROM Courses;`;
    const [courses] = await pool.query(coursesQuery);
    const semestersQuery = `SELECT semester_id, semester_no FROM Semester;`;
    const [semesters] = await pool.query(semestersQuery);
    
    res.json({ student: studentRows[0], fees: feeHistory, courses, semesters });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateStudentDetails = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user_type !== "admin") return res.status(403).json({ message: "Access denied. Admin role required." });

    const { studentId } = req.params;
    const { name, email, phone_no, address, DOB, course_id, semester_id } = req.body;

    const updateQuery = `
      UPDATE Student
      SET name = ?, email = ?, phone_no = ?, address = ?, DOB = ?, course_id = ?, semester_id = ?
      WHERE student_id = ?;
    `;
    await pool.query(updateQuery, [name, email, phone_no, address, DOB, course_id, semester_id, studentId]);

    res.json({ message: "Student details updated successfully." });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};