import { BrowserRouter, Routes, Route } from "react-router-dom";

//layouts
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import FacultyLayout from "../layouts/FacultyLayour";

//Faculty Page
import ProfileFact from "./pages/faculty/Profile";
import NotificationFact from "./pages/faculty/Notification";
import Salary from "./pages/faculty/Salary";
import Cources from "./pages/faculty/Cources";
import TimeTable from "./pages/faculty/TimeTable";
import Attendence from "./pages/faculty/Attendence";

//user page
import ProfileUser from "./pages/user/Profile";
import ResultUser from "./pages/user/Result";
import AdmissionUser from "./pages/user/Admission";
import NotificationUser from "./pages/user/Notification";
import HelpUser from "./pages/user/Help";

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
