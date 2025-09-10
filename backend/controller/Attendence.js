// Get attendance of all students for a subject and date
export const getAttendanceOfAllStudent = async (req, res) => {
  if (req.user.user_type !== "faculty") return res.sendStatus(403);
  const { subject_id } = req.query;
  if (!subject_id) {
    return res.status(400).json({ message: "subject_id is required" });
  }
  try {
    // Get total classes (distinct dates) for the subject
    const [totalClassRows] = await pool.query(
      "SELECT COUNT(DISTINCT date) as total_classes FROM Attendance WHERE subject_id = ?",
      [subject_id]
    );
    const total_classes = totalClassRows[0]?.total_classes || 0;

    // Get attendance summary for each student
    const [rows] = await pool.query(
      `SELECT student_id, 
        SUM(status = 'Present') as attended_classes, 
        COUNT(*) as total_records
      FROM Attendance 
      WHERE subject_id = ?
      GROUP BY student_id`,
      [subject_id]
    );

    // Format result: student_id, attended_classes, total_classes
    const result = rows.map((r) => ({
      student_id: r.student_id,
      attended_classes: r.attended_classes,
      total_classes: total_classes,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//get attendence of a student;
export const getAttendance = async (req, res) => {
  if (req.user.user_type !== "student") return res.sendStatus(403);
  try {
    // Get the student's semester_id
    const [studentRows] = await pool.query(
      "SELECT semester_id FROM Student WHERE student_id = ?",
      [req.user.student_id]
    );
    if (studentRows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    const semester_id = studentRows[0].semester_id;

    // Get all subjects for this semester
    const [subjectRows] = await pool.query(
      "SELECT subject_id, subject_name FROM Subjects WHERE semester_id = ?",
      [semester_id]
    );

    // For each subject, get attended_classes and total_classes
    const attendanceSummary = [];
    for (const subject of subjectRows) {
      // Total classes held for this subject
      const [totalClassRows] = await pool.query(
        "SELECT COUNT(DISTINCT date) as total_classes FROM Attendance WHERE subject_id = ?",
        [subject.subject_id]
      );
      const total_classes = totalClassRows[0]?.total_classes || 0;

      // Classes attended by student for this subject
      const [attendedRows] = await pool.query(
        "SELECT COUNT(*) as attended_classes FROM Attendance WHERE subject_id = ? AND student_id = ? AND status = 'Present'",
        [subject.subject_id, req.user.student_id]
      );
      const attended_classes = attendedRows[0]?.attended_classes || 0;

      attendanceSummary.push({
        subject_id: subject.subject_id,
        subject_name: subject.subject_name,
        attended_classes,
        total_classes,
      });
    }
    res.json(attendanceSummary);
  } catch (err) {
    console.log("error in getAttendance controller", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//set attendence of a student
export const updateAttendance = async (req, res) => {
  if (req.user.user_type !== "faculty") return res.sendStatus(403);
  const { subject_id, date, presentStudentIds, allStudentIds } = req.body;
  if (
    !subject_id ||
    !date ||
    !Array.isArray(presentStudentIds) ||
    !Array.isArray(allStudentIds)
  ) {
    return res.status(400).json({
      message:
        "subject_id, date, presentStudentIds, and allStudentIds are required",
    });
  }
  try {
    // Mark present students
    for (const student_id of presentStudentIds) {
      await pool.query(
        "INSERT INTO Attendance (student_id, subject_id, date, status) VALUES (?, ?, ?, 'Present')",
        [student_id, subject_id, date]
      );
    }
    // Mark absent students (those not in presentStudentIds)
    const absentStudentIds = allStudentIds.filter(
      (id) => !presentStudentIds.includes(id)
    );
    for (const student_id of absentStudentIds) {
      await pool.query(
        "INSERT INTO Attendance (student_id, subject_id, date, status) VALUES (?, ?, ?, 'Absent')",
        [student_id, subject_id, date]
      );
    }
    res.json({ message: "Attendance updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
