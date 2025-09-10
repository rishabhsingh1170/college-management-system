//get student marks
export const getResult = async (req, res) => {
  if (req.user.user_type !== "student") return res.sendStatus(403);
  const { semester_id } = req.query;
  if (!semester_id) {
    return res.status(400).json({ message: "semester_id is required" });
  }
  try {
    // Get all subjects for this semester
    const [subjectRows] = await pool.query(
      "SELECT subject_id, subject_name FROM Subjects WHERE semester_id = ?",
      [semester_id]
    );
    const subjectIds = subjectRows.map((s) => s.subject_id);
    if (subjectIds.length === 0) {
      return res.json([]);
    }
    // Get marks for these subjects for the student
    const [marksRows] = await pool.query(
      `SELECT m.*, s.subject_name, e.exam_type, e.date as exam_date
       FROM SubjectMarks m
       JOIN Subjects s ON m.subject_id = s.subject_id
       JOIN Examination e ON m.exam_id = e.exam_id
       WHERE m.student_id = ? AND m.subject_id IN (?)`,
      [req.user.student_id, subjectIds]
    );
    res.json(marksRows);
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
