import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: College Info */}
          <div className="space-y-4" data-aos="fade-up">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0L.245 7.494A1 1 0 001 9.227l7.593 4.218 2.378-1.585a1 1 0 011.085-.164l2.316 1.488 2.016-1.326-3.896-3.116-4.524 3.016L1 9.227l4.594-2.553L9.692 4.07l.702-1.99z" />
              </svg>
              <span className="text-xl font-bold text-white">
                COLLEGE PORTAL
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Empowering students and faculty with the tools for a seamless
              academic journey.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div data-aos="fade-up" data-aos-delay="100">
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-blue-500 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-blue-500 transition-colors duration-200"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-blue-500 transition-colors duration-200"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact-us"
                  className="hover:text-blue-500 transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: User Portals */}
          <div data-aos="fade-up" data-aos-delay="200">
            <h4 className="text-lg font-semibold text-white mb-4">
              User Portals
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin"
                  className="hover:text-blue-500 transition-colors duration-200"
                >
                  Admin
                </Link>
              </li>
              <li>
                <Link
                  to="/faculty"
                  className="hover:text-blue-500 transition-colors duration-200"
                >
                  Faculty
                </Link>
              </li>
              <li>
                <Link
                  to="/user"
                  className="hover:text-blue-500 transition-colors duration-200"
                >
                  Student
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div data-aos="fade-up" data-aos-delay="300">
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>123 College Ave, University City, CA 12345</li>
              <li>
                Email:{" "}
                <a
                  href="mailto:info@college.edu"
                  className="hover:text-blue-500 transition-colors duration-200"
                >
                  info@college.edu
                </a>
              </li>
              <li>Phone: +1 (123) 456-7890</li>
            </ul>
            <div className="flex space-x-4 mt-4 text-xl">
              <a
                href="#"
                className="hover:text-blue-500 transition-colors duration-200"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="hover:text-blue-500 transition-colors duration-200"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="hover:text-blue-500 transition-colors duration-200"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="hover:text-blue-500 transition-colors duration-200"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} College Portal. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
