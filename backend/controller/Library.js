import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";


//for admin to add new book to library
export const addBook = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user_type !== "admin")
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });

    const { title, author, category, available_copies } = req.body;
    if (!title || !author || !category || available_copies === undefined) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const query = `
      INSERT INTO Books (title, author, category, available_copies)
      VALUES (?, ?, ?, ?);
    `;
    await pool.query(query, [title, author, category, available_copies]);

    res.status(201).json({ message: "Book added successfully." });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//fine is rs 5 per day overdue
const FINE_PER_DAY = 5.0;
const MAX_LOAN_DAYS = 14;

export const getOverdueFines = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user_type !== "admin")
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });

    const query = `
      SELECT
        bb.borrower_id,
        bb.borrower_type,
        b.title AS book_title,
        bb.borrow_date,
        DATEDIFF(CURDATE(), bb.borrow_date) AS days_out
      FROM BorrowBooks bb
      JOIN Books b ON bb.book_id = b.book_id
      WHERE DATEDIFF(CURDATE(), bb.borrow_date) > ? 
        AND bb.return_date IS NULL;
    `;
    const [rows] = await pool.query(query, [MAX_LOAN_DAYS]);

    const finesData = rows.map((row) => {
      const overdueDays = row.days_out - MAX_LOAN_DAYS;
      const fineAmount = overdueDays * FINE_PER_DAY;

      return {
        ...row,
        overdue_days: overdueDays,
        fine_amount: fineAmount.toFixed(2),
      };
    });

    res.json(finesData);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBooks = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user_type !== "admin")
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });

    const query = `
      SELECT book_id, title, author, category, available_copies
      FROM Books
      ORDER BY title;
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBorrowedBooks = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user_type !== "admin")
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });

    const query = `
      SELECT
        bb.borrower_id,
        bb.borrower_type,
        b.title AS book_title,
        b.author AS book_author,
        bb.borrow_date,
        bb.return_date
      FROM BorrowBooks bb
      JOIN Books b ON bb.book_id = b.book_id
      WHERE bb.return_date IS NULL  /* Filter to show only currently borrowed (not yet returned) */
      ORDER BY bb.borrow_date DESC;
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//for student to get their library records
export const getStudentLibraryRecords = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    let decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user_type !== "student") {
      return res
        .status(403)
        .json({ message: "Access denied. Student role required." });
    }

    const studentId = decoded.student_id;
    const borrowerType = "student";

    // to get currently borrowed books (return_date IS NULL)
    const query = `
      SELECT
        bb.borrow_date,
        b.title AS book_title,
        b.author AS book_author
      FROM BorrowBooks bb
      JOIN Books b ON bb.book_id = b.book_id
      WHERE bb.borrower_id = ? AND bb.borrower_type = ? AND bb.return_date IS NULL
      ORDER BY bb.borrow_date DESC;
    `;
    const [currentRows] = await pool.query(query, [studentId, borrowerType]);

    // Query to get borrowing history
    const historyQuery = `
      SELECT bb.borrow_date, bb.return_date, b.title AS book_title, b.author AS book_author
      FROM BorrowBooks bb
      JOIN Books b ON bb.book_id = b.book_id
      WHERE bb.borrower_id = ? AND bb.borrower_type = ? AND bb.return_date IS NOT NULL
      ORDER BY bb.borrow_date DESC;
    `;
    const [historyRows] = await pool.query(historyQuery, [
      studentId,
      borrowerType,
    ]);

    // --- Data Processing for Current Loans ---
    const currentLoans = currentRows.map((row) => {
      const borrowDate = new Date(row.borrow_date);
      const dueDate = new Date(borrowDate);
      dueDate.setDate(borrowDate.getDate() + MAX_LOAN_DAYS);
      const today = new Date();

      let overdueDays = 0;
      let fineAmount = 0.0;

      if (today > dueDate) {
        // Calculate the number of days the book is overdue
        const diffTime = Math.abs(today - dueDate);
        overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        fineAmount = overdueDays * FINE_PER_DAY;
      }

      return {
        ...row,
        due_date: dueDate.toISOString().split("T")[0],
        overdue_days: overdueDays,
        fine_amount: fineAmount.toFixed(2),
      };
    });

    res.json({
      current: currentLoans,
      history: historyRows,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// for faculty to get their library records
export const getFacultyLibraryRecords = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    let decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user_type !== "faculty") {
      return res
        .status(403)
        .json({ message: "Access denied. Faculty role required." });
    }

    const facultyId = decoded.faculty_id;
    const borrowerType = "faculty";

    // 1. Query to get currently borrowed books (return_date IS NULL)
    const currentQuery = `
      SELECT
        bb.borrow_date,
        b.title AS book_title,
        b.author AS book_author
      FROM BorrowBooks bb
      JOIN Books b ON bb.book_id = b.book_id
      WHERE bb.borrower_id = ? AND bb.borrower_type = ? AND bb.return_date IS NULL
      ORDER BY bb.borrow_date DESC;
    `;
    const [currentRows] = await pool.query(currentQuery, [
      facultyId,
      borrowerType,
    ]);

    // 2. Query to get borrowing history
    const historyQuery = `
      SELECT bb.borrow_date, bb.return_date, b.title AS book_title, b.author AS book_author
      FROM BorrowBooks bb
      JOIN Books b ON bb.book_id = b.book_id
      WHERE bb.borrower_id = ? AND bb.borrower_type = ? AND bb.return_date IS NOT NULL
      ORDER BY bb.borrow_date DESC;
    `;
    const [historyRows] = await pool.query(historyQuery, [
      facultyId,
      borrowerType,
    ]);

    // --- Data Processing for Current Loans (Fine calculation) ---
    const currentLoans = currentRows.map((row) => {
      const borrowDate = new Date(row.borrow_date);
      const dueDate = new Date(borrowDate);
      dueDate.setDate(borrowDate.getDate() + MAX_LOAN_DAYS);
      const today = new Date();

      let overdueDays = 0;
      let fineAmount = 0.0;

      if (today > dueDate) {
        const diffTime = Math.abs(today - dueDate);
        overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        fineAmount = overdueDays * FINE_PER_DAY;
      }

      return {
        ...row,
        due_date: dueDate.toISOString().split("T")[0],
        overdue_days: overdueDays,
        fine_amount: fineAmount.toFixed(2),
      };
    });

    res.json({
      current: currentLoans,
      history: historyRows,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};