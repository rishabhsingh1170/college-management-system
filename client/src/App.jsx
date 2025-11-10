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
import NotificationAdmin from "./pages/admin/NotificationAdmin";
import StudentList from "./pages/admin/StudentList";
import FacultyList from "./pages/admin/FacultyList";
import LibraryDetails from "./pages/admin/LibraryDetails";
import SupportAdmin from "./pages/admin/SupportAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* admin dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="notification" element={<NotificationAdmin />} />
          <Route path="student-list" element={<StudentList />} />
          <Route path="faculty-list" element={<FacultyList />} />
          <Route path="library" element={<LibraryDetails />} />
          <Route path="support" element={<SupportAdmin />} />
        </Route>

        {/* faculty dashboard */}
        <Route path="/faculty" element={<FacultyLayout />}>
          <Route path="profile" element={<ProfileFact />} />
          <Route path="notification" element={<NotificationFact />} />
          <Route path="salary" element={<Salary />} />
          <Route path="cources" element={<Cources />} />
          <Route path="timetable" element={<TimeTable />} />
          <Route path="attendence" element={<Attendence />} />
        </Route>

        {/* User Dashboard */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="profile" element={<ProfileUser />} />
          <Route path="notification" element={<NotificationUser />} />
          <Route path="results" element={<ResultUser />} />
          <Route path="admission" element={<AdmissionUser />} />
          <Route path="help" element={<HelpUser />} />
        </Route>

        {/* not found page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
