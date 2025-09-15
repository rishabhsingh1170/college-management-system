import express from "express";
import { login, signup, getPersonalInfo } from "../controller/Auth.js";
import { getAttendance, updateAttendance } from "../controller/Attendence.js";
import { getResult, updateMarks } from "../controller/Marks.js";
import { getFees } from "../controller/Fees.js";
import {
  requestPasswordReset,
  verifyOtp,
  resetPassword,
} from "../controller/PasswordReset.js";

const router = express.Router();

// login route
router.post("/login", login);

// get personal info route
router.get("/me", getPersonalInfo);

// Password reset routes
router.post("/forgot-password", requestPasswordReset);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
