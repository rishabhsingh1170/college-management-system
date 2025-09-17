import React, { useState } from "react";
import { getRequest } from "../../api/api";
import toast from "react-hot-toast";

function StudentDetails() {
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetInfo = async () => {
    if (!studentId) return toast.error("Please enter a student ID");
    setLoading(true);
    setStudent(null);
    try {
      const res = await getRequest(`/v1/student/${studentId}`);
      setStudent(res.data);
      toast.success("Student info loaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Student not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto border-2">
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="Enter Student ID"
          className="border rounded px-3 py-2 w-full"
        />
        <button
          onClick={handleGetInfo}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Info"}
        </button>
      </div>
      {student && (
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-bold mb-2">Student Details</h2>
          {Object.entries(student).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {String(value)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentDetails;
