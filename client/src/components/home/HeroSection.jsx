import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const messages = [
    "Connect with students.",
    "Manage your academics.",
    "Transform your college experience.",
  ];
  const [typedMessage, setTypedMessage] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Parallax effect on background image
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Typing animation for the message
  useEffect(() => {
    const timer = setTimeout(
      () => {
        const currentMessage = messages[messageIndex];

        if (!isDeleting && charIndex < currentMessage.length) {
          setTypedMessage((prev) => prev + currentMessage.charAt(charIndex));
          setCharIndex((prev) => prev + 1);
        } else if (isDeleting && charIndex > 0) {
          setTypedMessage((prev) => prev.slice(0, prev.length - 1));
          setCharIndex((prev) => prev - 1);
        } else if (!isDeleting && charIndex === currentMessage.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && charIndex === 0) {
          setIsDeleting(false);
          setMessageIndex((prev) => (prev + 1) % messages.length);
        }
      },
      isDeleting ? 50 : 150
    );

    return () => clearTimeout(timer);
  }, [typedMessage, isDeleting, charIndex, messageIndex]);

  return (
    <section
      className="relative min-h-[60vh] sm:min-h-[80vh] md:h-screen bg-cover bg-center flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('https://wallpaperaccess.com/full/9411630.jpg')",
        transform: `translateY(${scrollY * 0.4}px)`,
      }}
    >
      <div className="absolute inset-0 bg-blue-900 opacity-70"></div>
      <div className="container mx-auto relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 py-12 sm:py-0">
        <h1 className="text-2xl sm:text-4xl md:text-7xl font-extrabold leading-tight mb-4 animate-fadeInUp drop-shadow-lg">
          Welcome to the Future of Education
        </h1>
        <p className="text-base sm:text-xl md:text-3xl font-light tracking-wide drop-shadow-md">
          <span className="typed-text">{typedMessage}</span>
          <span className="cursor blink">|</span>
        </p>
        <Link
          to="/features"
          className="mt-8 sm:mt-10 px-6 sm:px-8 py-2 sm:py-3 bg-white text-blue-700 font-bold rounded-full shadow-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
        >
          Explore Features
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
