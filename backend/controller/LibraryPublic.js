import { pool } from "../config/database.js";

const FINE_PER_DAY_DEFAULT = 10;

/* ------------------------ Helper: Fine + Status ------------------------ */
function decorateBorrowRow(r, finePerDay = FINE_PER_DAY_DEFAULT) {
  const borrowDate = new Date(r.borrow_date);
  const dueDate = new Date(borrowDate.getTime() + 14 * 24 * 60 * 60 * 1000);
  const today = new Date();
  const returned = r.return_date ? new Date(r.return_date) : null;

  let overdueDays = 0;
  let status = "Within Due";

  if (!returned && today > dueDate) {
    overdueDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
    status = "Overdue";
  } else if (returned && returned > dueDate) {
    overdueDays = Math.ceil((returned - dueDate) / (1000 * 60 * 60 * 24));
    status = "Returned Late";
  }

  const fine = overdueDays * finePerDay;

  return {
    ...r,
    due_date: dueDate.toISOString().slice(0, 10),
    status,
    overdueDays,
    fine,
  };
}

/* ------------------------ GET: List All Books ------------------------ */
export const listBooks = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT book_id, title, author, category, available_copies 
       FROM Books 
       ORDER BY title ASC`
    );
    res.json(rows);
  } catch (e) {
    console.error("❌ listBooks error:", e);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ------------------------ GET: My Borrows ------------------------ */
export const myBorrows = async (req, res) => {
  try {
    const finePerDay = parseFloat(req.query.finePerDay) || FINE_PER_DAY_DEFAULT;
    const userType = req.user.user_type;
    const userId = req.user.user_id || req.user.id || req.user.auth_id;

    if (!userId) {
      console.warn("❌ Missing userId in token payload.");
      return res.status(401).json({ message: "Invalid or missing user ID" });
    }

    const borrowerType = userType === "student" ? "student" : "faculty";

    const sql = `
      SELECT 
        bb.borrow_id, bb.borrow_date, bb.return_date, bb.fine_paid,
        b.book_id, b.title, b.author, b.category
      FROM BorrowBooks bb
      JOIN Books b ON b.book_id = bb.book_id
      WHERE bb.borrower_id = ? AND bb.borrower_type = ?
      ORDER BY bb.borrow_date DESC
    `;

    const [rows] = await pool.query(sql, [userId, borrowerType]);

    const decorated = rows.map((r) => decorateBorrowRow(r, finePerDay));

    return res.json({ finePerDay, data: decorated });
  } catch (e) {
    console.error("❌ myBorrows error:", e);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ------------------------ POST: Borrow Book ------------------------ */
export const borrowBook = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const bookId = Number(req.params.book_id);
    const userType = req.user.user_type;
    const userId = req.user.user_id;
    const borrowerType = userType === "student" ? "student" : "faculty";

    await conn.beginTransaction();

    // Check availability
    const [brows] = await conn.query(
      "SELECT available_copies FROM Books WHERE book_id = ? FOR UPDATE",
      [bookId]
    );
    if (brows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: "Book not found" });
    }
    if (brows[0].available_copies <= 0) {
      await conn.rollback();
      return res.status(400).json({ message: "No copies available" });
    }

    // Insert borrow record
    const [ins] = await conn.query(
      `INSERT INTO BorrowBooks 
        (borrower_id, borrower_type, book_id, borrow_date, fine_paid)
       VALUES (?, ?, ?, NOW(), 0)`,
      [userId, borrowerType, bookId]
    );

    // Decrement available copies
    await conn.query(
      "UPDATE Books SET available_copies = available_copies - 1 WHERE book_id = ?",
      [bookId]
    );

    await conn.commit();
    res.status(201).json({
      message: "Book issued successfully",
      borrow_id: ins.insertId,
    });
  } catch (e) {
    await conn.rollback().catch(() => {});
    console.error("❌ borrowBook error:", e);
    res.status(500).json({ message: "Server Error" });
  } finally {
    conn.release();
  }
};

/* ------------------------ PATCH: Return Book ------------------------ */
export const returnBook = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const borrowId = Number(req.params.borrow_id);

    await conn.beginTransaction();

    const [rows] = await conn.query(
      "SELECT book_id, return_date FROM BorrowBooks WHERE borrow_id = ? FOR UPDATE",
      [borrowId]
    );
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: "Borrow record not found" });
    }
    if (rows[0].return_date) {
      await conn.rollback();
      return res.status(400).json({ message: "Already returned" });
    }

    await conn.query(
      "UPDATE BorrowBooks SET return_date = NOW() WHERE borrow_id = ?",
      [borrowId]
    );
    await conn.query(
      "UPDATE Books SET available_copies = available_copies + 1 WHERE book_id = ?",
      [rows[0].book_id]
    );

    await conn.commit();
    res.json({ message: "Book returned successfully" });
  } catch (e) {
    await conn.rollback().catch(() => {});
    console.error("❌ returnBook error:", e);
    res.status(500).json({ message: "Server Error" });
  } finally {
    conn.release();
  }
};
