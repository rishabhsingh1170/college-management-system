import express from "express";
import { getResult } from "../controller/Marks.js";
import { authenticateToken } from "../middleware/auth.js";
import { getAttendance } from "../controller/Attendence.js";
import { getTimetable } from "../controller/TimeTable.js";
import { getFees } from "../controller/Fees.js";

const router = express.Router();

router.get("/marks",authenticateToken , getResult);
router.get("/attendance", authenticateToken, getAttendance);
router.get("/exam-timetable", authenticateToken, getTimetable);
router.get("/fees", authenticateToken, getFees);


export default router;
