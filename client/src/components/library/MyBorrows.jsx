// client/src/components/library/MyBorrows.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function MyBorrows() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finePerDay, setFinePerDay] = useState(10);

  const fetchRows = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/library/my/borrows?finePerDay=${finePerDay}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // ✅ Ensure rows are always an array
      const result = res.data?.data;
      if (Array.isArray(result)) {
        setRows(result);
      } else {
        console.warn("⚠️ Unexpected API response:", res.data);
        setRows([]);
      }
    } catch (e) {
      console.error("fetchRows error:", e);
      toast.error(e.response?.data?.message || "Failed to load borrows");
      setRows([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (borrow_id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/library/return/${borrow_id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Returned successfully");
      fetchRows();
    } catch (e) {
      toast.error(e.response?.data?.message || "Return failed");
    }
  };

  useEffect(() => {
    fetchRows();
  }, [finePerDay]);

  if (loading)
    return (
      <div className="bg-white p-6 rounded shadow text-center text-gray-600">
        Loading...
      </div>
    );

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between mb-4">
        <h3 className="text-2xl font-semibold">📦 My Issues</h3>
        <div className="flex items-center gap-2">
          <label className="text-sm">Fine/Day:</label>
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
        <table className="w-full border text-sm">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Borrow Date</th>
              <th className="p-3 text-left">Due Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Overdue</th>
              <th className="p-3 text-right">Fine (₹)</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((r) => (
                <tr
                  key={r.borrow_id}
                  className={`border-t ${
                    r.status === "Overdue"
                      ? "bg-red-50"
                      : r.status === "Returned Late"
                      ? "bg-yellow-50"
                      : ""
                  }`}
                >
                  <td className="p-3 font-medium">{r.title}</td>
                  <td className="p-3">
                    {r.borrow_date ? r.borrow_date.slice(0, 10) : "-"}
                  </td>
                  <td className="p-3">{r.due_date || "-"}</td>
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
                    {r.fine_paid ? " (Paid)" : ""}
                  </td>
                  <td className="p-3 text-right">{r.overdueDays || 0}</td>
                  <td className="p-3 text-right font-semibold">
                    ₹{r.fine || 0}
                  </td>
                  <td className="p-3 text-right">
                    {!r.return_date && (
                      <button
                        onClick={() => handleReturn(r.borrow_id)}
                        className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="p-3 text-center text-gray-500 italic"
                >
                  No books borrowed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
