export const getFees = async (req, res) => {
  if (req.user.user_type !== "student") return res.sendStatus(403);
  try {
    const [rows] = await pool.query("SELECT * FROM Fees WHERE student_id = ?", [
      req.user.student_id,
    ]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
