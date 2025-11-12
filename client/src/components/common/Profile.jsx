import React, { useEffect, useState } from "react";
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
import { getRequest } from "../../api/api";
import toast from "react-hot-toast";
import AOS from "aos";

// We'll use this data for properties the API doesn't return
const defaultProfiles = {
  student: {
    photo:
      "https://tse2.mm.bing.net/th/id/OIP.bunDCjSjB6yognR-L7SpQgHaHa?pid=Api&P=0&h=180",
    role: "Student",
    year: "3rd Year",
    id: "N/A",
    name: "N/A",
    email: "N/A",
    phone: "N/A",
    dateOfBirth: "N/A",
    department: "N/A",
    course: "N/A",
  },
  faculty: {
    photo:
      "https://tse2.mm.bing.net/th/id/OIP.bunDCjSjB6yognR-L7SpQgHaHa?pid=Api&P=0&h=180",
    role: "Professor",
    specialization: "N/A",
    joiningDate: "N/A",
    id: "N/A",
    name: "N/A",
    email: "N/A",
    phone: "N/A",
    dateOfBirth: "N/A",
    department: "N/A",
  },
  admin: {
    photo:
      "https://tse2.mm.bing.net/th/id/OIP.bunDCjSjB6yognR-L7SpQgHaHa?pid=Api&P=0&h=180",
    role: "Administrator",
    position: "N/A",
    department: "N/A",
    joiningDate: "N/A",
    id: "N/A",
    name: "N/A",
    email: "N/A",
    phone: "N/A",
    dateOfBirth: "N/A",
  },
};

const Profile = ({ userType }) => {
  const [user, setUser] = useState(defaultProfiles[userType]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // This hook forces AOS to refresh, which is the fix
  useEffect(() => {
    AOS.refresh();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      let endpoint = "";
      if (userType === "student") {
        endpoint = "/student/profile";
      } else if (userType === "faculty") {
        endpoint = "/faculty/profile";
      } else if (userType === "admin") {
        endpoint = "/faculty/profile";
      }

      if (!endpoint) {
        setError("Invalid user type.");
        setLoading(false);
        return;
      }

      try {
        toast.loading("Fetching profile data...", { id: "profile-fetch" });
        const response = await getRequest(endpoint);

        // This is the key change: merge the fetched data with the default data
        const combinedUser = { ...defaultProfiles[userType], ...response.data };
        setUser(combinedUser);

        toast.dismiss("profile-fetch");
        toast.success("Profile data loaded successfully!");
      } catch (err) {
        setError("Failed to fetch profile data.");
        console.error("API Error:", err);
        toast.error("Error fetching profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userType]);

  // Handle loading and error states first
  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading profile...</div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  // Helper function to format the date
  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN");
  };

  return (
    <div className="p-6 md:p-8 bg-white rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-[1.01] max-w-4xl mx-auto animate-fadeInUp">
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
            <span>Date of Birth: {formatDate(user.dateOfBirth)}</span>
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
              {/* <div className="flex items-center space-x-3 text-gray-700">
                <FaCalendarAlt className="text-blue-500" />
                <span>Joining Date: {user.joiningDate}</span>
              </div> */}
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
