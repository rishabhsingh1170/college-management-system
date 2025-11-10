import React from "react";
import DashboardLayout from "./DashboardLayout";
import {
  FaUserCircle,
  FaBell,
  FaDollarSign,
  FaBook,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

const facultyNavItems = [
  { name: "Profile", path: "/faculty/profile", icon: FaUserCircle },
  { name: "Notifications", path: "/faculty/notification", icon: FaBell },
  { name: "Salary", path: "/faculty/salary", icon: FaDollarSign },
  { name: "Courses", path: "/faculty/cources", icon: FaBook },
  { name: "TimeTable", path: "/faculty/timetable", icon: FaCalendarAlt },
  { name: "Attendance", path: "/faculty/attendence", icon: FaCheckCircle },
  { name: "Library", path: "library", icon: FaBook },
];

const FacultyLayout = () => {
  return <DashboardLayout userType="faculty" navItems={facultyNavItems} />;
};

export default FacultyLayout;
