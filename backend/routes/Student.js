import express from "express";
import { getResult } from "../controller/Marks.js";
import { authenticateToken } from "../middleware/auth.js";
import { getAttendance } from "../controller/Attendence.js";
import { getTimetable } from "../controller/TimeTable.js";
import { getFees } from "../controller/Fees.js";

const router = express.Router();

//get attendence
router.get("/get-attendence",authenticateToken, getAttendance);

//get result of a semester
router.get("/get-result",authenticateToken, getResult);

//get fees details;
router.get("/get-fees-details", authenticateToken, getFees);



export default router;
