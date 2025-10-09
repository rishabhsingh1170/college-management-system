import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js'; // Your database connection pool
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const updateFeeStatus = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user_type !== "admin") return res.status(403).json({ message: "Access denied. Admin role required." });

    const { feeId } = req.params;
    const { status, paid_amount } = req.body;

    const updateQuery = `
      UPDATE Fees
      SET status = ?, paid_amount = ?
      WHERE fee_id = ?;
    `;
    await pool.query(updateQuery, [status, paid_amount, feeId]);

    res.json({ message: "Fee status updated successfully." });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getFees = async (req, res) => {
  if (req.user.user_type !== "student") return res.sendStatus(403);
  try {
    const [rows] = await pool.query("SELECT * FROM Fees WHERE student_id = ?", [
      req.user.student_id,
    ]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
