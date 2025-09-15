// Get student marks (Result)
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

// Set student marks
export const updateMarks = async (req, res) => {
  if (req.user.user_type !== "faculty") return res.sendStatus(403);
  const { student_id, subject_id, exam_id, marks, grade } = req.body;
  if (!student_id || !subject_id || !exam_id || marks == null) {
    return res.status(400).json({ message: "All fields required" });
  }
  try {
    await pool.query(
      "INSERT INTO SubjectMarks (subject_id, student_id, exam_id, marks, grade) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE marks = VALUES(marks), grade = VALUES(grade)",
      [subject_id, student_id, exam_id, marks, grade || null]
    );
    res.json({ message: "Marks added/updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
