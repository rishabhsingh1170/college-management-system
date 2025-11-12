import React, { useEffect, useState } from "react";
import {
  FaBookReader,
  FaClock,
  FaCalendarCheck,
  FaBook,
  FaExclamationTriangle,
} from "react-icons/fa";
import { getRequest } from "../../api/api";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

const LibraryUser = () => {
  const [libraryRecords, setLibraryRecords] = useState({
    current: [],
    history: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. AOS Initialization and Refresh
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, []);

  // 2. Data Fetching Hook
  useEffect(() => {
    const fetchLibraryRecords = async () => {
      try {
        toast.loading("Fetching library records...", { id: "library-fetch" });
        const response = await getRequest("/student/library");
        setLibraryRecords(response.data);
        toast.dismiss("library-fetch");
        toast.success("Library data loaded!");
      } catch (err) {
        setError("Failed to fetch library records.");
        toast.error("Error fetching library data.");
      } finally {
        setLoading(false);
      }
    };
    fetchLibraryRecords();
  }, []); // Empty dependency array ensures this runs only once

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading library records...
      </div>
    );
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div
      className="p-6 md:p-8 bg-white rounded-xl shadow-lg"
      data-aos="fade-up"
    >
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
        My Library Activity 📖
      </h2>

      {/* Currently Borrowed Books */}
      <div className="mb-8" data-aos="fade-right">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-3">
          <FaBookReader className="text-red-500" />
          <span>Currently Borrowed ({libraryRecords.current.length})</span>
        </h3>
        {libraryRecords.current.length === 0 ? (
          <div className="bg-green-50 text-green-800 p-4 rounded-lg shadow-sm">
            You have no books currently checked out.
          </div>
        ) : (
          <div className="space-y-4">
            {libraryRecords.current.map((record, index) => {
              const isOverdue = record.overdue_days > 0;
              return (
                <div
                  key={index}
                  className={`flex justify-between items-center p-4 rounded-lg shadow-md transition-shadow hover:shadow-lg ${
                    isOverdue ? "bg-red-100" : "bg-yellow-50"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {record.book_title}
                    </p>
                    <p className="text-sm text-gray-600">
                      by {record.book_author}
                    </p>
                  </div>
                  <div className="text-right">
                    {isOverdue ? (
                      <p className="text-lg font-bold text-red-600">
                        <FaExclamationTriangle className="inline mr-1" /> Fine:{" "}
                        {formatCurrency(record.fine_amount)}
                      </p>
                    ) : (
                      <p className="text-sm font-medium text-green-600">
                        <FaClock className="inline mr-1" /> Due:{" "}
                        {formatDate(record.due_date)}
                      </p>
                    )}
                    {isOverdue && (
                      <p className="text-xs text-red-700">
                        Overdue by {record.overdue_days} days
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Borrowed: {formatDate(record.borrow_date)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Borrowing History */}
      <div className="pt-6 border-t border-gray-200" data-aos="fade-left">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-3">
          <FaCalendarCheck className="text-blue-500" />
          <span>Borrowing History ({libraryRecords.history.length})</span>
        </h3>
        <div className="overflow-x-auto bg-gray-50 rounded-xl shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrowed Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Returned Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {libraryRecords.history.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 p-4">
                    No borrowing history found.
                  </td>
                </tr>
              ) : (
                libraryRecords.history.map((record, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.book_title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.book_author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(record.borrow_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                      {formatDate(record.return_date)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LibraryUser;
