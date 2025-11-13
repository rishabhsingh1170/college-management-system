import transporter from "../config/mailer.js";
import { pool } from "../config/database.js";

export const sendContactMail = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Input Validation
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "All fields are required for the contact form." });
    }

    // Email Content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "rishabhsingh1170@gmail.com",
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h3>New Inquiry from Website Contact Form</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Your message has been sent successfully. We will respond soon!",
    });
  } catch (err) {
    console.error("Error sending contact email:", err);
    res
      .status(500)
      .json({ message: "Failed to send message. Please try again later." });
  }
};
