import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cms",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Basic route
app.get("/", (req, res) => {
  res.send("College Management System Backend");
});

import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Login route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = rows[0];
    // NOTE: For demo, plain text password. Use bcrypt in production.
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Student routes
app.get("/api/student/marks", authenticateToken, async (req, res) => {
  if (req.user.role !== "student") return res.sendStatus(403);
  try {
    const [rows] = await pool.query(
      "SELECT * FROM marks WHERE student_id = ?",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/student/attendance", authenticateToken, async (req, res) => {
  if (req.user.role !== "student") return res.sendStatus(403);
  try {
    const [rows] = await pool.query(
      "SELECT * FROM attendance WHERE student_id = ?",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/student/notices", authenticateToken, async (req, res) => {
  if (req.user.role !== "student") return res.sendStatus(403);
  try {
    const [rows] = await pool.query(
      "SELECT * FROM notices ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/student/exam-timetable", authenticateToken, async (req, res) => {
  if (req.user.role !== "student") return res.sendStatus(403);
  try {
    const [rows] = await pool.query(
      "SELECT * FROM exam_timetable ORDER BY date"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/student/fees", authenticateToken, async (req, res) => {
  if (req.user.role !== "student") return res.sendStatus(403);
  try {
    const [rows] = await pool.query("SELECT * FROM fees WHERE student_id = ?", [
      req.user.id,
    ]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Faculty routes
app.post("/api/faculty/marks", authenticateToken, async (req, res) => {
  if (req.user.role !== "faculty") return res.sendStatus(403);
  const { student_id, subject, marks, exam } = req.body;
  if (!student_id || !subject || marks == null || !exam) {
    return res.status(400).json({ message: "All fields required" });
  }
  try {
    await pool.query(
      "INSERT INTO marks (student_id, subject, marks, exam) VALUES (?, ?, ?, ?)",
      [student_id, subject, marks, exam]
    );
    res.json({ message: "Marks added" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/faculty/attendance", authenticateToken, async (req, res) => {
  if (req.user.role !== "faculty") return res.sendStatus(403);
  const { student_id, date, status } = req.body;
  if (!student_id || !date || !status) {
    return res.status(400).json({ message: "All fields required" });
  }
  try {
    await pool.query(
      "INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)",
      [student_id, date, status]
    );
    res.json({ message: "Attendance added" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
