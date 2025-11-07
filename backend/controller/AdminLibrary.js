import { pool } from "../config/database.js";

export const addBook = async (req, res) => {
  try {
    const { title, author, category, available_copies } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: "Title and Author required" });
    }

    const [result] = await pool.query(
      "INSERT INTO Books (title, author, category, available_copies) VALUES (?, ?, ?, ?)",
      [title, author, category || null, available_copies ?? 0]
    );

    res.status(201).json({
      message: "Book added successfully",
      book_id: result.insertId,
    });
  } catch (error) {
    console.error("Add Book Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getFines = async (req, res) => {
  try {
    const finePerDay = parseFloat(req.query.finePerDay) || 10;

    const sql = `
      SELECT bb.*, b.title, b.author, s.name AS student_name
      FROM BorrowBooks bb
      LEFT JOIN Books b ON b.book_id = bb.book_id
      LEFT JOIN Student s ON s.student_id = bb.borrower_id
      ORDER BY bb.borrow_date DESC
    `;
    const [rows] = await pool.query(sql);

    const today = new Date();

    const results = rows.map(r => {
      const borrowDate = new Date(r.borrow_date);
      const dueDate = new Date(borrowDate.getTime() + 14 * 24 * 60 * 60 * 1000);
      const returnDate = r.return_date ? new Date(r.return_date) : null;

      let overdueDays = 0, fine = 0, status = "Within Due";

      if (!returnDate && today > dueDate) {
        overdueDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
        status = "Overdue";
      }

      if (returnDate && returnDate > dueDate) {
        overdueDays = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
        status = "Returned Late";
      }

      fine = overdueDays * finePerDay;

      return {
        ...r,
        due_date: dueDate.toISOString().slice(0, 10),
        status,
        overdueDays,
        fine
      };
    });

    res.json({ finePerDay, data: results });
  } catch (error) {
    console.error("Fine Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Fetch all books from the Books table
export const getBooks = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT book_id, title, author, category, available_copies FROM Books ORDER BY book_id DESC"
    );

    res.json(rows);
  } catch (error) {
    console.error("Get Books Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Mark a fine as paid
export const markFinePaid = async (req, res) => {
  try {
    const { borrower_id } = req.params; // ✅ matches your DB column

    if (!borrower_id) {
      return res.status(400).json({ message: "Borrower ID is required" });
    }

    const [result] = await pool.query(
      "UPDATE BorrowBooks SET fine_paid = 1 WHERE borrower_id = ?",
      [borrower_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    res.json({ message: "Fine marked as paid successfully" });
  } catch (error) {
    console.error("Mark Fine Paid Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
