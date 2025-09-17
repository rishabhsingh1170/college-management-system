import React from "react";
import { FaDollarSign, FaFilePdf, FaDownload } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

// Mock data for the salary section
const salaryData = {
  current: {
    month: "September 2025",
    grossPay: 85000,
    deductions: {
      tax: 7500,
      pf: 5000,
      other: 1000,
    },
    netPay: 71500,
  },
  history: [
    { month: "August 2025", netPay: 71500, link: "#", status: "paid" },
    { month: "July 2025", netPay: 71500, link: "#", status: "paid" },
    { month: "June 2025", netPay: 71500, link: "#", status: "paid" },
    { month: "May 2025", netPay: 71500, link: "#", status: "paid" },
  ],
};

const Salary = () => {
  const { current, history } = salaryData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      className="p-6 md:p-8 bg-white rounded-xl shadow-lg"
      data-aos="fade-up"
    >
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
        My Salary Details 💸
      </h2>

      {/* Current Month's Summary */}
      <div
        className="bg-blue-600 text-white p-6 rounded-xl shadow-md mb-8"
        data-aos="zoom-in"
        data-aos-delay="100"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold mb-1">
              Current Month's Net Pay
            </p>
            <p className="text-4xl font-extrabold">
              {formatCurrency(current.netPay)}
            </p>
          </div>
          <FaDollarSign className="text-5xl opacity-40" />
        </div>
        <p className="mt-2 text-sm text-blue-200">
          Payment for {current.month} has been processed.
        </p>
      </div>

      {/* Detailed Breakdown and History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Detailed Breakdown Card */}
        <div
          className="bg-gray-50 p-6 rounded-xl shadow-md lg:col-span-1"
          data-aos="fade-right"
          data-aos-delay="200"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Breakdown</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex justify-between items-center">
              <span>Gross Pay</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(current.grossPay)}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span>Deductions (Tax)</span>
              <span className="font-semibold text-red-600">
                -{formatCurrency(current.deductions.tax)}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span>Deductions (PF)</span>
              <span className="font-semibold text-red-600">
                -{formatCurrency(current.deductions.pf)}
              </span>
            </li>
            <li className="flex justify-between items-center font-bold text-lg border-t pt-2 mt-2 border-gray-300">
              <span>Net Pay</span>
              <span className="text-blue-600">
                {formatCurrency(current.netPay)}
              </span>
            </li>
          </ul>
        </div>

        {/* Pay Slip History */}
        <div
          className="lg:col-span-2"
          data-aos="fade-left"
          data-aos-delay="300"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Pay Slip History
          </h3>
          <div className="bg-gray-50 rounded-xl shadow-md">
            <ul className="divide-y divide-gray-200">
              {history.map((slip, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-4 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <FaFilePdf className="text-xl text-red-500" />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {slip.month} Pay Slip
                      </p>
                      <p className="text-sm text-gray-500">
                        Net Pay: {formatCurrency(slip.netPay)}
                      </p>
                    </div>
                  </div>
                  <a
                    href={slip.link}
                    download
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    <FaDownload />
                    <span>Download</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Salary;
