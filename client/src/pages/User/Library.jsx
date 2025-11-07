import { useState } from "react";
import BrowseBooks from "../../components/library/BrowseBooks";
import MyBorrows from "../../components/library/MyBorrows";

export default function StudentLibrary() {
  const [tab, setTab] = useState("browse");
  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-4">📚 Library</h2>
      <div className="flex gap-6 border-b mb-6">
        <button onClick={() => setTab("browse")} className={`pb-2 ${tab==="browse"?"text-blue-600 border-b-4 border-blue-600":"text-gray-500"}`}>Books</button>
        <button onClick={() => setTab("my")} className={`pb-2 ${tab==="my"?"text-blue-600 border-b-4 border-blue-600":"text-gray-500"}`}>My Borrows</button>
      </div>
      {tab === "browse" ? <BrowseBooks/> : <MyBorrows/>}
    </div>
  );
}
