import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserShield,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaLock,
  FaUser,
  FaEyeSlash,
  FaEye,
} from "react-icons/fa";
import { postRequest } from "../api/api";

// Placeholder for a stylish background image
const stylishBackground =
  "https://static.vecteezy.com/system/resources/previews/003/689/228/large_2x/online-registration-or-sign-up-login-for-account-on-smartphone-app-user-interface-with-secure-password-mobile-application-for-ui-web-banner-access-cartoon-people-illustration-vector.jpg";

// SVG for the decorative section
const WelcomeSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-full w-full opacity-80"
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
  >
    <path
      fill="#ffffff"
      fillOpacity="1"
      d="M0,192L48,176C96,160,192,128,288,106.7C384,85,480,75,576,90.7C672,107,768,149,864,165.3C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    ></path>
  </svg>
);

function Login() {
  const [selected, setSelected] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let user_type =
        selected === 0 ? "admin" : selected === 1 ? "student" : "faculty";

      const res = await postRequest(`/auth/login`, {
        user_type,
        username,
        password,
      }); // Save token and redirect

      localStorage.setItem("token", res.data.token);

      toast.success("Login successful!");

      if (user_type === "admin") navigate("/admin");
      else if (user_type === "student") navigate("/user");
      else if (user_type === "faculty") navigate("/faculty");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");

      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };



  const getUserTypeIcon = (type) => {
    switch (type) {
      case "admin":
        return <FaUserShield />;
      case "student":
        return <FaUserGraduate />;
      case "faculty":
        return <FaChalkboardTeacher />;
      default:
        return null;
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen w-full overflow-hidden p-4 sm:p-0">
      {/* Background and Overlay */}
      <img
        src={stylishBackground}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover blur-sm z-0"
      />
      <div className="absolute inset-0 bg-blue-900/50 z-10" />

      {/* Main Grid Container for Two Sections */}
      <div className="relative z-20 container mx-auto my-auto grid grid-cols-1 md:grid-cols-2 lg:gap-12 lg:w-[80%] backdrop-blur-3xl rounded-3xl overflow-hidden shadow-2xl">
        {/* Section 1: Attractive Styling with Image and Heading */}
        <div
          className="relative hidden md:flex flex-col items-center justify-center p-8 text-center text-white"
          data-aos="fade-right"
        >
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
              A Seamless Journey, A Vibrant Future.
            </h1>
            <p className="text-lg lg:text-xl font-light mb-8">
              Your gateway to academic excellence and campus life.
            </p>
            <div className="w-full h-auto max-w-sm lg:max-w-md">
              <WelcomeSVG />
            </div>
          </div>
        </div>

        {/* Section 2: Login Form */}
        <div
          className="relative flex flex-col items-center justify-center bg-white/20 p-6 sm:p-10 border-2 border-white/20 rounded-3xl md:rounded-l-none md:rounded-r-3xl"
          data-aos="fade-left"
        >
          {/* Logo Section */}
          <div className="mb-6 flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-white mb-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.394 2.08a1 1 0 00-.788 0L.245 7.494A1 1 0 001 9.227l7.593 4.218 2.378-1.585a1 1 0 011.085-.164l2.316 1.488 2.016-1.326-3.896-3.116-4.524 3.016L1 9.227l4.594-2.553L9.692 4.07l.702-1.99z" />
            </svg>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wider drop-shadow-md">
              COLLEGE PORTAL
            </h1>
          </div>

          {/* User Type Buttons */}
          <div className="flex justify-between w-full p-2 gap-2">
            <button
              onClick={() => setSelected(0)}
              className={`transition-all duration-300 font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-lg border-2 border-blue-500/50 hover:bg-blue-600/20 focus:ring-2 focus:ring-blue-400 focus:outline-none flex-1 flex flex-col items-center text-sm sm:text-base ${
                selected === 0
                  ? "bg-blue-600/30 text-white border-blue-600/80 scale-105"
                  : "bg-blue-300/10 text-gray-200"
              }`}
            >
              <FaUserShield className="text-xl sm:text-2xl mb-1" />
              ADMIN
            </button>
            <button
              onClick={() => setSelected(1)}
              className={`transition-all duration-300 font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-lg border-2 border-blue-500/50 hover:bg-blue-600/20 focus:ring-2 focus:ring-blue-400 focus:outline-none flex-1 flex flex-col items-center text-sm sm:text-base ${
                selected === 1
                  ? "bg-blue-600/30 text-white border-blue-600/80 scale-105"
                  : "bg-blue-300/10 text-gray-200"
              }`}
            >
              <FaUserGraduate className="text-xl sm:text-2xl mb-1" />
              STUDENT
            </button>
            <button
              onClick={() => setSelected(2)}
              className={`transition-all duration-300 font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-lg border-2 border-blue-500/50 hover:bg-blue-600/20 focus:ring-2 focus:ring-blue-400 focus:outline-none flex-1 flex flex-col items-center text-sm sm:text-base ${
                selected === 2
                  ? "bg-blue-600/30 text-white border-blue-600/80 scale-105"
                  : "bg-blue-300/10 text-gray-200"
              }`}
            >
              <FaChalkboardTeacher className="text-xl sm:text-2xl mb-1" />
              FACULTY
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="w-full mt-6 space-y-4">
            <div className="relative">
              <FaUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-blue-500/30 rounded-xl outline-none transition-all duration-200 bg-white/10 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="Username"
              />
            </div>
            <div className="relative">
              <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-300" />
              <input
                type={passwordShown ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border-2 border-blue-500/30 rounded-xl outline-none transition-all duration-200 bg-white/10 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-300 hover:text-white transition-colors duration-150 focus:outline-none"
              >
                {passwordShown ? <FaEyeSlash /> : <FaEye />}
              </button>
              <Link
                to="/forgot-password"
                className="absolute right-0 -bottom-6 text-sm text-blue-500 hover:underline hover:text-blue-600 transition-all duration-150"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="pt-8 w-full">
              <button
                type="submit"
                className="w-full px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all duration-300 transform 
      bg-gradient-to-r from-blue-700 to-blue-500
      hover:from-blue-800 hover:to-blue-600 
      hover:shadow-[5px_5px_0px_0px_rgba(30,64,175,0.7)]
      focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={loading}
              >
                {loading ? "Logging in..." : "LOG IN"}
              </button>
            </div> 
          </form>

          {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;
