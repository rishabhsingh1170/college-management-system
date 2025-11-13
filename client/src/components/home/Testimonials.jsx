import React from "react";
import { FaQuoteLeft } from "react-icons/fa"; // Make sure you have react-icons installed

const testimonials = [
  {
    quote:
      "The student portal has made managing my academic life so much easier. I can check grades and assignments from anywhere!",
    name: "Jyoti Suman",
    role: "Current Student",
  },
  {
    quote:
      "As a faculty member, the new system has streamlined my administrative tasks. It's intuitive and saves me so much time.",
    name: "Shiddaarth",
    role: "Faculty Member",
  },
  {
    quote:
      "The admission process was incredibly smooth. I received updates in real-time and all my documents were handled securely.",
    name: "Shivanshu Pal",
    role: "New Admit",
  },
];

const Testimonials = () => {
  return (
    <section className="py-12 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4 text-center">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12"
          data-aos="fade-up"
        >
          What Our Community Says
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-5 sm:p-8 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 flex flex-col justify-between min-h-[260px]"
              data-aos="fade-up"
              data-aos-delay={index * 200}
            >
              <FaQuoteLeft className="text-blue-600 text-2xl sm:text-3xl mx-auto mb-2 sm:mb-4" />
              <p className="text-base sm:text-lg text-gray-700 italic mb-2 sm:mb-4">
                "{testimonial.quote}"
              </p>
              <p className="font-semibold text-gray-800 mt-auto">
                {testimonial.name}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {testimonial.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
