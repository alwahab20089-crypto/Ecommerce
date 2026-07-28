import asyncHandler from "../utils/asyncHandler.js";
import sendEmail from "../utils/sendEmail.js";

// POST /api/contact  { name, email, subject, message }
export const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error("Please fill in all fields.");
  }

  // critical — notify the store's support inbox
  await sendEmail({
    to: process.env.EMAIL_USER,
    subject: `New Contact Form Submission: ${subject}`,
    html: `
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `,
  });

  // best-effort auto-reply — a failure here shouldn't fail the whole request
  try {
    await sendEmail({
      to: email,
      subject: "We've received your message — TrendCart Support",
      html: `
        <p>Hi ${name},</p>
        <p>Thanks for reaching out to TrendCart! We've received your message and our support team will get back to you within <strong>48 hours</strong>.</p>
        <p>For your records, here's a copy of what you sent us:</p>
        <blockquote style="border-left: 3px solid #EAB308; padding-left: 12px; color: #555;">
          <strong>${subject}</strong><br/>
          ${message.replace(/\n/g, "<br/>")}
        </blockquote>
        <p>Thanks for your patience,<br/>The TrendCart Team</p>
      `,
    });
  } catch (err) {
    console.error("Auto-reply email failed to send:", err);
  }

  res.status(200).json({ success: true, message: "Your message has been sent. We'll get back to you within 48 hours." });
});