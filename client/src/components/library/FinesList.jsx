import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function FinesList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finePerDay, setFinePerDay] = useState(10);

  const fetchFines = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/library/fines?finePerDay=${finePerDay}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRecords(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch fines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, [finePerDay]);

  // ✅ Mark fine as paid
  const handleMarkPaid = async (borrowId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/library/fines/${borrowId}/pay`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Fine marked as paid!");
      fetchFines(); // refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark fine paid");
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-gray-600">
        ⏳ Loading fine records...
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-gray-600">
        No fine records found.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">💰 Due Fines</h3>

        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">Fine/Day:</label>
          <input
            type="number"
            min="1"
            className="w-20 p-1 border rounded text-center"
            value={finePerDay}
            onChange={(e) => setFinePerDay(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Book Title</th>
              <th className="p-3 text-left">Borrower</th>
              <th className="p-3 text-left">Borrow Date</th>
              <th className="p-3 text-left">Due Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-right">Fine (₹)</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, index) => (
              <tr
                key={r.borrow_id || index}
                className={`border-t ${
                  r.status === "Overdue"
                    ? "bg-red-50"
                    : r.status === "Returned Late"
                    ? "bg-yellow-50"
                    : ""
                }`}
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3 font-medium">{r.title}</td>
                <td className="p-3">{r.student_name || "—"}</td>
                <td className="p-3">{r.borrow_date?.slice(0, 10)}</td>
                <td className="p-3">{r.due_date}</td>
                <td
                  className={`p-3 font-semibold ${
                    r.status === "Overdue"
                      ? "text-red-600"
                      : r.status === "Returned Late"
                      ? "text-yellow-700"
                      : "text-green-700"
                  }`}
                >
                  {r.status}
                </td>
                <td className="p-3">
                  {r.fine_paid ? (
                    <span className="text-green-600 font-semibold">Paid</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Due</span>
                  )}
                </td>
                <td className="p-3 text-right font-semibold">₹{r.fine}</td>
                <td className="p-3 text-right">
                  {!r.fine_paid && (
                    <button
                      onClick={() => handleMarkPaid(r.borrower_id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
