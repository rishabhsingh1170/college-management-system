import React, { useState, useEffect, useCallback } from "react";
// Import the centralized getRequest helper
import { getRequest } from "../../api/api";
import toast from "react-hot-toast";
import FeePayment from "./Payment";

// Utility to handle API response safely
const extractData = (response) => response.data?.data || response.data || [];

// --- API Fetching Functions (Now using getRequest) ---

// Fetch student's fee details
const fetchFeesData = async () => {
  // Corrected to use getRequest
  const response = await getRequest("/student/get-fees-details");
  const data = extractData(response);
  return Array.isArray(data) ? data : [];
};

// Fetch student's profile
const fetchStudentProfile = async () => {
  // Corrected to use getRequest
  const response = await getRequest("/student/profile");
  const data = extractData(response);
  return data || {};
};

const StudentFeesPage = () => {
  const [feesData, setFeesData] = useState([]);
  const [studentInfo, setStudentInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all required data (fees + student info)
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Using centralized functions, removing manual token handling
      const [fees, profile] = await Promise.all([
        fetchFeesData(),
        fetchStudentProfile(),
      ]);

      if (fees.length === 0) {
        console.warn("Fee data returned empty array. Check database.");
      }

      setFeesData(fees);
      setStudentInfo(profile);
    } catch (err) {
      console.error("Error fetching fee or profile data:", err);
      const errorMessage =
        err.response?.status === 401
          ? "Unauthorized: Please log in again."
          : err.response?.data?.message ||
            "Failed to load data. Check backend console and Network tab.";
      setError(errorMessage);
      setFeesData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const refreshFees = () => {
    fetchAllData();
  };

  // -------------------
  // UI Render Section
  // -------------------

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-medium text-indigo-600 animate-pulse">
          Loading Fee Details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-lg mx-auto mt-10 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2">Data Load Error</h2>
        <p>{error}</p>
        <p className="mt-2 text-sm">
          Please ensure the student is logged in and the backend API is
          accessible.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 border-b-2 pb-2">
        📚 Student Fees Overview
      </h1>

      {feesData.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl mt-10">
          <p className="text-lg font-medium text-gray-600">
            No active fee records found.
          </p>
          {studentInfo.name && (
            <p className="text-sm text-gray-400 mt-2">
              Profile loaded for: {studentInfo.name}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {feesData.map((fee) => {
            const dueAmount = fee.amount - (fee.paid_amount || 0);

            const statusColor =
              dueAmount > 0
                ? fee.status === "Partial"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-red-500 bg-red-50"
                : "border-green-500 bg-green-50";

            return (
              <div
                key={fee.fee_id}
                className={`p-5 rounded-xl border-l-4 shadow-lg transition duration-300 hover:shadow-xl ${statusColor}`}
              >
                {/* --- Fee Details --- */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {fee.fee_type || "General"} Fee (Semester {fee.sem_id})
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <p>
                    <span className="font-semibold">Total:</span> ₹
                    {Number(fee.amount || 0).toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">Paid:</span> ₹
                    {Number(fee.paid_amount || 0).toFixed(2)}
                  </p>

                  <p>
                    <span className="font-semibold">Due Date:</span>{" "}
                    {fee.due_date || "N/A"}
                  </p>
                  <p className="font-semibold">
                    Status:
                    <span
                      className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                        fee.status === "Paid"
                          ? "bg-green-200 text-green-800"
                          : fee.status === "Unpaid"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {fee.status}
                    </span>
                  </p>
                </div>

                {/* --- Razorpay Payment Component --- */}
                {/* The actual FeePayment component is omitted here, but this is where it would be used */}
                <div className="mt-4">
                  <FeePayment feeDetails={fee} onPaymentSuccess={refreshFees} studentInfo={studentInfo} />
                  {dueAmount > 0 ? (
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">
                      Pay Remaining ₹{dueAmount.toFixed(2)}
                    </button>
                  ) : (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold opacity-70 cursor-default">
                      Fully Paid
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentFeesPage;
