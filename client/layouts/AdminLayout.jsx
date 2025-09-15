import React from "react";
import AdminSidebar from "../src/components/SIdebar/AdminSidebar";
import { Outlet } from "react-router-dom";
function AdminLayout() {
  return (
    <div className="flex gap-3">
      <AdminSidebar />
      <ProfileAdmin />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
