import React from "react";
import { FaBullhorn, FaCalendarAlt, FaExclamationCircle } from "react-icons/fa";

// Mock data for faculty notifications
const facultyNotifications = [
  {
    id: 1,
    type: "announcement",
    title: "New faculty meeting scheduled",
    message:
      "A mandatory meeting for all faculty members will be held on Friday at 3 PM in the main conference hall.",
    date: "2025-09-17",
  },
  {
    id: 2,
    type: "reminder",
    title: "Grade submission deadline approaching",
    message:
      "Please submit the final grades for all courses by 25th September.",
    date: "2025-09-16",
  },
  {
    id: 3,
    type: "alert",
    title: "Urgent: Server maintenance tomorrow",
    message:
      "The online portal will be down for maintenance from 6 AM to 8 AM on 18th September.",
    date: "2025-09-16",
  },
  {
    id: 4,
    type: "announcement",
    title: "Curriculum review board meeting",
    message:
      "The curriculum review board will meet to discuss the new academic year's syllabus on 20th September.",
    date: "2025-09-15",
  },
];

const NotificationFact = () => {
  const getIconAndColor = (type) => {
    switch (type) {
      case "announcement":
        return { icon: <FaBullhorn />, color: "text-blue-500" };
      case "reminder":
        return { icon: <FaCalendarAlt />, color: "text-yellow-500" };
      case "alert":
        return { icon: <FaExclamationCircle />, color: "text-red-500" };
      default:
        return { icon: null, color: "" };
    }
  };

  return (
    <div
      className="p-6 md:p-8 bg-white rounded-xl shadow-lg"
      data-aos="fade-up"
    >
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
        Faculty Notifications 🔔
      </h2>

      <div className="space-y-4">
        {facultyNotifications.map((notification) => {
          const { icon, color } = getIconAndColor(notification.type);
          return (
            <div
              key={notification.id}
              className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <div className={`flex-shrink-0 mt-1 ${color}`}>{icon}</div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {notification.date}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationFact;
