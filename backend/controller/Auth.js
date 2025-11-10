import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
import bcrypt from 'bcrypt';

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
      .json({ message: "required fields are missing" });
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
      // Insert into AuthenticatePersons and update Student.auth_id
      const [authResult] = await pool.query(
        "INSERT INTO AuthenticatePersons (password, user_type, student_id, faculty_id) VALUES (?, 'student', ?, NULL)",
        [password, userId]
      );
      const authId = authResult.insertId;
      await pool.query("UPDATE Student SET auth_id = ? WHERE student_id = ?", [
        authId,
        userId,
      ]);
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
      // Insert into AuthenticatePersons and update Faculty.auth_id
      const [authResult] = await pool.query(
        "INSERT INTO AuthenticatePersons (password, user_type, student_id, faculty_id) VALUES (?, 'faculty', NULL, ?)",
        [password, userId]
      );
      const authId = authResult.insertId;
      await pool.query("UPDATE Faculty SET auth_id = ? WHERE faculty_id = ?", [
        authId,
        userId,
      ]);
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
  const { user_type, username, password } = req.body;

  if (!user_type || !username || !password) {
    return res.status(400).json({ message: "required fields are missing" });
  }

  try {
    let authQuery =
      "SELECT * FROM AuthenticatePersons WHERE user_type = ? AND password = ?";
    let [authRows] = await pool.query(authQuery, [user_type, password]);
    if (authRows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const authUser = authRows[0];
    let userInfo = {};

    // Key Change: Combine Faculty and Admin logic
    if (user_type === "student") {
      const [studentRows] = await pool.query(
        "SELECT student_id, name, email FROM Student WHERE auth_id = ? AND (email = ? OR name = ?)",
        [authUser.auth_id, username, username]
      );
      if (studentRows.length === 0)
        return res.status(401).json({ message: "Invalid credentials" });
      userInfo = studentRows[0];
    } else if (user_type === "faculty" || user_type === "admin") {
      // Find faculty/admin by auth_id and username
      const [facultyRows] = await pool.query(
        "SELECT faculty_id, name, email FROM Faculty WHERE auth_id = ? AND (email = ? OR name = ?)",
        [authUser.auth_id, username, username]
      );
      if (facultyRows.length === 0)
        return res.status(401).json({ message: "Invalid credentials" });
      userInfo = facultyRows[0];
    } else {
      return res.status(400).json({ message: "Invalid user_type" });
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
      student_id: userInfo.student_id,
      faculty_id: userInfo.faculty_id,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//can't be used beacuse some passwords are store in plane text

// export const login = async (req, res) => {
//   const { user_type, username, password } = req.body;

//   if (!user_type || !username || !password) {
//     return res.status(400).json({ message: "Required fields are missing" });
//   }

//   try {
//     // Corrected logic: Use a single query to find the user in the appropriate table
//     let userQuery = '';
//     let userTable = '';

//     if (user_type === "student") {
//         userTable = 'Student';
//         userQuery = "SELECT auth_id, student_id AS user_specific_id, name FROM Student WHERE email = ? OR name = ?";
//     } else if (user_type === "faculty" || user_type === "admin") {
//         userTable = 'Faculty';
//         userQuery = "SELECT auth_id, faculty_id AS user_specific_id, name FROM Faculty WHERE email = ? OR name = ?";
//     } else {
//         return res.status(400).json({ message: "Invalid user_type" });
//     }

//     const [userRows] = await pool.query(userQuery, [username, username]);
//     if (userRows.length === 0) {
//         return res.status(401).json({ message: "Invalid credentials" });
//     }
//     const userInfo = userRows[0];

//     // Corrected logic: Fetch the hashed password from the AuthenticatePersons table
//     const [authRows] = await pool.query(
//         "SELECT password FROM AuthenticatePersons WHERE auth_id = ?",
//         [userInfo.auth_id]
//     );
//     if (authRows.length === 0) {
//         return res.status(401).json({ message: "Invalid credentials" });
//     }
//     const storedHashedPassword = authRows[0].password;

//     // Securely compare the password using bcrypt
//     const isPasswordCorrect = await bcrypt.compare(password, storedHashedPassword);
//     if (!isPasswordCorrect) {
//         return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // Prepare a clean JWT payload
//     const tokenPayload = {
//       user_type: user_type,
//       auth_id: userInfo.auth_id,
//       name: userInfo.name
//     };
//     if (user_type === 'student') {
//         tokenPayload.student_id = userInfo.user_specific_id;
//     } else {
//         tokenPayload.faculty_id = userInfo.user_specific_id;
//     }

//     const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1d" });

//     res.json({
//       token,
//       user_type: tokenPayload.user_type,
//       name: tokenPayload.name,
//       student_id: tokenPayload.student_id,
//       faculty_id: tokenPayload.faculty_id,
//     });

//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };