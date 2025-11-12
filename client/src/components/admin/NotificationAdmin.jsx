import React, { useEffect, useState } from "react";
import {
  FaBullhorn,
  FaCalendarAlt,
  FaExclamationCircle,
  FaPlus,
  FaTools,
  FaBell,
  FaTrash,
  FaUserGraduate,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { getRequest, postRequest, deleteRequest } from "../../api/api";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

const NotificationAdmin = () => {
  const [notifications, setNotifications] = useState({
    studentNotifications: [],
    facultyNotifications: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    user_type: "student",
  });
  const [loadingForm, setLoadingForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Corrected endpoint for fetching notifications (assuming /v1/notifications or similar)
      const response = await getRequest("/auth/notifications");
      setNotifications(response.data);
    } catch (err) {
      setError("Failed to fetch notifications.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    toast.loading("Fetching notifications...", { id: "notification-fetch" });
    fetchNotifications();
    toast.dismiss("notification-fetch");
    toast.success("Notifications loaded!");
  }, []);

  const getIconAndColor = (type) => {
    switch (type) {
      case "announcement":
        return { icon: <FaBullhorn />, color: "text-blue-500" };
      case "maintenance":
        return { icon: <FaTools />, color: "text-purple-500" };
      case "alert":
        return { icon: <FaExclamationCircle />, color: "text-red-500" };
      default:
        return { icon: <FaBell />, color: "" };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    try {
      // Corrected endpoint for publishing notification
      const response = await postRequest(
        "/admin/notifications/publish",
        formData
      );
      toast.success(response.data.message);
      setFormData({ title: "", message: "", user_type: "student" });
      fetchNotifications();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to publish notification."
      );
    } finally {
      setLoadingForm(false);
    }
  };

  const handleDeleteClick = (notificationId) => {
    setNotificationToDelete(notificationId);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      toast.loading("Deleting notification...", { id: "delete-toast" });
      // Corrected endpoint for deleting notification
      await deleteRequest(`/admin/notifications/${notificationToDelete}`);
      toast.dismiss("delete-toast");
      toast.success("Notification deleted successfully!");
      fetchNotifications();
    } catch (err) {
      toast.dismiss("delete-toast");
      toast.error(
        err.response?.data?.message || "Failed to delete notification."
      );
    } finally {
      setShowConfirmModal(false);
      setNotificationToDelete(null);
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

  const renderNotifications = (notificationsList) =>
    notificationsList.length === 0 ? (
      <div className="text-center text-gray-500 p-4">
        No notifications to display.
      </div>
    ) : (
      <div className="space-y-4">
        {notificationsList.map((notification) => {
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
              <button
                onClick={() => handleDeleteClick(notification.notification_id)}
                className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          );
        })}
      </div>
    );

  return (
    <div
      className="p-6 md:p-8 bg-white rounded-xl shadow-lg"
    >
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
        Admin Notifications 🔔
      </h2>

      {/* Form Section */}
      <div className="mb-8 p-6 bg-gray-50 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-3">
          <FaPlus className="text-blue-500" />
          <span>Publish a New Notification</span>
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Notification Title"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Notification Message"
            rows="4"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <div className="flex items-center space-x-3">
            <label htmlFor="user_type" className="font-semibold text-gray-700">
              Publish to:
            </label>
            <select
              id="user_type"
              name="user_type"
              value={formData.user_type}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Students</option>
              <option value="faculty">Faculty</option>
              <option value="both">Student & Faculty (Both)</option>{" "}
              {/* Added the "both" option */}
            </select>
          </div>
          <button
            type="submit"
            disabled={loadingForm}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-md shadow-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
          >
            {loadingForm ? (
              <span>Publishing...</span>
            ) : (
              <span>Publish Notification</span>
            )}
          </button>
        </form>
      </div>

      {/* Display Section */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-3">
          <FaUserGraduate className="text-blue-500" />
          <span>Student Announcements</span>
        </h3>
        {renderNotifications(notifications.studentNotifications)}

        <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4 flex items-center space-x-3">
          <FaChalkboardTeacher className="text-blue-500" />
          <span>Faculty Announcements</span>
        </h3>
        {renderNotifications(notifications.facultyNotifications)}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center text-red-500 mb-4">
              <FaExclamationCircle className="text-3xl mr-3" />
              <h3 className="text-xl font-bold text-gray-800">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this notification? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationAdmin;
