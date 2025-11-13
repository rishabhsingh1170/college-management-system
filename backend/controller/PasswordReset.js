import transporter from "../config/mailer.js";
import { pool } from "../config/database.js";
import bcrypt from "bcrypt";
const SALT_ROUNDS = 10; // The cost factor for bcrypt hashing

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  if (!email) {
    return res
      .status(400)
      .json({ message: "Email is required to request a password reset." });
  }

  try {
    const [rows] = await pool.query(
      "SELECT auth_id, 'student' AS user_type FROM Student WHERE email = ? UNION SELECT auth_id, 'faculty' AS user_type FROM Faculty WHERE email = ?",
      [email, email]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User with this email not found." });
    }

    const { auth_id, user_type } = rows[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // This query deletes the previous OTP and inserts a new one in a single step
    await pool.query(
      "INSERT INTO PasswordResetOTPs (email, otp, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = VALUES(otp), expires_at = VALUES(expires_at), used = FALSE",
      [email, otp, expiresAt]
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${otp}`,
    });

    res
      .status(200)
      .json({ message: "An OTP has been sent to your email.", email: email });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "An unexpected server error occurred." });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  // console.log(email);
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
  const { email, otp, password } = req.body;
  if (!email || !otp || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let conn;
  try {
    // 1. Check for valid and unexpired OTP
    const [otpRows] = await pool.query(
      "SELECT * FROM PasswordResetOTPs WHERE email = ? AND otp = ? AND used = FALSE ORDER BY created_at DESC LIMIT 1",
      [email, otp]
    );

    if (otpRows.length === 0) {
      return res.status(400).json({ message: "Invalid or already used OTP." });
    }
    const record = otpRows[0];

    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ message: "OTP expired." });
    }

    // 2. Find the user's auth_id
    const [userRows] = await pool.query(
      "SELECT auth_id FROM Student WHERE email = ? UNION SELECT auth_id FROM Faculty WHERE email = ?",
      [email, email]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    const authId = userRows[0].auth_id;

    // 3. Begin Transaction
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // 4. Update password with PLAIN TEXT password
    await conn.query(
      "UPDATE AuthenticatePersons SET password = ? WHERE auth_id = ?",
      [password, authId] // <-- Using plain text password here
    );

    // 5. Mark OTP as used
    await conn.query("UPDATE PasswordResetOTPs SET used = TRUE WHERE id = ?", [
      record.id,
    ]);

    await conn.commit();
    res.json({ message: "Password reset successful." });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    if (conn) conn.release();
  }
};
