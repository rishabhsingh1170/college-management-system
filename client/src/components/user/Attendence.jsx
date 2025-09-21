import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaTimesCircle,
  FaPercent,
} from "react-icons/fa";
import { getRequest } from "../../api/api";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

const AttendanceUser = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        toast.loading("Fetching attendance...", { id: "attendance-fetch" });
        const response = await getRequest("/student/get-attendence"); // Correct endpoint from your backend
        setAttendanceData(response.data);
        console.log(response.data);
        if (response.data.length > 0) {
          setSelectedSemester(response.data[0].semester); // Set default semester
        }
        toast.dismiss("attendance-fetch");
        toast.success("Attendance loaded successfully!");
      } catch (err) {
        setError("Failed to fetch attendance data.");
        console.error("API Error:", err);
        toast.dismiss("attendance-fetch");
        toast.error("Error fetching attendance data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };

  const currentSemesterData = attendanceData.find(
    (sem) => sem.semester === selectedSemester
  );

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading attendance...</div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div
      className="p-6 md:p-8 bg-white rounded-xl shadow-lg"
      
    >
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
        My Attendance 📊
      </h2>

      {attendanceData.length > 0 ? (
        <div className="flex items-center space-x-4 mb-6">
          <label
            htmlFor="semester-select"
            className="font-semibold text-gray-700"
          >
            Select Semester:
          </label>
          <select
            id="semester-select"
            value={selectedSemester}
            onChange={handleSemesterChange}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {attendanceData.map((sem, index) => (
              <option key={index} value={sem.semester}>
                {sem.semester}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="text-center text-gray-500 p-8">
          No attendance records found.
        </div>
      )}

      {currentSemesterData ? (
        <div className="space-y-6">
          {currentSemesterData.subjects.map((subject, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-4 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <FaCalendarAlt className="text-blue-500 text-xl" />
                  <h3 className="text-xl font-bold text-gray-800">
                    {subject.subject_name}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <FaPercent
                    className={
                      subject.percentage >= 75
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  />
                  <span
                    className={`font-semibold text-lg ${
                      subject.percentage >= 75
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {subject.percentage.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <FaCheckCircle className="text-green-500" />
                  <span>
                    Present:{" "}
                    <span className="font-semibold">
                      {subject.present_count}
                    </span>
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <FaTimesCircle className="text-red-500" />
                  <span>
                    Absent:{" "}
                    <span className="font-semibold">
                      {subject.absent_count}
                    </span>
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <span>
                    Total Classes:{" "}
                    <span className="font-semibold">
                      {subject.total_classes}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 p-8">
          No attendance records found for this semester.
        </div>
      )}
    </div>
  );
};

export default AttendanceUser;
