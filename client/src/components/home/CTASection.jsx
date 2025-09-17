import React from "react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="bg-blue-800 text-white py-10 sm:py-16">
      <div className="container mx-auto px-2 sm:px-4 text-center">
        <h2
          className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-3 sm:mb-4"
          data-aos="fade-up"
        >
          Ready to Get Started?
        </h2>
        <p
          className="text-base sm:text-lg md:text-xl font-light mb-6 sm:mb-8"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Log in now to access your personalized dashboard and streamline your
          college life.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 sm:px-10 py-2 sm:py-4 bg-white text-blue-800 font-bold rounded-full shadow-xl transform transition-transform duration-300 hover:scale-105 hover:bg-gray-100 text-sm sm:text-base"
          data-aos="zoom-in"
          data-aos-delay="400"
        >
          Log In
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
