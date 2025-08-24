import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/database.js";
import userRoutes from "./routes/User.js";
import studentRoutes from "./routes/Student.js"
import facultyRoutes from "./routes/Faculty.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("College Management System Backend");
});

app.use("/api/v1/auth",userRoutes)
app.use("/api/v1/student/",studentRoutes);
app.use("/api/v1/faculty/",facultyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    pool();
});
