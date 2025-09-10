
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Signup controller for student and faculty
export const signup = async (req, res) => {
  const {
    user_type,
    name,
    email,
    password,
    phone_no,
    address,
    course_id,
    semester_id,
    dep_id,
    designation,
    salary,
    DOB,
  } = req.body;
  if (!user_type || !name || !email || !password) {
    return res
      .status(400)
      .json({ message: "user_type, name, email, and password required" });
  }
  try {
    let userId;
    if (user_type === "student") {
      // Insert into Student table
      const [studentResult] = await pool.query(
        "INSERT INTO Student (name, DOB, phone_no, email, address, course_id, semester_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          name,
          DOB || null,
          phone_no || null,
          email,
          address || null,
          course_id || null,
          semester_id || null,
        ]
      );
      userId = studentResult.insertId;
      // Insert into AuthenticatePersons
      await pool.query(
        "INSERT INTO AuthenticatePersons (password, user_type, student_id, faculty_id) VALUES (?, 'student', ?, NULL)",
        [password, userId]
      );
    } else if (user_type === "faculty") {
      // Insert into Faculty table
      const [facultyResult] = await pool.query(
        "INSERT INTO Faculty (name, email, phone_no, salary, designation, dep_id) VALUES (?, ?, ?, ?, ?, ?)",
        [
          name,
          email,
          phone_no || null,
          salary || null,
          designation || null,
          dep_id || null,
        ]
      );
      userId = facultyResult.insertId;
      // Insert into AuthenticatePersons
      await pool.query(
        "INSERT INTO AuthenticatePersons (password, user_type, student_id, faculty_id) VALUES (?, 'faculty', NULL, ?)",
        [password, userId]
      );
    } else {
      return res.status(400).json({ message: "Invalid user_type" });
    }
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(409).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ message: "Server error in signUp controller" });
    }
  }
};

export const login = async (req, res) => {
  const { user_type, email, password } = req.body;
  if (!user_type || !email || !password) {
    return res
      .status(400)
      .json({ message: "user_type, email, and password required" });
  }
  try {
    // Find the user in AuthenticatePersons
    let query =
      "SELECT * FROM AuthenticatePersons WHERE user_type = ? AND password = ? ";
    let [authRows] = await pool.query(query, [user_type, password]);
    if (authRows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const authUser = authRows[0];
    let userInfo = {};
    if (user_type === "student") {
      // Get student info by email
      const [studentRows] = await pool.query(
        "SELECT * FROM Student WHERE student_id = ? AND email = ?",
        [authUser.student_id, email]
      );
      if (studentRows.length === 0)
        return res.status(401).json({ message: "Invalid credentials" });
      userInfo = studentRows[0];
    } else if (user_type === "faculty") {
      // Get faculty info by email
      const [facultyRows] = await pool.query(
        "SELECT * FROM Faculty WHERE faculty_id = ? AND email = ?",
        [authUser.faculty_id, email]
      );
      if (facultyRows.length === 0)
        return res.status(401).json({ message: "Invalid credentials" });
      userInfo = facultyRows[0];
    } else if (user_type === "admin") {
      // For admin, just return authUser
      userInfo = { name: "Admin", email: null };
    }
    const token = jwt.sign(
      {
        id: authUser.auth_id,
        user_type,
        name: userInfo.name,
        student_id: authUser.student_id,
        faculty_id: authUser.faculty_id,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      token,
      user_type,
      name: userInfo.name,
      student_id: authUser.student_id,
      faculty_id: authUser.faculty_id,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get personal info controller
export const getPersonalInfo = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    let userInfo = {};
    if (decoded.user_type === "student") {
      const [rows] = await pool.query(
        "SELECT * FROM Student WHERE student_id = ?",
        [decoded.student_id]
      );
      if (rows.length === 0)
        return res.status(404).json({ message: "Student not found" });
      userInfo = rows[0];
    } else if (decoded.user_type === "faculty") {
      const [rows] = await pool.query(
        "SELECT * FROM Faculty WHERE faculty_id = ?",
        [decoded.faculty_id]
      );
      if (rows.length === 0)
        return res.status(404).json({ message: "Faculty not found" });
      userInfo = rows[0];
    } else if (decoded.user_type === "admin") {
      userInfo = { name: "Admin", email: null };
    } else {
      return res.status(400).json({ message: "Invalid user_type" });
    }
    res.json(userInfo);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
