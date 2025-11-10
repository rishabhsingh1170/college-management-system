import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  publishNotification,
  deleteNotification
} from "../controller/Notification.js";
import {
  getFacultyBasicDetails,
  getFacultyDetailsForAdmin,
  getFacultyList,
  getStudentBasicDetails,
  getStudentDetailsForAdmin,
  getStudentsWithPendingFees,
  updateFacultyDetails,
  updateStudentDetails
} from "../controller/Profile.js";
import { updateFeeStatus } from "../controller/Fees.js";
import {
  getSupportTickets,
  updateSupportTicketStatus
} from "../controller/HelpAndSupport.js";

import upload from "../config/multer.js";  // ✅ PDF Upload middleware
import db from "../config/database.js";  // ✅ MySQL connection

const router = express.Router();

// ✅ Existing routes...
router.post("/notifications/publish", authenticateToken, publishNotification);
router.delete('/delete-notifications/:notificationId', authenticateToken, deleteNotification);
router.get('/student/:studentId/basic', authenticateToken, getStudentBasicDetails);
router.get('/students/pending-fees', authenticateToken, getStudentsWithPendingFees);
router.get('/student/:studentId', authenticateToken, getStudentDetailsForAdmin);
router.put('/student/:studentId', authenticateToken, updateStudentDetails);
router.put('/fees/:feeId', authenticateToken, updateFeeStatus);
router.get('/faculty/:facultyId/basic', authenticateToken, getFacultyBasicDetails)
router.get('/faculty-list', authenticateToken, getFacultyList)
router.get('/faculty/:facultyId', authenticateToken, getFacultyDetailsForAdmin);
router.put('/faculty/:facultyId', authenticateToken, updateFacultyDetails);
router.get("/get-support-tickets", authenticateToken, getSupportTickets);
router.put("/update-support-tickets/:supportId/status", authenticateToken, updateSupportTicketStatus);


// ✅ ✅ ✅ Library Routes Added Here ✅ ✅ ✅

// POST ➝ Add Book + Upload PDF
router.post(
  "/library/books",
  authenticateToken,
  upload.single("pdf_file"),
  (req, res) => {

    const { title, author, category, total_copies, available_copies } = req.body;
    const pdf_url = req.file ? req.file.path : null;

    const query = `
      INSERT INTO books (title, author, category, total_copies, available_copies, pdf_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [title, author, category, total_copies, available_copies, pdf_url],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error adding book" });
        }
        res.status(201).json({ message: "Book added successfully" });
      }
    );
  }
);


// ✅ Get all books (for frontend list)
router.get("/library/books", authenticateToken, (req, res) => {
  db.query("SELECT * FROM books", (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching books" });
    res.json(results);
  });
});


export default router;
