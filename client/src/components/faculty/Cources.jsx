import React, { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";
import { getRequest } from "../../api/api";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

const Cources = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        toast.loading("Fetching subjects...", { id: "subjects-fetch" });
        const response = await getRequest("/faculty/courses");
        setSubjects(response.data);
        toast.dismiss("subjects-fetch");
        toast.success("Subjects loaded successfully!");
      } catch (err) {
        setError("Failed to fetch subjects.");
        console.error("API Error:", err);
        toast.dismiss("subjects-fetch");
        toast.error("Error fetching subjects.");
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading subjects...</div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (subjects.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No subjects assigned to you.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-white rounded-xl shadow-lg animate-fadeInUp">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
        My Assigned Subjects 📚
      </h2>

      <div className="space-y-4">
        {subjects.map((subject, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg shadow-md p-4 flex items-center justify-between transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="flex items-center space-x-3">
              <FaBook className="text-blue-600 text-xl" />
              <p className="text-lg font-semibold text-gray-800">
                {subject.subject_name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cources;
