import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { updateMarks } from "../controller/Marks.js";
import {
  updateAttendance,
  getAttendanceOfAllStudent,
} from "../controller/Attendence.js";

const router = express.Router();

router.post("/api/faculty/marks", authenticateToken, updateMarks);

router.post("/api/faculty/attendance", authenticateToken, updateAttendance);
// Get attendance of all students for a subject and date
router.get(
  "/api/faculty/attendance",
  authenticateToken,
  getAttendanceOfAllStudent
);

export default router;
