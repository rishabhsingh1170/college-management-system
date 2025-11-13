import React, { useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import { postRequest } from "../../api/api"; // Import your postRequest helper
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Endpoint is assumed to be /v1/contact
      const response = await postRequest("/contact", formData);

      toast.success(response.data.message);
      setFormData({ name: "", email: "", message: "" }); // Clear the form
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to send message. Please check your network."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact-us" className="py-10 sm:py-20 bg-white">
      <div className="container mx-auto px-2 sm:px-4 text-center">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12"
          data-aos="fade-up"
        >
          Contact Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Contact Information */}
          <div
            className="text-left space-y-4 sm:space-y-6"
            data-aos="fade-right"
          >
            <h3 className="text-lg sm:text-2xl font-semibold text-gray-800">
              Get in Touch
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Have questions or need assistance? Our support team is here to
              help you.
            </p>
            <div className="flex items-center space-x-2 sm:space-x-4 text-gray-700 text-xs sm:text-base">
              <FaMapMarkerAlt className="text-lg sm:text-xl text-blue-600" />
              <span>ABCD, Bhopal, Madhaya Pradesh</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 text-gray-700 text-xs sm:text-base">
              <FaPhone className="text-lg sm:text-xl text-blue-600" />
              <span>+91 62017XXXXX</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 text-gray-700 text-xs sm:text-base">
              <FaEnvelope className="text-lg sm:text-xl text-blue-600" />
              <span>info@collegeportal.edu</span>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className="bg-gray-50 p-4 sm:p-8 rounded-xl shadow-lg"
            data-aos="fade-left"
          >
            <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6 text-center text-gray-800">
              Send us a message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your Message"
                rows="4"
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              ></textarea>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors duration-300 text-sm sm:text-base disabled:bg-gray-400"
              >
                {loading ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <FaPaperPlane /> <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
