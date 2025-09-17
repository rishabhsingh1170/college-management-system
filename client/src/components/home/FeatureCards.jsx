import React from "react";
import { Link } from "react-router-dom";

function FeatureCards() {
  const features = [
    {
      title: "Student Portal",
      description:
        "Personalized dashboard for academics, schedules, and grades.",
      icon: "M10 2a8 8 0 100 16 8 8 0 000-16zM5.5 10a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z",
      path: "/user/profile",
    },
    {
      title: "Admissions & Enrollment",
      description: "Simple online applications and real-time status tracking.",
      icon: "M15.5 13a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM19 14.5a.5.5 0 00-.5-.5h-2.5a.5.5 0 000 1h2a.5.5 0 00.5-.5z",
      path: "/user/admission",
    },
    {
      title: "Course Management",
      description: "View course materials, assignments, and faculty details.",
      icon: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1.5-6h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3a.5.5 0 00-.5.5v3a.5.5 0 00.5.5z",
      path: "/faculty/cources",
    },
  ];

  return (
    <section className="py-12 sm:py-20 px-2 sm:px-4">
      <div className="container mx-auto">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl text-center font-bold mb-8 sm:mb-12"
          data-aos="fade-up"
        >
          Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.path}
              data-aos="fade-up"
              data-aos-delay={index * 200}
              className="bg-white rounded-xl shadow-lg p-5 sm:p-8 text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl block no-underline"
            >
              <div className="mb-2 sm:mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d={feature.icon}
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg sm:text-xl mb-1 sm:mb-2 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureCards;
