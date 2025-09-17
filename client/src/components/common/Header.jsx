import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaBullhorn,
  FaInfoCircle,
  FaSignInAlt,
  FaPhoneAlt,
  FaCameraRetro,
  FaBars,
} from "react-icons/fa";

const Header = ({ toggleMobileMenu, scrollToSection }) => {
  return (
    <header className="sticky top-0 z-50 p-4 backdrop-blur-md bg-white/70 shadow-lg transition-all duration-300">
      <nav className="container mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-blue-700 animate-pulse"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.394 2.08a1 1 0 00-.788 0L.245 7.494A1 1 0 001 9.227l7.593 4.218 2.378-1.585a1 1 0 011.085-.164l2.316 1.488 2.016-1.326-3.896-3.116-4.524 3.016L1 9.227l4.594-2.553L9.692 4.07l.702-1.99z" />
          </svg>
          <span className="text-2xl font-extrabold text-gray-900 tracking-wide">
            COLLEGE PORTAL
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="/"
            onClick={(e) => scrollToSection(e, "hero")}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-700 transition-colors duration-300 relative group"
          >
            <FaHome className="text-lg" />
            <span>Home</span>
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-700 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </a>
          <a
            href="#features"
            onClick={(e) => scrollToSection(e, "features")}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-700 transition-colors duration-300 relative group"
          >
            <FaBullhorn className="text-lg" />
            <span>Features</span>
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-700 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </a>
          <a
            href="#gallery"
            onClick={(e) => scrollToSection(e, "gallery")}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-700 transition-colors duration-300 relative group"
          >
            <FaCameraRetro className="text-lg" />
            <span>Gallery</span>
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-700 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </a>
          <a
            href="#contact-us"
            onClick={(e) => scrollToSection(e, "contact-us")}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-700 transition-colors duration-300 relative group"
          >
            <FaPhoneAlt className="text-lg" />
            <span>Contact</span>
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-700 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </a>
          <a
            href="#about"
            onClick={(e) => scrollToSection(e, "about")}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-700 transition-colors duration-300 relative group"
          >
            <FaInfoCircle className="text-lg" />
            <span>About</span>
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-700 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </a>
        </div>
        <Link
          to="/login"
          className="hidden md:flex items-center space-x-2 px-6 py-2 bg-blue-700 text-white font-semibold rounded-full shadow-md hover:bg-blue-800 transition-all duration-300 transform hover:scale-105"
        >
          <FaSignInAlt className="text-lg" />
          <span>Login</span>
        </Link>
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-700 text-2xl focus:outline-none"
          >
            <FaBars />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
