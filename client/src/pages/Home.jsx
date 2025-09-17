import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// Importing the styled components
import Header from "../components/common/Header";
import HeroSection from "../components/home/HeroSection";
import FeatureCards from "../components/home/FeatureCards";
import Testimonials from "../components/home/Testimonials";
import CTASection from "../components/home/CTASection";
import ContactSection from "../components/home/ContactSection";
import GallerySection from "../components/home/GallerySection";
import AboutSection from "../components/home/AboutSection";
import Footer from "../components/common/Footer";

const Home = ({ toggleMobileMenu, scrollToSection }) => {
  useEffect(() => {
    // Initialize AOS (Animate On Scroll) library
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once
    });
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen font-sans antialiased text-gray-800">
      {/* Header component with navigation */}
      <Header
        toggleMobileMenu={toggleMobileMenu}
        scrollToSection={scrollToSection}
      />

      <main>
        {/* Hero Section with typing animation */}
        <HeroSection />

        {/* Feature Cards with scroll-based animations */}
        <section id="features">
          <FeatureCards />
        </section>

        <Testimonials />

        <CTASection />

        <section id="gallery">
          <GallerySection />
        </section>

        <ContactSection />

        <AboutSection />
      </main>

      {/* Optional: Add a Footer component here */}
      <Footer />
    </div>
  );
};

export default Home;
