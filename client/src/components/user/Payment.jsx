import React from "react";
// Import the centralized postRequest
import { postRequest } from "../../api/api";
// Assuming toast is imported from react-hot-toast (adjust if necessary)
import toast from "react-hot-toast";
import { FaCreditCard, FaReceipt } from "react-icons/fa"; // Added icons for buttons

export default function FeePayment({
  feeDetails,
  onPaymentSuccess,
  studentInfo,
}) {
  // NOTE: This utility function is assumed to be available globally in the browser environment
  // You must include the Razorpay script in your index.html or load it dynamically.
  // const Razorpay = new window.Razorpay(options);

  const handlePayment = async () => {
    // 1. Check if Razorpay script is loaded
    if (!window.Razorpay) {
      toast.error("Payment gateway not loaded.");
      return;
    }

    try {
      // 1. Initiate payment: JWT is AUTOMATICALLY added by the interceptor
      // Endpoint is assumed to be /student/fees/pay/initiate
      const res = await postRequest("/student/fees/pay/initiate", {
        fee_id: feeDetails.fee_id,
      });

      console.log("Payment initiation response:", res.data);
      const { orderId, amount, keyId } = res.data;

      // 2. Razorpay options
      const options = {
        key: keyId,
        amount: Math.round(amount * 100), // Amount must be in the smallest unit (paise/cents)
        currency: "INR",
        name: studentInfo.name,
        description: `Fee Payment for Semester ${feeDetails.sem_id}`,
        order_id: orderId,

        handler: async function (response) {
          try {
            // 3. Verify Payment: JWT is AUTOMATICALLY added for this request as well
            const verifyRes = await postRequest("/student/fees/pay/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              fee_id: feeDetails.fee_id,
            });

            console.log("Payment verification response:", verifyRes.data);
            toast.success("Payment Verified! Updating records...");
            onPaymentSuccess(); // Refresh the parent component
          } catch (error) {
            console.error("Payment verification failed:", error);
            // Show the specific error message if available
            toast.error(
              error.response?.data?.message || "Payment verification failed."
            );
          }
        },

        prefill: {
          name: studentInfo.name,
          email: studentInfo.email,
          contact: studentInfo.phone,
        },

        theme: { color: "#4F46E5" },
      };

      // 4. Open Razorpay modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment initiation error:", err);
      toast.error(err.response?.data?.message || "Payment initiation failed.");
    }
  };

  // --- Render Logic ---
  const dueAmount = feeDetails.amount - (feeDetails.paid_amount || 0);

  if (feeDetails.status === "Paid") {
    return (
      <button
        className="bg-green-600/90 text-white px-4 py-2 rounded-lg transition opacity-80 cursor-default flex items-center space-x-2"
        disabled
      >
        <FaReceipt />
        <span>Fully Paid!</span>
      </button>
    );
  }

  return (
    <button
      onClick={handlePayment}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition flex items-center space-x-2"
    >
      <FaCreditCard />
      <span>
        {feeDetails.status === "Partial"
          ? `Pay Remaining ₹${dueAmount.toFixed(2)}`
          : "Pay Full Amount"}
      </span>
    </button>
  );
}
