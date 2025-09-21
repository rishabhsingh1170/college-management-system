import React, { useState, useEffect } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaQuestionCircle,
  FaEnvelope,
  FaPaperPlane,
  FaTicketAlt,
  FaClock,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import { postRequest, getRequest } from "../../api/api";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

// Mock data for FAQs
const faqs = [
  {
    question: "How do I update my profile information?",
    answer:
      "You can update your personal details by navigating to the 'Profile' section in your dashboard. Click on the 'Edit' button and save your changes after making the necessary updates.",
  },
  {
    question: "Where can I find my course schedule?",
    answer:
      "Your complete course timetable is available under the 'TimeTable' section in your dashboard. You can also sync it with your personal calendar.",
  },
  {
    question: "I forgot my password. How can I reset it?",
    answer:
      "On the login page, click on 'Forgot Password?'. You will be prompted to enter your registered email address to receive a password reset link.",
  },
  {
    question: "How do I report a technical issue?",
    answer:
      "If you encounter any technical problems, please fill out the support form on this page with a detailed description of the issue. Our support team will get back to you shortly.",
  },
];

const HelpUser = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({ message: "" });
  const [loadingForm, setLoadingForm] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [error, setError] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleInputChange = (e) => {
    setFormData({ message: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);

    try {
      const response = await postRequest("/student/support", {
        issue: formData.message,
      });
      toast.success(response.data.message);
      setFormData({ message: "" });
      fetchTickets(); // Refresh tickets list after submission
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit ticket.");
    } finally {
      setLoadingForm(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await getRequest("/student/get-support");
      setTickets(response.data);
      console.log("Fetched Tickets:", response.data);
    } catch (err) {
      setError("Failed to fetch support tickets.");
      console.error("API Error:", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
    fetchTickets();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-blue-100 text-blue-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Resolved":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "New":
        return <FaTicketAlt />;
      case "In Progress":
        return <FaSpinner className="animate-spin" />;
      case "Resolved":
        return <FaCheckCircle />;
      default:
        return <FaTicketAlt />;
    }
  };

  return (
    <div
      className="p-6 md:p-8 bg-white rounded-xl shadow-lg"
      data-aos="fade-up"
    >
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
        Help & Support 💬
      </h2>

      {/* Top Section: FAQ and Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        {/* FAQ Section */}
        <div data-aos="fade-right" data-aos-delay="100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-3">
            <FaQuestionCircle className="text-blue-500" />
            <span>Frequently Asked Questions</span>
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg shadow-sm p-4 transition-all duration-300"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFaq(index)}
                >
                  <h4 className="text-lg font-semibold text-gray-800">
                    {faq.question}
                  </h4>
                  {openFaq === index ? (
                    <FaChevronUp className="text-blue-500 transition-transform duration-300" />
                  ) : (
                    <FaChevronDown className="text-gray-500 transition-transform duration-300" />
                  )}
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === index
                      ? "max-h-screen pt-4 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Form Section */}
        <div data-aos="fade-left" data-aos-delay="100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-3">
            <FaEnvelope className="text-blue-500" />
            <span>Contact Support</span>
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="message" className="sr-only">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Describe your issue or question..."
                rows="5"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loadingForm}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-md shadow-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
            >
              {loadingForm ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Section: Submitted Tickets */}
      <div className="mt-10 pt-6 border-t-2 border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-3">
          <FaTicketAlt className="text-blue-500" />
          <span>My Submitted Tickets</span>
        </h3>
        {loadingTickets ? (
          <div className="text-center text-gray-500 p-8">
            Loading tickets...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-8">{error}</div>
        ) : tickets.length === 0 ? (
          <div className="text-center text-gray-500 p-8">
            You have not submitted any support tickets yet.
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.support_id}
                className="p-4 bg-gray-50 rounded-lg shadow-sm transition-colors duration-200 hover:bg-gray-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {ticket.issue}
                  </h4>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-2 ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {getStatusIcon(ticket.status)}
                    <span>{ticket.status}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  Submitted on:{" "}
                  {new Date(ticket.created_at).toLocaleDateString()}
                </p>
                {ticket.resolved_at && (
                  <p className="text-sm text-gray-600">
                    Resolved on:{" "}
                    {new Date(ticket.resolved_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpUser;
