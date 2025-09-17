import React, { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaQuestionCircle,
  FaEnvelope,
  FaPaperPlane,
} from "react-icons/fa";
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Support ticket submitted:", formData);
    setLoading(false);
    setFormData({ name: "", email: "", message: "" }); // Clear form
    alert("Your support ticket has been submitted successfully!");
  };

  return (
    <div
      className="p-6 md:p-8 bg-white rounded-xl shadow-lg"
      data-aos="fade-up"
    >
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
        Help & Support 💬
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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
              <label htmlFor="name" className="sr-only">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
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
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-md shadow-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
            >
              {loading ? (
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
    </div>
  );
};

export default HelpUser;
