import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function BooksList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/library/books", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBooks(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-gray-600">
        ⏳ Loading books...
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-gray-600">
        No books found in the library.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4">📚 Books List</h3>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 text-left">Serial No.</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Author</th>
              <th className="p-3 text-left">Category</th>
             
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book.book_id} className="border-t hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3 font-medium">{book.title}</td>
                <td className="p-3">{book.author}</td>
                <td className="p-3">{book.category || "—"}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
