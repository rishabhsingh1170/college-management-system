
//get attendence of a student;
export const getAttendance = async (req, res) => {
  if (req.user.role !== "student") return res.sendStatus(403);
  try {
    const [rows] = await pool.query(
      "SELECT * FROM attendance WHERE student_id = ?",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

//set attendence of a student
export const updateAttendance = async (req, res) => {
    async (req, res) => {
      if (req.user.role !== "faculty") return res.sendStatus(403);
      const { student_id, date, status } = req.body;
      if (!student_id || !date || !status) {
        return res.status(400).json({ message: "All fields required" });
      }
      try {
        await pool.query(
          "INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)",
          [student_id, date, status]
        );
        res.json({ message: "Attendance added" });
      } catch (err) {
        res.status(500).json({ message: "Server error" });
      }
    };
}