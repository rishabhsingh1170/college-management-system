import React from "react";
import { Outlet } from "react-router-dom";
import FactSidebar from "../src/components/SIdebar/FacultySidebar";
import Profile from "../src/pages/faculty/Profile";

function FacultyLayout() {
  return (
    <div className="flex gap-4">
      <FactSidebar />
      <Profile />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}

export default FacultyLayout;
