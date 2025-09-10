import express from "express";
import { login, signup, getPersonalInfo } from "../controller/Auth.js";
import { getAttendance, updateAttendance } from "../controller/Attendence.js";
import { getResult, updateMarks } from "../controller/Marks.js";
import { getFees } from "../controller/Fees.js";

const router = express.Router();

// login route
router.post("/login", login);

// signup route
router.post("/signup", signup);

// get personal info route
router.get("/me", getPersonalInfo);

//*********************** STUDENT ******************************** */

//get attendence
router.get("/get-attendence", getAttendance);

//get result of a semester
router.get("/get-result",getResult);

//get fees details;
router.get("/get-fees-details", getFees);


//*********************** FACULTY ******************************** */
//take attendence
router.post("/take-attendence", updateAttendance);

//give marks
router.post("/give-marks", updateMarks);
export default router;
