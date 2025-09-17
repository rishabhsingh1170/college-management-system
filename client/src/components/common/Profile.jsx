import React from "react";
import {
  FaEnvelope,
  FaPhone,
  FaIdBadge,
  FaBirthdayCake,
  FaUserGraduate,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBriefcase,
  FaUserTie,
} from "react-icons/fa";

// Mock data for different user types
const userProfiles = {
  student: {
    photo:
      "https://tse2.mm.bing.net/th/id/OIP.bunDCjSjB6yognR-L7SpQgHaHa?pid=Api&P=0&h=180",
    name: "Aarav Sharma",
    role: "Student",
    id: "S-12345",
    email: "aarav.sharma@example.edu",
    phone: "+91 9876543210",
    dateOfBirth: "15/05/2004",
    department: "Computer Science",
    year: "3rd Year",
    course: "B.Tech",
  },
  faculty: {
    photo:
      "https://tse2.mm.bing.net/th/id/OIP.bunDCjSjB6yognR-L7SpQgHaHa?pid=Api&P=0&h=180",
    name: "Dr. Ananya Singh",
    role: "Professor",
    id: "F-67890",
    email: "ananya.singh@example.edu",
    phone: "+91 9988776655",
    dateOfBirth: "22/10/1980",
    department: "Electronics & Communication",
    specialization: "VLSI Design",
    joiningDate: "05/08/2010",
  },
  admin: {
    photo:
      "https://tse2.mm.bing.net/th/id/OIP.bunDCjSjB6yognR-L7SpQgHaHa?pid=Api&P=0&h=180",
    name: "Mr. Rajeev Kumar",
    role: "Administrator",
    id: "A-54321",
    email: "rajeev.kumar@example.edu",
    phone: "+91 9123456789",
    dateOfBirth: "01/03/1975",
    position: "Registrar",
    department: "Administration",
    joiningDate: "10/01/2005",
  },
};

const Profile = ({ userType }) => {
  const user = userProfiles[userType];

  if (!user) {
    return (
      <div className="p-8 text-center text-red-500">
        User profile not found.
      </div>
    );
  }

  return (
    <div
      className="p-6 md:p-8 bg-white rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-[1.01] max-w-4xl mx-auto"
      data-aos="fade-up"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        {/* Profile Image Section */}
        <div className="flex-shrink-0">
          <img
            src={user.photo}
            alt={`${user.name}'s profile`}
            className="w-40 h-40 object-cover rounded-full shadow-md border-4 border-blue-500/50"
          />
        </div>

        {/* Basic Info Section */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
            {user.name}
          </h2>
          <p className="text-xl font-semibold text-blue-600 mb-4">
            {user.role}
          </p>
        </div>
      </div>

      <div className="mt-8 border-t-2 border-dashed border-gray-200 pt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 text-gray-700">
            <FaIdBadge className="text-blue-500" />
            <span>ID: {user.id}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <FaEnvelope className="text-blue-500" />
            <span>Email: {user.email}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <FaPhone className="text-blue-500" />
            <span>Phone: {user.phone}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <FaBirthdayCake className="text-blue-500" />
            <span>Date of Birth: {user.dateOfBirth}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t-2 border-dashed border-gray-200 pt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {userType === "student" ? "Academic Details" : "Professional Details"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {userType === "student" ? (
            <>
              <div className="flex items-center space-x-3 text-gray-700">
                <FaUserGraduate className="text-blue-500" />
                <span>Course: {user.course}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <FaBuilding className="text-blue-500" />
                <span>Department: {user.department}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <FaCalendarAlt className="text-blue-500" />
                <span>Year: {user.year}</span>
              </div>
            </>
          ) : userType === "faculty" ? (
            <>
              <div className="flex items-center space-x-3 text-gray-700">
                <FaBriefcase className="text-blue-500" />
                <span>Specialization: {user.specialization}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <FaBuilding className="text-blue-500" />
                <span>Department: {user.department}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <FaCalendarAlt className="text-blue-500" />
                <span>Joining Date: {user.joiningDate}</span>
              </div>
            </>
          ) : userType === "admin" ? (
            <>
              <div className="flex items-center space-x-3 text-gray-700">
                <FaUserTie className="text-blue-500" />
                <span>Position: {user.position}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <FaBuilding className="text-blue-500" />
                <span>Department: {user.department}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <FaCalendarAlt className="text-blue-500" />
                <span>Joining Date: {user.joiningDate}</span>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Profile;
