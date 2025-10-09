// Get salary details for a specific faculty member
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js"; // Your database connection pool
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const getFacultySalary = async (req, res) => {
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

    // Fetch the most recent salary for the 'current' section
    const currentSalaryQuery = `
      SELECT
        sh.gross_pay,
        sh.net_pay,
        sh.pay_date,
        (SELECT JSON_ARRAYAGG(
            JSON_OBJECT('type', d.deduction_type, 'amount', d.amount)
        ) FROM Deductions d WHERE d.salary_id = sh.salary_id) AS deductions_list
      FROM SalaryHistory sh
      WHERE sh.faculty_id = ?
      ORDER BY sh.pay_date DESC
      LIMIT 1;
    `;
    const [currentSalaryRows] = await pool.query(currentSalaryQuery, [
      facultyId,
    ]);

    // Fetch salary history
    const historyQuery = `
      SELECT
        sh.pay_date,
        sh.net_pay,
        sh.status
      FROM SalaryHistory sh
      WHERE sh.faculty_id = ?
      ORDER BY sh.pay_date DESC;
    `;
    const [historyRows] = await pool.query(historyQuery, [facultyId]);

    // Data Transformation to match frontend structure
    const current = currentSalaryRows[0]
      ? {
          month: new Date(currentSalaryRows[0].pay_date).toLocaleString(
            "en-US",
            { month: "long", year: "numeric" }
          ),
          grossPay: parseFloat(currentSalaryRows[0].gross_pay),
          netPay: parseFloat(currentSalaryRows[0].net_pay),
          // CORRECTED LINE: Removed JSON.parse
          deductions: currentSalaryRows[0].deductions_list
            ? currentSalaryRows[0].deductions_list.reduce((acc, curr) => {
                acc[curr.type.toLowerCase()] = parseFloat(curr.amount);
                return acc;
              }, {})
            : {},
        }
      : null;

    const history = historyRows.map((row) => ({
      month: new Date(row.pay_date).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      }),
      netPay: parseFloat(row.net_pay),
      link: `/payslip/${row.salary_id}`, // Generate a dynamic link
      status: row.status,
    }));

    const salaryDetails = { current, history };

    res.json(salaryDetails);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
