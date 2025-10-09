import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { publishNotification, deleteNotification } from "../controller/Notification.js";
import { getFacultyBasicDetails, getFacultyDetailsForAdmin, getFacultyList, getStudentBasicDetails, getStudentDetailsForAdmin, getStudentsWithPendingFees, updateFacultyDetails, updateStudentDetails } from "../controller/Profile.js";
import { updateFeeStatus } from "../controller/Fees.js";
import { getSupportTickets, updateSupportTicketStatus } from "../controller/HelpAndSupport.js";

const router = express.Router();

router.post("/notifications/publish", authenticateToken, publishNotification);
router.delete('/delete-notifications/:notificationId', authenticateToken, deleteNotification);

// GET a student's basic details
router.get('/student/:studentId/basic', authenticateToken, getStudentBasicDetails);

// GET a list of students with pending fees
router.get('/students/pending-fees', authenticateToken, getStudentsWithPendingFees);

// 3. GET student details for the edit form
router.get('/student/:studentId', authenticateToken, getStudentDetailsForAdmin);

// 4. PUT request to update a student's personal details
router.put('/student/:studentId', authenticateToken, updateStudentDetails);

// 5. PUT request to update a specific fee record
router.put('/fees/:feeId', authenticateToken, updateFeeStatus);

// 2. GET BASIC DETAILS for a single faculty (for search preview)
router.get('/faculty/:facultyId/basic', authenticateToken, getFacultyBasicDetails)

// 1. GET ALL FACULTY MEMBERS (for the main list)
router.get('/faculty-list', authenticateToken, getFacultyList)

// 3. GET FULL DETAILS for a single faculty (for the edit form)
router.get('/faculty/:facultyId', authenticateToken, getFacultyDetailsForAdmin);

// 4. PUT to update a faculty member's details
router.put('/faculty/:facultyId', authenticateToken, updateFacultyDetails);

//admin get all suppot tickets
router.get("/get-support-tickets", authenticateToken, getSupportTickets);

//admin can update suppot tickets status
router.put("/update-support-tickets/:supportId/status", authenticateToken, updateSupportTicketStatus);

export default router;