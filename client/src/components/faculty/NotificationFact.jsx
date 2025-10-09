import React, { useEffect, useState } from "react";
import { FaBullhorn, FaCalendarAlt, FaExclamationCircle } from "react-icons/fa";
import { getRequest } from "../../api/api";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

const NotificationFact = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        toast.loading("Fetching notifications...", {
          id: "notification-fetch",
        });
        const response = await getRequest("/auth/notifications");
        setNotifications(response.data);
        toast.dismiss("notification-fetch");
        toast.success("Notifications loaded!");
      } catch (err) {
        setError("Failed to fetch notifications.");
        console.error("API Error:", err);
        toast.dismiss("notification-fetch");
        toast.error("Error fetching notifications.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

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

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading notifications...
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 md:p-8 bg-white rounded-xl shadow-lg animate-fadeInUp">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
        Faculty Notifications 🔔
      </h2>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 p-8">
            No new notifications.
          </div>
        ) : (
          notifications.map((notification) => {
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
                  <p className="text-sm text-gray-600">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {notification.date}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationFact;
