import React, { useState } from "react";
import { Link } from "react-router-dom";
import icon from "../../assets/student.jpg";

function FactSidebar() {
  const [selected, setSelected] = useState(0);
  return (
    <div className=" hidden md:flex flex-col sm:w-xl/2 bg-slate-50 min-h-screen justify-start items-center p-8">
      <div className="p-8 w-full flex flex-col gap-3 text-center justify-center items-center">
        <img
          alt="Image of The User"
          src={icon}
          width={100}
          height={100}
          className=""
        />
        <h1 className="text-xl font-semibold">Dr. Faculty Name</h1>
      </div>
      <ul className="w-full flex flex-col gap-6 text-start p-5 pt-8">
        <Link
          to="/faculty/profile"
          onClick={() => setSelected(0)}
          className={`${
            selected == 0 ? "bg-slate-300" : ""
          } border p-2 rounded-md text-[16px] pl-6 border-white hover:bg-slate-100  hover:border-gray-500`}
        >
          Profile
        </Link>
        <Link
          to="/faculty/notification"
          onClick={() => setSelected(5)}
          className={`${
            selected == 5 ? "bg-slate-300" : ""
          } border p-2 rounded-md text-[16px] pl-6  border-white hover:bg-slate-100  hover:border-gray-500`}
        >
          Notification
        </Link>
        <Link
          to="/faculty/salary"
          onClick={() => setSelected(1)}
          className={`${
            selected == 1 ? "bg-slate-300" : ""
          } border p-2 rounded-md text-[16px] pl-6 border-white hover:bg-slate-100  hover:border-gray-500`}
        >
          Salary
        </Link>
        <Link
          to="/faculty/cources"
          onClick={() => setSelected(2)}
          className={`${
            selected == 2 ? "bg-slate-300" : ""
          } border p-2 rounded-md text-[16px] pl-6 border-white hover:bg-slate-100  hover:border-gray-500`}
        >
          Cources
        </Link>
        <Link
          to="/faculty/timetable"
          onClick={() => setSelected(3)}
          className={`${
            selected == 3 ? "bg-slate-300" : ""
          } border p-2 rounded-md text-[16px] pl-6  border-white hover:bg-slate-100  hover:border-gray-500`}
        >
          TimeTable
        </Link>
        <Link
          to="/faculty/attendence"
          onClick={() => setSelected(4)}
          className={`${
            selected == 4 ? "bg-slate-300" : ""
          } border p-2 rounded-md text-[16px] pl-6  border-white hover:bg-slate-100  hover:border-gray-500`}
        >
          Attendence
        </Link>
      </ul>
    </div>
  );
}

export default FactSidebar;
