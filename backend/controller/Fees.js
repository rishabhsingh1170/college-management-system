import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js'; // Your database connection pool
import dotenv from "dotenv";
import { instance as razorpay } from "../config/razorpay.js";
import crypto from "crypto";


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// export const updateFeeStatus = async (req, res) => {
//   try {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "No token provided" });
//     const decoded = jwt.verify(token, JWT_SECRET);
//     if (decoded.user_type !== "admin") return res.status(403).json({ message: "Access denied. Admin role required." });

//     const { feeId } = req.params;
//     const { status, paid_amount } = req.body;

//     const updateQuery = `
//       UPDATE Fees
//       SET status = ?, paid_amount = ?
//       WHERE fee_id = ?;
//     `;
//     await pool.query(updateQuery, [status, paid_amount, feeId]);

//     res.json({ message: "Fee status updated successfully." });
//   } catch (err) {
//     console.error("Server error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };




// Note: jwt, pool, razorpay, and crypto are assumed to be imported correctly.

// ===========================================================
// ✅ Controller 1: GET FEES DETAILS
// ===========================================================

export const getFees = async (req, res) => {
    // Logic for fetching fees details (already correct)
    try {
        const student_id = req.user?.student_id;
        if (!student_id)
            return res.status(401).json({ success: false, message: "Unauthorized" });

        const [fees] = await pool.query("SELECT * FROM Fees WHERE student_id = ?", [student_id]);

        const updatedFees = fees.map(fee => {
            const due = fee.amount - (fee.paid_amount || 0);
            let status = fee.status;
            if (due > 0 && (status === 'Paid' || status === 'Unpaid')) {
                status = (fee.paid_amount || 0) > 0 ? 'Partial' : 'Unpaid';
            } else if (due <= 0) {
                status = 'Paid';
            }
            return { ...fee, status };
        });

        res.status(200).json({ success: true, data: updatedFees });
    } catch (error) {
        console.error("Get Fees Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch fees." });
    }
};

// ===========================================================
// ✅ Controller 2: INITIATE PAYMENT (FIXED SYNTAX)
// ===========================================================
// Assuming razorpay instance, crypto, dotenv are imported correctly

export const initiatePayment = async (req, res) => {
  // FIX: Access fee_id correctly from req.body
  const { fee_id } = req.body;
  let conn; // Variable to hold the database connection

  try {
    const student_id = req.user?.student_id;

    if (!student_id) {
      return res
        .status(401)
        .json({ success: false, message: "Student ID missing in token." });
    }

    const [feeRows] = await pool.query(
      "SELECT amount, paid_amount, sem_id FROM Fees WHERE fee_id = ? AND student_id = ?",
      [fee_id, student_id]
    );

    if (feeRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Fee record not found." });
    }

    const { amount, paid_amount } = feeRows[0];
    const dueAmount = amount - (paid_amount || 0);

    if (dueAmount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "No due amount remaining." });
    }

    const options = {
      amount: Math.round(dueAmount * 100),
      currency: "INR",
      receipt: `receipt_${fee_id}_${Date.now()}`,
      notes: { student_id, fee_id },
    };

    // 1. Create Order via Razorpay
    const order = await razorpay.orders.create(options);

    // 2. Start Database Transaction
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // 3. Insert PENDING transaction record into database
    await conn.query(
      `INSERT INTO PaymentTransactions (fee_id, gateway_order_id, amount, status)
             VALUES (?, ?, ?, 'PENDING')`,
      [fee_id, order.id, dueAmount]
    );
    console.log("key id", RAZORPAY_KEY_ID);

    // 4. Commit transaction
    await conn.commit();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: dueAmount,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (error) {
    // If an error occurred (Razorpay order failure or DB insert failure)
    if (conn) await conn.rollback();

    console.error("Payment Initiation Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Payment initiation failed." });
  } finally {
    if (conn) conn.release(); // Always release the connection
  }
};

// ===========================================================
// ✅ Controller 3: VERIFY PAYMENT (Already correct)
// ===========================================================
export const verifyPayment = async (req, res) => {
    // Logic for verifying payment signature and updating DB (already correct)
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            fee_id
        } = req.body;

        // Validate fields
        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            !fee_id
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing fields",
            });
        }

        // Signature validation
        const expected = crypto
            .createHmac("sha256", RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (expected !== razorpay_signature) {
            console.log("❌ Signature mismatch");
            return res.status(400).json({
                success: false,
                message: "Invalid signature",
            });
        }

        console.log("✅ Signature valid");

        // Fetch transaction
        const [txn] = await pool.query(
            "SELECT amount FROM PaymentTransactions WHERE gateway_order_id=?",
            [razorpay_order_id]
        );

        if (!txn.length) {
            console.log("❌ Transaction missing in DB");
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        const txnAmount = txn[0].amount;

        // Fetch fee
        const [feeRows] = await pool.query(
            "SELECT amount, paid_amount FROM Fees WHERE fee_id=?",
            [fee_id]
        );

        if (!feeRows.length) {
            console.log("❌ Fee not found");
            return res.status(404).json({
                success: false,
                message: "Fee not found",
            });
        }

        const { amount, paid_amount } = feeRows[0];

        // FIX: convert both values to real numbers
        const newPaidTotal = (Number(paid_amount || 0) + Number(txnAmount)).toFixed(2);

        // Compare correctly
        const newStatus = Number(newPaidTotal) >= Number(amount) ? "Paid" : "Partial";


        // Update transaction
        await pool.query(
            `UPDATE PaymentTransactions 
             SET gateway_payment_id=?, status='SUCCESS' 
             WHERE gateway_order_id=?`,
            [razorpay_payment_id, razorpay_order_id]
        );

        // Update fee record

        await pool.query(
            `UPDATE Fees SET paid_amount=?, status=? WHERE fee_id=?`,
            [newPaidTotal, newStatus, fee_id]
        );

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
        });

    } catch (error) {
        console.error("🔥 SERVER ERROR:", error.message, error.stack);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during verification",
        });
    }
};

// ===========================================================
// ✅ Controller 4: Update Fee Status (Admin access)
// ===========================================================
export const updateFeeStatus = async (req, res) => {
    // Logic for updating fee status by admin (already correct)
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.user_type !== "admin") return res.status(403).json({ message: "Access denied. Admin role required." });

        const { feeId } = req.params;
        const { status, paid_amount } = req.body;

        const updateQuery = `
          UPDATE Fees
          SET status = ?, paid_amount = ?
          WHERE fee_id = ?;
        `;
        await pool.query(updateQuery, [status, paid_amount, feeId]);

        res.json({ message: "Fee status updated successfully." });
    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ message: "Server error" });
    }
};



