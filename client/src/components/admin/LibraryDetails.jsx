import React, { useEffect, useState } from "react";
import {
  FaBook,
  FaListUl,
  FaExchangeAlt,
  FaDollarSign,
  FaPlus,
  FaSave,
} from "react-icons/fa";
import { getRequest, postRequest } from "../../api/api";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

const LibraryDetails = () => {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("allBooks"); // 'allBooks', 'borrowed', 'fines', 'addBook'
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "",
    available_copies: 1,
  });
  const [loadingForm, setLoadingForm] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, [activeView]);

  const fetchBooks = async () => {
    try {
      const response = await getRequest("/admin/books");
      setBooks(response.data);
    } catch (err) {
      setError("Failed to fetch books.");
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      const response = await getRequest("/admin/books/borrowed");
      setBorrowedBooks(response.data);
    } catch (err) {
      setError("Failed to fetch borrowed books.");
    }
  };

  const fetchFines = async () => {
    try {
      const response = await getRequest("/admin/books/fines");
      setFines(response.data);
    } catch (err) {
      setError("Failed to fetch fines.");
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchBooks(), fetchBorrowedBooks(), fetchFines()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    try {
      await postRequest("/admin/books/add", newBook);
      toast.success("Book added successfully!");
      setNewBook({ title: "", author: "", category: "", available_copies: 1 });
      setActiveView("allBooks");
      fetchAllData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add book.");
    } finally {
      setLoadingForm(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading library data...
      </div>
    );
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const renderCurrentView = () => {
    if (activeView === "addBook") {
      return (
        <div
          data-aos="fade-up"
          className="max-w-xl mx-auto p-6 bg-gray-50 rounded-xl shadow-md"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <FaPlus />
            <span>Add New Book</span>
          </h3>
          <form onSubmit={handleBookSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              value={newBook.title}
              onChange={(e) =>
                setNewBook({ ...newBook, title: e.target.value })
              }
              placeholder="Title"
              required
              className="w-full p-3 border rounded-md"
            />
            <input
              type="text"
              name="author"
              value={newBook.author}
              onChange={(e) =>
                setNewBook({ ...newBook, author: e.target.value })
              }
              placeholder="Author"
              required
              className="w-full p-3 border rounded-md"
            />
            <input
              type="text"
              name="category"
              value={newBook.category}
              onChange={(e) =>
                setNewBook({ ...newBook, category: e.target.value })
              }
              placeholder="Category"
              required
              className="w-full p-3 border rounded-md"
            />
            <div className="flex items-center space-x-3">
              <label htmlFor="copies" className="font-semibold text-gray-700">
                Copies:
              </label>
              <input
                type="number"
                id="copies"
                name="available_copies"
                value={newBook.available_copies}
                onChange={(e) =>
                  setNewBook({
                    ...newBook,
                    available_copies: parseInt(e.target.value) || 0,
                  })
                }
                min="1"
                required
                className="w-24 p-3 border rounded-md"
              />
            </div>
            <button
              type="submit"
              disabled={loadingForm}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-md shadow-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              <FaSave />
              <span>{loadingForm ? "Adding..." : "Save Book"}</span>
            </button>
          </form>
        </div>
      );
    }

    // Default Views (All Books, Borrowed, Fines)
    const list =
      activeView === "allBooks"
        ? books
        : activeView === "borrowed"
        ? borrowedBooks
        : fines;
    const isFinesView = activeView === "fines";

    return (
      <div data-aos="fade-up">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {activeView === "allBooks"
            ? "All Books Inventory"
            : activeView === "borrowed"
            ? "Borrowed Books"
            : "Overdue Fines"}
        </h3>
        {list.length === 0 ? (
          <div className="text-center text-gray-500 p-8">No records found.</div>
        ) : (
          <div className="overflow-x-auto bg-gray-50 rounded-xl shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book ID / Borrower ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  {isFinesView && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days Overdue
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {isFinesView ? "Fine Amount" : "Author"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {isFinesView ? "Borrower Type" : "Available Copies"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {list.map((item, index) => (
                  <tr
                    key={item.book_id || index}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.book_id || item.borrower_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.title || item.book_title}
                    </td>

                    {isFinesView && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold">
                        {item.overdue_days}
                      </td>
                    )}

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isFinesView
                        ? formatCurrency(item.fine_amount)
                        : item.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isFinesView ? item.borrower_type : item.available_copies}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="p-6 md:p-8 bg-white rounded-xl shadow-lg"
      data-aos="fade-up"
    >
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
        Library Management 📚
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setActiveView("allBooks")}
          className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold transition-colors duration-200 ${
            activeView === "allBooks"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <FaListUl />
          <span>Inventory</span>
        </button>
        <button
          onClick={() => setActiveView("borrowed")}
          className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold transition-colors duration-200 ${
            activeView === "borrowed"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <FaExchangeAlt />
          <span>Borrowed</span>
        </button>
        <button
          onClick={() => setActiveView("fines")}
          className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold transition-colors duration-200 ${
            activeView === "fines"
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <FaDollarSign />
          <span>Fines</span>
        </button>
        <button
          onClick={() => setActiveView("addBook")}
          className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold transition-colors duration-200 ${
            activeView === "addBook"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <FaPlus />
          <span>Add Book</span>
        </button>
      </div>

      {renderCurrentView()}
    </div>
  );
};

export default LibraryDetails;
