//get student marks
export const getMarks = async (req, res) => {
  if (req.user.role !== "student") return res.sendStatus(403);
  try {
    const [rows] = await pool.query(
      "SELECT * FROM marks WHERE student_id = ?",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


//set student marks
export const updateMarks = async (req, res) => {
  async (req, res) => {
    if (req.user.role !== "faculty") return res.sendStatus(403);
    const { student_id, subject, marks, exam } = req.body;
    if (!student_id || !subject || marks == null || !exam) {
      return res.status(400).json({ message: "All fields required" });
    }
    try {
      await pool.query(
        "INSERT INTO marks (student_id, subject, marks, exam) VALUES (?, ?, ?, ?)",
        [student_id, subject, marks, exam]
      );
      res.json({ message: "Marks added" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };
};
