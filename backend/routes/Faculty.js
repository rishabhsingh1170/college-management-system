import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { updateMarks } from "../controller/Marks.js";
import {
  updateAttendance,
  getAttendanceOfAllStudent,
} from "../controller/Attendence.js";

const router = express.Router();

//take attendence
router.post("/take-attendence", authenticateToken, updateAttendance);

//give marks
router.post("/give-marks", authenticateToken, updateMarks);

// Get attendance of all students for a subject and date
router.get(
  "/api/faculty/attendance",
  authenticateToken,
  getAttendanceOfAllStudent
);

export default router;
