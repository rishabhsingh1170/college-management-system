import React from "react";

// Mock data for the gallery images
// In a real application, you would fetch this data from an API
const galleryImages = [
  {
    url: "https://ir.iitr.ac.in/images/slider/bg2022_1.jpg",
    alt: "Students on campus",
  },
  {
    url: "https://tse1.mm.bing.net/th/id/OIP.LcN978jY6KYOvBfc1Ue6VQHaE8?pid=Api&P=0&h=180",
    alt: "A university lecture hall",
  },
  {
    url: "https://img.freepik.com/premium-photo/four-college-students-studying-library_14117-171290.jpg",
    alt: "Students studying in a library",
  },
  {
    url: "https://images.shiksha.com/mediadata/images/articles/1648469640phplIH0wm.jpeg",
    alt: "Student life and activities",
  },
  {
    url: "https://img.freepik.com/premium-photo/students-collaborating-robotics-project-classroom-setting-group-activity_489081-2503.jpg",
    alt: "Students collaborating on a project",
  },
  {
    url: "https://wallpaperaccess.com/full/9411628.jpg",
    alt: "Campus building at sunset",
  },
  {
    url: "https://tse2.mm.bing.net/th/id/OIP.bdHoIBJq67B6mJWfURlr9wHaE8?pid=Api&P=0&h=180",
    alt: "Graduation ceremony",
  },
  {
    url: "https://tse3.mm.bing.net/th/id/OIP.w1DMKvmSIzYgKZ6c7_5pLgHaFj?pid=Api&P=0&h=180",
    alt: "Campus courtyard",
  },
];

const GallerySection = () => {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-12 text-gray-800"
          data-aos="fade-up"
        >
          Our Campus Life 📸
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
              data-aos="zoom-in"
              data-aos-delay={index * 50}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-64 md:h-72 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-blue-800 bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <p className="text-white text-base md:text-lg font-semibold text-center leading-snug">
                  {image.alt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
