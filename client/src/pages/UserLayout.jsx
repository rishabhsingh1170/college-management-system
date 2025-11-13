import React from "react";
import DashboardLayout from "./DashboardLayout";
import {
  FaUserCircle,
  FaClipboardList,
  FaAddressCard,
  FaBell,
  FaQuestionCircle,
} from "react-icons/fa";

const userNavItems = [
  { name: "Profile", path: "profile", icon: FaUserCircle },
  { name: "Notifications", path: "notification", icon: FaBell },
  { name: "Track Attendence", path: "get-attendance", icon: FaBell },
  { name: "Results", path: "results", icon: FaClipboardList },
  { name: "Library", path: "library", icon: FaUserCircle },
  { name: "Fees", path: "fees", icon: FaUserCircle },
  { name: "Admission", path: "admission", icon: FaAddressCard },
  { name: "Help", path: "help", icon: FaQuestionCircle },
];

const UserLayout = () => {
  return <DashboardLayout userType="student" navItems={userNavItems} />;
};

export default UserLayout;
