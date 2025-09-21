import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
  FaGraduationCap,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { getRequest } from "../../api/api";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

const ResultUser = () => {
  const [studentSemesters, setStudentSemesters] = useState([]);
  const [openSemester, setOpenSemester] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleToggle = (semesterIndex) => {
    setOpenSemester(openSemester === semesterIndex ? null : semesterIndex);
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        toast.loading("Fetching results...", { id: "results-fetch" });
        const response = await getRequest("/student/results");
        setStudentSemesters(response.data);
        toast.dismiss("results-fetch");
        toast.success("Results loaded successfully!");
      } catch (err) {
        setError("Failed to fetch results.");
        console.error("API Error:", err);
        toast.dismiss("results-fetch");
        toast.error("Error fetching results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading results...</div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div
      className="p-6 md:p-8 bg-white rounded-xl shadow-lg"
      data-aos="fade-up"
    >
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
        My Academic Results 🎓
      </h2>

      {studentSemesters.length === 0 ? (
        <div className="text-center text-gray-500 p-8">No results found.</div>
      ) : (
        studentSemesters.map((semesterData, semesterIndex) => (
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
                  SGPA: {semesterData.summary.sgpa || "N/A"}
                </span>
                <span className="font-semibold">
                  CGPA: {semesterData.summary.cgpa || "N/A"}
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
                          Credits: {result.credits || "N/A"}
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
        ))
      )}

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
