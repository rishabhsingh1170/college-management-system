import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/library/books", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBooks(res.data);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async (book_id) => {
    try {
      await axios.post(`http://localhost:5000/api/library/borrow/${book_id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Book issued!");
      fetchBooks();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to issue book");
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  if (loading) return <div className="bg-white p-6 rounded shadow">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-2xl font-semibold mb-4">📚 Books List</h3>
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Author</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-right">Available</th>
             
            </tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b.book_id} className="border-t">
                <td className="p-3 font-medium">{b.title}</td>
                <td className="p-3">{b.author}</td>
                <td className="p-3">{b.category || "—"}</td>
                <td className="p-3 text-right">{b.available_copies}</td>
                
              
              </tr>
            ))}
            {books.length === 0 && (
              <tr><td className="p-3 text-gray-500" colSpan="5">No books found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
