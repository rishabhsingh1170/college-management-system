import React, { useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
  FaGraduationCap,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

// Mock data for multi-semester student results
const studentSemesters = [
  {
    semester: "Semester 1",
    summary: {
      sgpa: 8.5,
      cgpa: 8.5,
      creditsEarned: 21,
      totalCredits: 21,
    },
    courses: [
      { course: "Physics", grade: "A", status: "Passed", credits: 4 },
      { course: "Chemistry", grade: "A-", status: "Passed", credits: 4 },
      { course: "Mathematics I", grade: "B+", status: "Passed", credits: 4 },
      {
        course: "Introduction to Programming",
        grade: "A",
        status: "Passed",
        credits: 3,
      },
      { course: "English", grade: "A", status: "Passed", credits: 3 },
      {
        course: "Engineering Graphics",
        grade: "B",
        status: "Passed",
        credits: 3,
      },
    ],
  },
  {
    semester: "Semester 2",
    summary: {
      sgpa: 7.8,
      cgpa: 8.15,
      creditsEarned: 20,
      totalCredits: 21,
    },
    courses: [
      { course: "Data Structures", grade: "B", status: "Passed", credits: 4 },
      { course: "Algorithm Design", grade: "B+", status: "Passed", credits: 4 },
      { course: "Mathematics II", grade: "C", status: "Passed", credits: 4 },
      {
        course: "Computer Networks",
        grade: "A-",
        status: "Passed",
        credits: 3,
      },
      { course: "Operating Systems", grade: "F", status: "Failed", credits: 3 },
      { course: "Web Development", grade: "A", status: "Passed", credits: 3 },
    ],
  },
];

const ResultUser = () => {
  const [openSemester, setOpenSemester] = useState(null); // State to track which semester is open

  const handleToggle = (semesterIndex) => {
    setOpenSemester(openSemester === semesterIndex ? null : semesterIndex);
  };

  return (
    <div
      className="p-6 md:p-8 bg-white rounded-xl shadow-lg"
      data-aos="fade-up"
    >
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
        My Academic Results 🎓
      </h2>

      {studentSemesters.map((semesterData, semesterIndex) => (
        <div key={semesterIndex} className="mb-6">
          {/* Clickable Semester Summary Card */}
          <div
            onClick={() => handleToggle(semesterIndex)}
            className="flex items-center justify-between p-6 bg-blue-100 text-blue-800 rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:bg-blue-200 transform hover:scale-[1.01]"
            data-aos="fade-up"
            data-aos-delay={semesterIndex * 100}
          >
            <div className="flex items-center space-x-4">
              <FaGraduationCap className="text-3xl" />
              <h3 className="text-2xl font-bold">{semesterData.semester}</h3>
            </div>
            <div className="flex items-center space-x-6">
              <span className="font-semibold">
                SGPA: {semesterData.summary.sgpa}
              </span>
              <span className="font-semibold">
                CGPA: {semesterData.summary.cgpa}
              </span>
              {openSemester === semesterIndex ? (
                <FaChevronUp className="transition-transform duration-300" />
              ) : (
                <FaChevronDown className="transition-transform duration-300" />
              )}
            </div>
          </div>

          {/* Detailed Course Breakdown (Conditionally rendered) */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              openSemester === semesterIndex
                ? "max-h-screen opacity-100 mt-4"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-gray-50 p-6 rounded-xl shadow-md">
              <h4 className="text-xl font-bold text-gray-800 mb-4">
                Course Breakdown
              </h4>
              <div className="space-y-4">
                {semesterData.courses.map((result, courseIndex) => (
                  <div
                    key={courseIndex}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] ${
                      result.status === "Passed" ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                      {result.status === "Passed" ? (
                        <FaCheckCircle className="text-green-600 text-xl flex-shrink-0" />
                      ) : (
                        <FaTimesCircle className="text-red-600 text-xl flex-shrink-0" />
                      )}
                      <h5 className="text-lg font-semibold text-gray-800">
                        {result.course}
                      </h5>
                    </div>
                    <div className="flex-1 sm:text-right space-x-4 sm:pl-4">
                      <span className="inline-block text-gray-600 font-medium">
                        Grade: {result.grade}
                      </span>
                      <span className="inline-block text-gray-600 font-medium">
                        Credits: {result.credits}
                      </span>
                      <span
                        className={`inline-block font-bold ${
                          result.status === "Passed"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-8 pt-4 border-t-2 border-gray-200">
        <p className="text-center text-gray-500">
          This data is for demonstration purposes. Real-time results will be
          updated automatically.
        </p>
      </div>
    </div>
  );
};

export default ResultUser;
