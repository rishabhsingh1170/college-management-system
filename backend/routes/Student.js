import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {getStudentAttendance } from "../controller/Attendence.js";
import { getTimetable } from "../controller/TimeTable.js";
import { getFees } from "../controller/Fees.js";
import { getStudentProfile } from "../controller/Profile.js";
import { getStudentResults } from "../controller/Result.js";
import { getStudentSupportTickets, submitSupportTicket } from "../controller/HelpAndSupport.js";
import { getStudentLibraryRecords } from "../controller/Library.js";

const router = express.Router();

//get profile of student
router.get("/profile", authenticateToken, getStudentProfile)

///get result of a student
router.get("/results", authenticateToken, getStudentResults);

//help and support
router.post("/support", authenticateToken, submitSupportTicket);

//get help and support tickets and status
router.get("/get-support", authenticateToken, getStudentSupportTickets);

//get attendence
router.get("/get-attendence", authenticateToken, getStudentAttendance);

//get fees details;
router.get("/get-fees-details", authenticateToken, getFees);

//get library records
router.get("/library", authenticateToken, getStudentLibraryRecords);



export default router;
