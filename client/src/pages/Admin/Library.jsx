import { useState } from "react";
import AddBook from "../../components/library/AddBook";
import BooksList from "../../components/library/BooksList";
import FinesList from "../../components/library/FinesList"; // ✅

export default function Library() {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-4">📚 Library Management</h2>

      <div className="flex gap-6 border-b mb-6">
        <button
          onClick={() => setActiveTab("add")}
          className={`pb-2 font-medium ${
            activeTab === "add"
              ? "text-blue-600 border-b-4 border-blue-600"
              : "text-gray-500"
          }`}
        >
          ➕ Add Book
        </button>

        <button
          onClick={() => setActiveTab("list")}
          className={`pb-2 font-medium ${
            activeTab === "list"
              ? "text-blue-600 border-b-4 border-blue-600"
              : "text-gray-500"
          }`}
        >
          📖 Books List
        </button>

        <button
          onClick={() => setActiveTab("fines")}
          className={`pb-2 font-medium ${
            activeTab === "fines"
              ? "text-blue-600 border-b-4 border-blue-600"
              : "text-gray-500"
          }`}
        >
          💰 Due Fines
        </button>
      </div>

      {activeTab === "add" && <AddBook />}
      {activeTab === "list" && <BooksList />}
      {activeTab === "fines" && <FinesList />}
    </div>
  );
}
