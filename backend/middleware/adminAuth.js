import { pool } from "../config/database.js";

/**
 * ✅ Middleware to restrict access to admins only
 * Works perfectly with your login + JWT system
 */
export const requireAdmin = async (req, res, next) => {
  try {
    const user = req.user; // decoded from token in authenticateToken

    // ✅ Step 1: Ensure token exists
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: No user found in token" });
    }

    // ✅ Step 2: Check if the token user_type is admin
    if (user.user_type?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    // ✅ Step 3: Verify this admin exists in Faculty table
    const [rows] = await pool.query(
      "SELECT * FROM Faculty WHERE faculty_id = ?",
      [user.user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // ✅ Step 4: All checks passed → go to next middleware/controller
    next();

  } catch (error) {
    console.error("AdminAuth Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
