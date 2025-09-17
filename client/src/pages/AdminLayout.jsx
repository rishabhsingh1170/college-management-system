import React from "react";
import DashboardLayout from "./DashboardLayout";
import {
  FaUser,
  FaUsers,
  FaGraduationCap,
  FaBook,
  FaHeadset,
  FaBell,
  FaUserGraduate,
  FaChalkboardTeacher,
} from "react-icons/fa";

const adminNavItems = [
  { name: "Notifications", path: "/admin/notification", icon: FaBell },
  { name: "Students", path: "/admin/student-list", icon: FaUserGraduate },
  { name: "Faculty", path: "/admin/faculty-list", icon: FaChalkboardTeacher },
  { name: "Library", path: "/admin/library", icon: FaBook },
  { name: "Support", path: "/admin/support", icon: FaHeadset },
];

const AdminLayout = () => {
  return <DashboardLayout userType="admin" navItems={adminNavItems} />;
};

export default AdminLayout;
