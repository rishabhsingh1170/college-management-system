

export const getTimetable = async (req, res) => {
  if (req.user.role !== "student") return res.sendStatus(403);
  try {
    const [rows] = await pool.query(
      "SELECT * FROM exam_timetable ORDER BY date"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}