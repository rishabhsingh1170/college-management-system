import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import { postRequest } from "../api/api"; // Ensure this is correctly imported
import forgetPasswordImg from "../assets/forget-password-img.jpg";
import AOS from "aos";
import "aos/dist/aos.css";

// SVG for the floating animation
const FloatingSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 200"
    className="h-full w-full"
    fill="currentColor"
  >
    <path d="M100 0C44.772 0 0 44.772 0 100s44.772 100 100 100 100-44.772 100-100S155.228 0 100 0zm0 180c-44.183 0-80-35.817-80-80S55.817 20 100 20s80 35.817 80 80-35.817 80-80 80zm-10-80c0 5.523-4.477 10-10 10h-20c-5.523 0-10-4.477-10-10v-20c0-5.523 4.477-10 10-10h20c5.523 0 10 4.477 10 10v20zm40 0c0 5.523-4.477 10-10 10h-20c-5.523 0-10-4.477-10-10v-20c0-5.523 4.477-10 10-10h20c5.523 0 10 4.477 10 10v20zm-20 40c0 5.523-4.477 10-10 10h-20c-5.523 0-10-4.477-10-10v-20c0-5.523 4.477-10 10-10h20c5.523 0 10 4.477 10 10v20z" />
  </svg>
);

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await postRequest("/auth/forgot-password", { email: email });

      console.log(res);
      toast.success("OTP sent to your email!");
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen w-full p-4 sm:p-0">
      <Toaster position="top-center" />

      {/* Background Image with Blur */}
      <img
        src={forgetPasswordImg}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover blur-md z-0" // blur-md for blur effect
      />
      {/* Dark Overlay for better contrast */}
      <div className="absolute inset-0 bg-blue-900/70 z-10" />

      {/* Main container for the side-by-side layout */}
      <div className="relative z-20 flex flex-col lg:flex-row w-full max-w-5xl h-full lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl animate-fadeIn">
        {/* Left side: Animated Styling Section */}
        <div
          className="hidden lg:flex flex-col items-center justify-center lg:w-1/2 p-10 text-center text-white bg-blue-900 relative overflow-hidden"
          data-aos="fade-right"
        >
          <div className="absolute inset-0 bg-blue-800 opacity-60"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700/80 to-purple-600/50"></div>

          <div className="z-10 relative">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
              Unlock Your Account, Securely.
            </h1>
            <p className="text-lg lg:text-xl font-light mb-8">
              We'll help you get back in quickly and securely.
            </p>
          </div>

          {/* Animated SVG icon */}
          <div className="absolute bottom-10 right-10 z-0 h-40 w-40 text-blue-500/20 animate-float">
            <FloatingSVG />
          </div>
        </div>

        {/* Right side: Form container with backdrop-blur */}
        <div
          className="relative w-full lg:w-1/2 flex flex-col justify-center items-center bg-white/10 backdrop-blur-3xl p-8 sm:p-10 border-2 border-white/20"
          data-aos="fade-left"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wider drop-shadow-md mb-2">
            Forgot Password?
          </h1>
          <p className="text-sm text-gray-200 text-center mb-6">
            Enter your registered email to receive an OTP.
          </p>
          <form onSubmit={handleSubmit} className="w-full space-y-6 max-w-sm">
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-blue-500/30 rounded-xl outline-none transition-all duration-200 bg-white/10 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="pt-4 w-full">
              <button
                type="submit"
                className="w-full px-8 py-3 rounded-full font-bold bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-xl hover:from-blue-800 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "SEND OTP"}
              </button>
            </div>
          </form>
          <div className="mt-8">
            <Link
              to="/login"
              className="flex items-center space-x-2 text-sm text-blue-300 hover:text-blue-100 transition-colors duration-150"
            >
              <FaArrowLeft />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
