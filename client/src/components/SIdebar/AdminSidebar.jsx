import React, { useState } from "react";
import { Link } from "react-router-dom";
import icon from "/student.jpg";
function AdminSidebar() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="hidden md:flex flex-col sm:w-xl/2 bg-slate-50 min-h-screen justify-start items-center p-8">
      <div className="p-8 w-full flex flex-col gap-3 text-center justify-center items-center">
        <img
          alt="Image of The User"
          src={icon}
          width={100}
          height={100}
          className=""
        />
        <h1 className="text-xl font-semibold">Admin Name</h1>
      </div>
      <ul className="w-full flex flex-col gap-6 text-start p-5 pt-8">
        <Link
          to="/admin/notification"
          onClick={() => setSelected(0)}
          className={`${
            selected == 0 ? "bg-slate-300" : ""
          } border p-2 rounded-md text-[16px] pl-6 border-white hover:bg-slate-100  hover:border-gray-500`}
        >
          Notification
        </Link>
        <Link
          to="/admin/student-list"
          onClick={() => setSelected(5)}
          className={`${
            selected == 5 ? "bg-slate-300" : ""
          } border p-2 rounded-md text-[16px] pl-6  border-white hover:bg-slate-100  hover:border-gray-500`}
        >
          Student List
        </Link>
        <Link
          to="/admin/faculty-list"
          onClick={() => setSelected(1)}
          className={`${
            selected == 1 ? "bg-slate-300" : ""
          } border p-2 rounded-md text-[16px] pl-6 border-white hover:bg-slate-100  hover:border-gray-500`}
        >
          Faculty List
        </Link>
        <Link
          to="/admin/library"
          onClick={() => setSelected(2)}
          className={`${
            selected == 2 ? "bg-slate-300" : ""
          } border p-2 rounded-md text-[16px] pl-6 border-white hover:bg-slate-100  hover:border-gray-500`}
        >
          Library
        </Link>
        <Link
          to="/admin/support"
          onClick={() => setSelected(3)}
          className={`${
            selected == 3 ? "bg-slate-300" : ""
          } border p-2 rounded-md text-[16px] pl-6  border-white hover:bg-slate-100  hover:border-gray-500`}
        >
          Support & Help
        </Link>
      </ul>
    </div>
  );
}

export default AdminSidebar;
