import React from "react";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaHeadset,
  FaBell,
} from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";





const adminNavItems = [
  { name: "Notifications", path: "/admin/notification", icon: FaBell },
  { name: "Students", path: "/admin/student-list", icon: FaUserGraduate },
  { name: "Faculty", path: "/admin/faculty-list", icon: FaChalkboardTeacher },
  { name: "Library", path: "/admin/library", icon: FaBook },
  { name: "Support", path: "/admin/support", icon: FaHeadset },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ✅ Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <h2 className="text-2xl font-semibold mb-6">Admin Panel</h2>

        <nav className="space-y-2">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-blue-50"
                }`
              }
            >
              <item.icon />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ✅ Content Section */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>

    </div>
  );
}
