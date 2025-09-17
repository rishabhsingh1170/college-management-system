import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaBullhorn,
  FaInfoCircle,
  FaSignInAlt,
  FaPhoneAlt,
  FaCameraRetro,
  FaTimes,
} from "react-icons/fa";

const MobileMenu = ({ isOpen, toggleMenu, scrollToSection }) => {
  return (
    <div
      className={`fixed inset-0 bg-white/95 backdrop-blur-sm z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-end">
        <button
          onClick={toggleMenu}
          className="text-gray-700 text-2xl focus:outline-none"
        >
          <FaTimes />
        </button>
      </div>

      <div className="flex flex-col items-center justify-start h-full space-y-8 py-12 pt-20 overflow-y-auto">
        <a
          href="/"
          onClick={(e) => scrollToSection(e, "hero")}
          className="flex items-center space-x-2 text-gray-800 text-3xl font-semibold hover:text-blue-700 transition-colors duration-300"
        >
          <FaHome className="text-3xl" />
          <span>Home</span>
        </a>
        <a
          href="#features"
          onClick={(e) => scrollToSection(e, "features")}
          className="flex items-center space-x-2 text-gray-800 text-3xl font-semibold hover:text-blue-700 transition-colors duration-300"
        >
          <FaBullhorn className="text-3xl" />
          <span>Features</span>
        </a>
        <a
          href="#gallery"
          onClick={(e) => scrollToSection(e, "gallery")}
          className="flex items-center space-x-2 text-gray-800 text-3xl font-semibold hover:text-blue-700 transition-colors duration-300"
        >
          <FaCameraRetro className="text-3xl" />
          <span>Gallery</span>
        </a>
        <a
          href="#contact-us"
          onClick={(e) => scrollToSection(e, "contact-us")}
          className="flex items-center space-x-2 text-gray-800 text-3xl font-semibold hover:text-blue-700 transition-colors duration-300"
        >
          <FaPhoneAlt className="text-3xl" />
          <span>Contact</span>
        </a>
        <a
          href="#about"
          onClick={(e) => scrollToSection(e, "about")}
          className="flex items-center space-x-2 text-gray-800 text-3xl font-semibold hover:text-blue-700 transition-colors duration-300"
        >
          <FaInfoCircle className="text-3xl" />
          <span>About</span>
        </a>
        <Link
          to="/login"
          className="flex items-center space-x-2 px-10 py-4 bg-blue-700 text-white font-bold rounded-full shadow-lg text-2xl hover:bg-blue-800 transition-all duration-300"
        >
          <FaSignInAlt className="text-2xl" />
          <span>Login</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileMenu;
