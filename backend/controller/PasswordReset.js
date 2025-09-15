import transporter from "../config/mailer.js";
import { pool } from "../config/database.js";
import crypto from "crypto";

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  // Find user by email in Student or Faculty, then get auth_id from AuthenticatePersons
  let studentId = null,
    facultyId = null,
    authId = null;
  let [rows] = await pool.query(
    "SELECT student_id FROM Student WHERE email = ?",
    [email]
  );
  if (rows.length > 0) {
    studentId = rows[0].student_id;
    let [authRows] = await pool.query(
      "SELECT auth_id FROM AuthenticatePersons WHERE student_id = ?",
      [studentId]
    );
    if (authRows.length > 0) authId = authRows[0].auth_id;
  } else {
    [rows] = await pool.query(
      "SELECT faculty_id FROM Faculty WHERE email = ?",
      [email]
    );
    if (rows.length > 0) {
      facultyId = rows[0].faculty_id;
      let [authRows] = await pool.query(
        "SELECT auth_id FROM AuthenticatePersons WHERE faculty_id = ?",
        [facultyId]
      );
      if (authRows.length > 0) authId = authRows[0].auth_id;
    }
  }
  if (!authId) return res.status(404).json({ message: "User not found" });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  // Store OTP in DB
  await pool.query(
    "INSERT INTO PasswordResetOTPs (email, otp, expires_at) VALUES (?, ?, ?)",
    [email, otp, expiresAt]
  );

  // Send OTP email
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP is: ${otp}`,
  });
  res.json({ message: "OTP sent to email" });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: "Email and OTP required" });
  const [rows] = await pool.query(
    "SELECT * FROM PasswordResetOTPs WHERE email = ? AND otp = ? AND used = FALSE ORDER BY created_at DESC LIMIT 1",
    [email, otp]
  );
  if (!rows.length) return res.status(400).json({ message: "Invalid OTP" });
  const record = rows[0];
  if (new Date(record.expires_at) < new Date()) {
    return res.status(400).json({ message: "OTP expired" });
  }
  res.json({ message: "OTP verified" });
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.status(400).json({ message: "All fields required" });
  const [rows] = await pool.query(
    "SELECT * FROM PasswordResetOTPs WHERE email = ? AND otp = ? AND used = FALSE ORDER BY created_at DESC LIMIT 1",
    [email, otp]
  );
  if (!rows.length) return res.status(400).json({ message: "Invalid OTP" });
  const record = rows[0];
  if (new Date(record.expires_at) < new Date()) {
    return res.status(400).json({ message: "OTP expired" });
  }
  // Find auth_id by email in Student or Faculty, then update password
  let studentId = null,
    facultyId = null,
    authId = null;
  let [userRows] = await pool.query(
    "SELECT student_id FROM Student WHERE email = ?",
    [email]
  );
  if (userRows.length > 0) {
    studentId = userRows[0].student_id;
    let [authRows] = await pool.query(
      "SELECT auth_id FROM AuthenticatePersons WHERE student_id = ?",
      [studentId]
    );
    if (authRows.length > 0) authId = authRows[0].auth_id;
  } else {
    [userRows] = await pool.query(
      "SELECT faculty_id FROM Faculty WHERE email = ?",
      [email]
    );
    if (userRows.length > 0) {
      facultyId = userRows[0].faculty_id;
      let [authRows] = await pool.query(
        "SELECT auth_id FROM AuthenticatePersons WHERE faculty_id = ?",
        [facultyId]
      );
      if (authRows.length > 0) authId = authRows[0].auth_id;
    }
  }
  if (!authId) return res.status(404).json({ message: "User not found" });
  // Hash password
  const hashed = crypto.createHash("sha256").update(newPassword).digest("hex");
  await pool.query(
    "UPDATE AuthenticatePersons SET password = ? WHERE auth_id = ?",
    [hashed, authId]
  );
  // Mark OTP as used
  await pool.query("UPDATE PasswordResetOTPs SET used = TRUE WHERE id = ?", [
    record.id,
  ]);
  res.json({ message: "Password reset successful" });
};
