export const getTimetable = async (req, res) => {
  if (req.user.user_type !== "student") return res.sendStatus(403);
  try {
    const [rows] = await pool.query(
      "SELECT * FROM ExamTimeTable ORDER BY exam_date"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
