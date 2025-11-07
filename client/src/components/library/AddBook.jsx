import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookData = {
      title,
      author,
      category,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/library/books",
        bookData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("✅ Book Added Successfully!");
      setTitle("");
      setAuthor("");
      setCategory("");

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to Add Book");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <input
        type="text"
        placeholder="Book Title"
        className="w-full p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Author"
        className="w-full p-2 border rounded"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Category"
        className="w-full p-2 border rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        ➕ Add Book
      </button>
    </form>
  );
}
