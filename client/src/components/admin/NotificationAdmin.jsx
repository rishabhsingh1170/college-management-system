import React from "react";
import { FaBullhorn, FaTools, FaExclamationCircle } from "react-icons/fa";

// Mock data for admin notifications
const adminNotifications = [
  {
    id: 1,
    type: "alert",
    title: "Emergency: Network outage on campus",
    message:
      "The campus network is currently experiencing an outage. The IT team is working on a fix.",
    date: "2025-09-17",
  },
  {
    id: 2,
    type: "announcement",
    title: "Annual report submission deadline",
    message:
      "The deadline to submit the annual departmental reports is 30th September.",
    date: "2025-09-16",
  },
  {
    id: 3,
    type: "alert",
    title: "Security notice: Phishing email warning",
    message:
      "A new phishing campaign has been detected. Please be cautious of suspicious emails.",
    date: "2025-09-15",
  },
  {
    id: 4,
    type: "maintenance",
    title: "System maintenance scheduled",
    message:
      "The student and faculty portals will undergo routine maintenance from 1 AM to 3 AM on 18th September.",
    date: "2025-09-14",
  },
];

const NotificationAdmin = () => {
  const getIconAndColor = (type) => {
    switch (type) {
      case "announcement":
        return { icon: <FaBullhorn />, color: "text-blue-500" };
      case "maintenance":
        return { icon: <FaTools />, color: "text-purple-500" };
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
        Admin Notifications 🔔
      </h2>

      <div className="space-y-4">
        {adminNotifications.map((notification) => {
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

export default NotificationAdmin;
