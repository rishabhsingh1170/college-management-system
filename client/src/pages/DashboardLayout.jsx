import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaBell,
  FaSignOutAlt,
  FaHome,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const DashboardLayout = ({ userType, navItems }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // This is the new logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // 1. Clear the token
    navigate("/login"); // 2. Navigate to the login page
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 text-gray-800 text-2xl"
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 w-64 bg-gray-900 text-white flex flex-col p-4 shadow-2xl transition-transform duration-300 z-40`}
      >
        <div className="flex items-center space-x-2 mb-8 mt-2 md:mt-0">
          <FaHome className="text-2xl text-blue-500" />
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  <item.icon className="text-xl text-blue-400" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 w-full rounded-lg text-red-400 hover:bg-red-900 transition-colors duration-200"
          >
            <FaSignOutAlt className="text-xl" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto">
        <header className="flex items-center justify-between p-4 bg-white shadow-md md:pl-80">
          <div className=""></div>
          <h2 className="text-xl md:text-2xl lg:-ml-40 font-semibold text-gray-800 capitalize">
            {userType} Dashboard
          </h2>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
              <FaBell className="text-2xl" />
            </button>
            <button className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
              <FaUserCircle className="text-2xl" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
