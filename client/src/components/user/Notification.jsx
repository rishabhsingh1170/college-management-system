import React from "react";
import { FaBullhorn, FaCalendarAlt, FaExclamationCircle } from "react-icons/fa";

// Mock data for notifications
const notifications = [
  {
    id: 1,
    type: "announcement",
    title: "Semester registration is now open.",
    message:
      "All students are requested to complete their course registration for the new semester by the deadline.",
    date: "2025-09-17",
  },
  {
    id: 2,
    type: "reminder",
    title: "Fee payment deadline approaching.",
    message: "A reminder that the last date for fee payment is 25th September.",
    date: "2025-09-16",
  },
  {
    id: 3,
    type: "alert",
    title: "Urgent: Library maintenance.",
    message:
      "The main library will be closed for maintenance on 18th September.",
    date: "2025-09-15",
  },
  {
    id: 4,
    type: "announcement",
    title: "New courses added to curriculum.",
    message:
      "Explore new courses on AI and Machine Learning now available for registration.",
    date: "2025-09-14",
  },
];

const NotificationUser = () => {
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
        Notifications 🔔
      </h2>

      <div className="space-y-4">
        {notifications.map((notification) => {
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

export default NotificationUser;
