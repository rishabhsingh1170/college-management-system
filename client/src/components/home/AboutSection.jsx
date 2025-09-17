import React from "react";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div data-aos="fade-right">
            <img
              src="https://www.ticketleap.com/wp-content/uploads/2024/01/62a8e9a50f19b73012512a91_college-students-hanging-out-on-campus.jpg"
              alt="Students on campus"
              loading="lazy"
              className="w-full rounded-xl shadow-2xl transform transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Text Content Section */}
          <div data-aos="fade-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Your Journey Starts Here
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Our college management system is designed to streamline every
              aspect of your academic life. From a seamless admission process to
              personalized dashboards, we provide the tools you need to succeed.
              We are committed to fostering an environment where innovation
              thrives and students are empowered to achieve their full
              potential.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Explore our world-class facilities and a vibrant community that
              supports your growth.
            </p>
            <Link
              to="/about"
              className="inline-block px-8 py-3 bg-blue-700 text-white font-bold rounded-full shadow-lg hover:bg-blue-800 transition-colors duration-300 transform hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
