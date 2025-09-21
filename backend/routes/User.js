import express from "express";
import { login, signup} from "../controller/Auth.js";
import {
  requestPasswordReset,
  verifyOtp,
  resetPassword,
} from "../controller/PasswordReset.js";
import { authenticateToken } from "../middleware/auth.js";
import { getNotifications } from "../controller/notification.js";

const router = express.Router();

// login route
router.post("/login", login);

//get notification for student
router.get("/notifications", authenticateToken, getNotifications);

// Password reset routes
router.post("/forgot-password", requestPasswordReset);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
