import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUsers,
  FaUser,
  FaCheck,
  FaBan,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

// Mock data for courses and students
const courses = [
  { id: "cs101", name: "Data Structures" },
  { id: "cs102", name: "Algorithm Design" },
  { id: "ee101", name: "Digital Logic Design" },
];

const mockStudents = {
  cs101: [
    { id: "S-101", name: "Aarav Sharma", status: "present" },
    { id: "S-102", name: "Priya Verma", status: "absent" },
    { id: "S-103", name: "Rajiv Singh", status: "present" },
    { id: "S-104", name: "Anjali Gupta", status: "absent" },
  ],
  cs102: [
    { id: "S-201", name: "Vikram Patel", status: "present" },
    { id: "S-202", name: "Sneha Rao", status: "absent" },
  ],
  ee101: [
    { id: "E-301", name: "Gaurav Kumar", status: "present" },
    { id: "E-302", name: "Neha Sharma", status: "present" },
    { id: "E-303", name: "Amit Desai", status: "absent" },
  ],
};

const Attendence = () => {
  const [selectedCourse, setSelectedCourse] = useState(courses[0].id);
  const [students, setStudents] = useState(mockStudents[courses[0].id]);

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setStudents(mockStudents[courseId]);
  };

  const toggleAttendance = (studentId) => {
    setStudents(
      students.map((student) =>
        student.id === studentId
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

  const handleSubmit = () => {
    alert(
      `Attendance for ${
        courses.find((c) => c.id === selectedCourse).name
      } submitted successfully!`
    );
    // In a real app, you would send this data to an API
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="p-6 md:p-8 bg-white rounded-xl shadow-lg"
      data-aos="fade-up"
    >
      <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
        Mark Attendance 📝
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Select a course to mark today's attendance.
      </p>

      {/* Course Selection and Date */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="text-blue-600" />
          <span className="font-semibold text-gray-700">{today}</span>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <label htmlFor="course-select" className="sr-only">
            Select Course
          </label>
          <select
            id="course-select"
            value={selectedCourse}
            onChange={handleCourseChange}
            className="w-full sm:w-48 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Attendance List */}
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
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-4 hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <FaUser className="text-gray-500" />
                <div>
                  <p className="font-semibold text-gray-800">{student.name}</p>
                  <p className="text-sm text-gray-500">ID: {student.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAttendance(student.id)}
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
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
};

export default Attendence;
