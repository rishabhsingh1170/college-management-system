import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { updateMarks } from "../controller/Marks.js";
import {
  getAttendanceOfAllStudent,
  submitAttendance,
} from "../controller/Attendence.js";
import { getFacultyProfile } from "../controller/Profile.js";
import { getNotifications } from "../controller/notification.js";
import { getFacultySalary } from "../controller/Salary.js";
import { getFacultyCourses, getFacultyTeachingData } from "../controller/Courses.js";
import { getFacultyLibraryRecords } from "../controller/Library.js";

const router = express.Router();

//get profile
router.get("/profile", authenticateToken, getFacultyProfile);

//get salary details
router.get("/salary", authenticateToken, getFacultySalary);

//get courses and subjects
router.get("/courses", authenticateToken, getFacultyCourses);

//get getFacultyTeachingData
router.get("/getFacultyTeachingData", authenticateToken, getFacultyTeachingData);

//take attendence
router.post("/submit-attendence", authenticateToken, submitAttendance);

//give marks
router.post("/give-marks", authenticateToken, updateMarks);

// Get attendance of all students for a subject and date
router.get(
  "/api/faculty/attendance",
  authenticateToken,
  getAttendanceOfAllStudent
);

//get faculty library records
router.get("/library", authenticateToken, getFacultyLibraryRecords);

export default router;
