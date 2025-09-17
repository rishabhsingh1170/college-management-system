import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import toast, { Toaster } from "react-hot-toast";

//layouts
import AdminLayout from "../src/pages/AdminLayout";
import UserLayout from "../src/pages/UserLayout";
import FacultyLayout from "../src/pages/FacultyLayour";

//Faculty Page
import ProfileFact from "./components/faculty/ProfileFact";
import NotificationFact from "./components/faculty/NotificationFact";
import Salary from "./components/faculty/Salary";
import Cources from "./components/faculty/Cources";
import TimeTable from "./components/faculty/TimeTable";
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
import Home from "./pages/Home";
import MobileMenu from "./components/common/MobileMenu"; // Corrected import path
import ForgotPassword from "./pages/ForgetPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";

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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route path="notification" element={<NotificationAdmin />} />
              <Route path="student-list" element={<StudentList />} />
              <Route path="student-details" element={<StudentDetails />} />
              <Route path="faculty-list" element={<FacultyList />} />
              <Route path="library" element={<LibraryDetails />} />
              <Route path="support" element={<SupportAdmin />} />
            </Route>

            <Route path="/faculty" element={<FacultyLayout />}>
              <Route path="profile" element={<ProfileFact />} />
              <Route path="notification" element={<NotificationFact />} />
              <Route path="salary" element={<Salary />} />
              <Route path="cources" element={<Cources />} />
              <Route path="timetable" element={<TimeTable />} />
              <Route path="attendence" element={<Attendence />} />
            </Route>

            <Route path="/user" element={<UserLayout />}>
              <Route path="profile" element={<ProfileUser />} />
              <Route path="notification" element={<NotificationUser />} />
              <Route path="results" element={<ResultUser />} />
              <Route path="admission" element={<AdmissionUser />} />
              <Route path="help" element={<HelpUser />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
