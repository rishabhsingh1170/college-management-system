

export const getFees = async (req, res) => {
  if (req.user.role !== "student") return res.sendStatus(403);
  try {
    const [rows] = await pool.query("SELECT * FROM fees WHERE student_id = ?", [
      req.user.id,
    ]);
    res.json(rows);
  } catch (err) {
    console.log("error in get fee controller", err);
    res.status(500).json({
      success:false,
      message: "Server error" 
    });
  }
};
