
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
