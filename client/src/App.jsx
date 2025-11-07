import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import toast, { Toaster } from "react-hot-toast";
import {
  FaUserCircle,
  FaBell,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaHeadset,
  FaClipboardList,
  FaAddressCard,
  FaQuestionCircle,
  FaDollarSign,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

//layouts
import DashboardLayout from "./pages/DashboardLayout";

//Faculty Page
import ProfileFact from "./components/faculty/ProfileFact";
import NotificationFact from "./components/faculty/NotificationFact";
import Salary from "./components/faculty/Salary";
import Cources from "./components/faculty/Cources";
import Attendence from "./components/faculty/Attendence";

//user page
import ProfileUser from "./components/user/ProfileUser";
import ResultUser from "./components/user/Result";
import AdmissionUser from "./components/user/Admission";
import NotificationUser from "./components/user/Notification";
import HelpUser from "./components/user/Help";

//not found
import NotFound from "./pages/NotFound";
import NotificationAdmin from "./components/admin/NotificationAdmin";
import StudentList from "./components/admin/StudentList";
import StudentDetails from "./components/admin/StudentDetails";
import FacultyList from "./components/admin/FacultyList";
import LibraryDetails from "./components/admin/LibraryDetails";
import SupportAdmin from "./components/admin/SupportAdmin";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import Home from "./pages/Home";
import MobileMenu from "./components/common/MobileMenu";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Attendance from "./components/user/Attendence";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from './pages/ResetPassword'

//Library

import AdminLayout from "./pages/AdminLayout";
import Library from "./pages/Admin/Library";



function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const adminNavItems = [
    { name: "Profile", path: "profile", icon: FaUserCircle },
    { name: "Notifications", path: "notification", icon: FaBell },
    { name: "Students", path: "student-list", icon: FaUserGraduate },
    { name: "Faculty", path: "faculty-list", icon: FaChalkboardTeacher },
    { name: "Library", path: "library", icon: FaBook },
    { name: "Support", path: "support", icon: FaHeadset },
  ];

  const userNavItems = [
    { name: "Profile", path: "profile", icon: FaUserCircle },
    { name: "Notifications", path: "notification", icon: FaBell },
    { name: "Track Attendence", path: "get-attendance", icon: FaCalendarAlt },
    { name: "Results", path: "results", icon: FaClipboardList },
    // { name: "Admission", path: "admission", icon: FaAddressCard },
    { name: "Fees", path: "fees", icon: FaDollarSign },
    { name: "Help", path: "help", icon: FaQuestionCircle },
  ];

  const facultyNavItems = [
    { name: "Profile", path: "profile", icon: FaUserCircle },
    { name: "Notifications", path: "notification", icon: FaBell },
    { name: "Salary", path: "salary", icon: FaDollarSign },
    { name: "Courses", path: "cources", icon: FaBook },
    { name: "Attendance", path: "attendence", icon: FaCheckCircle },
  ];

  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <div className="min-h-screen font-sans antialiased text-gray-800 overflow-x-hidden">
          <MobileMenu
            isOpen={isMobileMenuOpen}
            toggleMenu={toggleMobileMenu}
            scrollToSection={scrollToSection}
          />

          <Routes>
            <Route
              path="/"
              element={
                <Home
                  toggleMobileMenu={toggleMobileMenu}
                  scrollToSection={scrollToSection}
                />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="forgot-password" element={<ForgetPassword />} />
            <Route path="verify-otp" element={<VerifyOTP />} />
            <Route path="reset-password" element = {<ResetPassword/>}/>

            <Route element={<ProtectedRoute />}>
              {/* Admin Dashboard */}
              <Route
                path="/admin"
                element={
                  <DashboardLayout userType="admin" navItems={adminNavItems} />
                }
              >
                <Route path="profile" element={<ProfileFact />} />
                <Route path="notification" element={<NotificationAdmin />} />
                <Route path="student-list" element={<StudentList />} />
                <Route path="student-details" element={<StudentDetails />} />
                <Route path="faculty-list" element={<FacultyList />} />
                <Route path="library" element={<Library />} />
                <Route path="support" element={<SupportAdmin />} />

              </Route>

              {/* Faculty Dashboard */}
              <Route
                path="/faculty"
                element={
                  <DashboardLayout
                    userType="faculty"
                    navItems={facultyNavItems}
                  />
                }
              >
                <Route path="profile" element={<ProfileFact />} />
                <Route path="notification" element={<NotificationFact />} />
                <Route path="salary" element={<Salary />} />
                <Route path="cources" element={<Cources />} />
                <Route path="attendence" element={<Attendence />} />
              </Route>

              {/* User Dashboard */}
              <Route
                path="/user"
                element={
                  <DashboardLayout userType="student" navItems={userNavItems} />
                }
              >
                <Route path="profile" element={<ProfileUser />} />
                <Route path="notification" element={<NotificationUser />} />
                <Route path="get-attendance" element={<Attendance />} />
                <Route path="results" element={<ResultUser />} />
                <Route path="admission" element={<AdmissionUser />} />
                <Route path="help" element={<HelpUser />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />


          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
