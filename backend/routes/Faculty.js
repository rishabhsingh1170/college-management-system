import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { updateMarks } from "../controller/Marks.js";
import { updateAttendance } from "../controller/Attendence.js";

const router = express.Router();

router.post("/api/faculty/marks", authenticateToken, updateMarks);
router.post("/api/faculty/attendance", authenticateToken, updateAttendance);


export default router;