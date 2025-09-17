import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/User.js";
import studentRoutes from "./routes/Student.js";
import facultyRoutes from "./routes/Faculty.js";
import { pool } from "./config/database.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true,
  })
);
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("College Management System Backend");
});

// DB connection check route
app.get("/api/v1/db-check", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ connected: true });
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/student/", studentRoutes);
app.use("/api/v1/faculty/", facultyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
