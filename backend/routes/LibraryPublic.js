// backend/routes/LibraryPublic.js
import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { listBooks, myBorrows, borrowBook, returnBook } from "../controller/LibraryPublic.js";

const router = express.Router();

// all require login
router.get("/books", authenticateToken, listBooks);
router.get("/my/borrows", authenticateToken, myBorrows);
router.post("/borrow/:book_id", authenticateToken, borrowBook);
router.patch("/return/:borrow_id", authenticateToken, returnBook);

export default router;
