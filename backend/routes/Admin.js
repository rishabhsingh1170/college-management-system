import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { publishNotification, deleteNotification } from "../controller/Notification.js";
import { getFacultyBasicDetails, getFacultyDetailsForAdmin, getFacultyList, getStudentBasicDetails, getStudentDetailsForAdmin, getStudentsWithPendingFees, updateFacultyDetails, updateStudentDetails } from "../controller/Profile.js";
import { updateFeeStatus } from "../controller/Fees.js";
import { getSupportTickets, updateSupportTicketStatus } from "../controller/HelpAndSupport.js";
import { addBook, getBooks, getBorrowedBooks, getOverdueFines } from "../controller/Library.js";

const router = express.Router();

//notification published or delete by admin
router.post("/notifications/publish", authenticateToken, publishNotification);
router.delete('/delete-notifications/:notificationId', authenticateToken, deleteNotification);

// GET a student's basic details
router.get('/student/:studentId/basic', authenticateToken, getStudentBasicDetails);

// GET a list of students with pending fees
router.get('/students/pending-fees', authenticateToken, getStudentsWithPendingFees);

// GET student details for the edit form
router.get('/student/:studentId', authenticateToken, getStudentDetailsForAdmin);

// PUT request to update a student's personal details
router.put('/student/:studentId', authenticateToken, updateStudentDetails);

// PUT request to update a specific fee record
router.put('/fees/:feeId', authenticateToken, updateFeeStatus);

// GET BASIC DETAILS for a single faculty (for search preview)
router.get('/faculty/:facultyId/basic', authenticateToken, getFacultyBasicDetails)

// GET ALL FACULTY MEMBERS (for the main list)
router.get('/faculty-list', authenticateToken, getFacultyList)

// GET FULL DETAILS for a single faculty (for the edit form)
router.get('/faculty/:facultyId', authenticateToken, getFacultyDetailsForAdmin);

// PUT to update a faculty member's details
router.put('/faculty/:facultyId', authenticateToken, updateFacultyDetails);

//admin get all suppot tickets
router.get("/get-support-tickets", authenticateToken, getSupportTickets);

//admin can update suppot tickets status
router.put("/update-support-tickets/:supportId/status", authenticateToken, updateSupportTicketStatus);

//library fines and books
router.get("/books", authenticateToken, getBooks);
router.get("/books/borrowed", authenticateToken, getBorrowedBooks);
router.get("/books/fines", authenticateToken, getOverdueFines);
router.post("/books/add", authenticateToken, addBook);

export default router;