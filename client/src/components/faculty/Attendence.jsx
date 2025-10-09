import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaCheck,
  FaBan,
  FaUsers,
  FaUser,
  FaExclamationTriangle,
} from "react-icons/fa";
import { getRequest, postRequest } from "../../api/api";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

const Attendence = () => {
  const [teachingData, setTeachingData] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [absentStudents, setAbsentStudents] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, []);

  useEffect(() => {
    const fetchTeachingData = async () => {
      try {
        toast.loading("Fetching teaching data...", { id: "fetch-data" });
        const response = await getRequest("/faculty/getFacultyTeachingData");
        const data = response.data;

        setTeachingData(data);
        if (data.length > 0) {
          const defaultCourse = data[0];
          setSelectedCourseId(defaultCourse.course_id);
          const defaultSemester = defaultCourse.semesters[0];
          setSelectedSemester(defaultSemester.semester_no);
          const defaultSubject = defaultSemester.subjects[0];
          setSelectedSubjectId(defaultSubject.subject_id);
          setStudents(
            defaultSubject.students.map((s) => ({ ...s, status: "absent" }))
          );
        }
        toast.dismiss("fetch-data");
        toast.success("Teaching data loaded successfully!");
      } catch (err) {
        setError("Failed to fetch teaching data.");
        toast.dismiss("fetch-data");
        toast.error("Error fetching teaching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeachingData();
  }, []);

  const handleCourseChange = (e) => {
    const courseId = parseInt(e.target.value);
    setSelectedCourseId(courseId);
    const course = teachingData.find((c) => c.course_id === courseId);
    const defaultSemester = course.semesters[0];
    setSelectedSemester(defaultSemester.semester_no);
    const defaultSubject = defaultSemester.subjects[0];
    setSelectedSubjectId(defaultSubject.subject_id);
    setStudents(
      defaultSubject.students.map((s) => ({ ...s, status: "absent" }))
    );
  };

  const handleSemesterChange = (e) => {
    const semesterNo = parseInt(e.target.value);
    setSelectedSemester(semesterNo);
    const course = teachingData.find((c) => c.course_id === selectedCourseId);
    const semester = course.semesters.find((s) => s.semester_no === semesterNo);
    const defaultSubject = semester.subjects[0];
    setSelectedSubjectId(defaultSubject.subject_id);
    setStudents(
      defaultSubject.students.map((s) => ({ ...s, status: "absent" }))
    );
  };

  const handleSubjectChange = (e) => {
    const subjectId = parseInt(e.target.value);
    setSelectedSubjectId(subjectId);
    const course = teachingData.find((c) => c.course_id === selectedCourseId);
    const semester = course.semesters.find(
      (s) => s.semester_no === selectedSemester
    );
    const subject = semester.subjects.find((s) => s.subject_id === subjectId);
    setStudents(subject.students.map((s) => ({ ...s, status: "absent" })));
  };

  const toggleAttendance = (studentId) => {
    setStudents(
      students.map((student) =>
        student.student_id === studentId
          ? {
              ...student,
              status: student.status === "present" ? "absent" : "present",
            }
          : student
      )
    );
  };

  const markAllPresent = () => {
    setStudents(students.map((student) => ({ ...student, status: "present" })));
  };

  // New logic: Show confirmation modal first
  const showConfirmationModal = () => {
    const absent = students.filter((student) => student.status === "absent");
    setAbsentStudents(absent);
    setShowConfirmModal(true);
  };

  // This is the function that actually submits the data
  const confirmSubmission = async () => {
    const attendanceRecords = students.map((student) => ({
      student_id: student.student_id,
      subject_id: selectedSubjectId,
      date: new Date().toISOString().split("T")[0],
      status: student.status,
    }));

    try {
      toast.loading("Submitting attendance...", { id: "submit-attendance" });
      await postRequest("/faculty/submit-attendence", { attendanceRecords });
      toast.dismiss("submit-attendance");
      toast.success("Attendance submitted successfully!");
    } catch (err) {
      toast.dismiss("submit-attendance");
      toast.error(
        err.response?.data?.message || "Failed to submit attendance."
      );
    } finally {
      setShowConfirmModal(false); // Close the modal
    }
  };

  const currentCourse = teachingData.find(
    (c) => c.course_id === selectedCourseId
  );
  const currentSemester = currentCourse?.semesters.find(
    (s) => s.semester_no === selectedSemester
  );
  const currentSubject = currentSemester?.subjects.find(
    (s) => s.subject_id === selectedSubjectId
  );

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading teaching data...
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div
      className="p-6 md:p-8 bg-white rounded-xl shadow-lg"
    >
      <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
        Mark Attendance 📝
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Select a course, semester, and subject to mark today's attendance.
      </p>

      {/* Dynamic Dropdowns (unchanged) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        {teachingData.length > 0 && (
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <label
              htmlFor="course-select"
              className="font-semibold text-gray-700"
            >
              Course:
            </label>
            <select
              id="course-select"
              value={selectedCourseId}
              onChange={handleCourseChange}
              className="w-full sm:w-48 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {teachingData.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.course_name}
                </option>
              ))}
            </select>
          </div>
        )}
        {currentCourse && currentCourse.semesters.length > 0 && (
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <label
              htmlFor="semester-select"
              className="font-semibold text-gray-700"
            >
              Semester:
            </label>
            <select
              id="semester-select"
              value={selectedSemester}
              onChange={handleSemesterChange}
              className="w-full sm:w-48 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currentCourse.semesters.map((sem) => (
                <option key={sem.semester_no} value={sem.semester_no}>
                  Semester {sem.semester_no}
                </option>
              ))}
            </select>
          </div>
        )}
        {currentSemester && currentSemester.subjects.length > 0 && (
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <label
              htmlFor="subject-select"
              className="font-semibold text-gray-700"
            >
              Subject:
            </label>
            <select
              id="subject-select"
              value={selectedSubjectId}
              onChange={handleSubjectChange}
              className="w-full sm:w-48 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currentSemester.subjects.map((sub) => (
                <option key={sub.subject_id} value={sub.subject_id}>
                  {sub.subject_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Student Attendance List (unchanged) */}
      <div className="bg-gray-50 rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FaUsers className="text-xl text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Student List</h3>
          </div>
          <button
            onClick={markAllPresent}
            className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-bold transition-all duration-200 transform hover:scale-105"
          >
            Mark All Present
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {students.length > 0 ? (
            students.map((student) => (
              <div
                key={student.student_id}
                className="flex items-center justify-between p-4 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <FaUser className="text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {student.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      ID: {student.student_id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleAttendance(student.student_id)}
                    className={`w-28 flex items-center justify-center space-x-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                      student.status === "present"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {student.status === "present" ? (
                      <>
                        <FaCheck className="text-lg" />
                        <span>Present</span>
                      </>
                    ) : (
                      <>
                        <FaBan className="text-lg" />
                        <span>Absent</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 p-4">
              No students found for this subject.
            </div>
          )}
        </div>
      </div>

      {/* Final submit button now triggers the confirmation modal */}
      <div className="mt-6 text-center">
        <button
          onClick={showConfirmationModal}
          disabled={!selectedSubjectId || students.length === 0}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105 disabled:bg-gray-400"
        >
          Submit Attendance
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center text-yellow-500 mb-4">
              <FaExclamationTriangle className="text-3xl mr-3" />
              <h3 className="text-xl font-bold text-gray-800">
                Confirm Submission
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              You are about to submit attendance for this class.
              <br />
              The following **{absentStudents.length} student(s)** will be
              marked as Absent:
            </p>
            {absentStudents.length > 0 && (
              <ul className="list-disc list-inside text-gray-600 mb-6 max-h-32 overflow-y-auto">
                {absentStudents.map((student) => (
                  <li key={student.student_id}>
                    {student.name} (ID: {student.student_id})
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmission}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendence;
