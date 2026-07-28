import asyncHandler from "../utils/asyncHandler.js";
import validator from "validator";
import Newsletter from "../models/Newsletter.js";
import sendEmail from "../utils/sendEmail.js";

// POST /api/newsletter/subscribe  { email }
export const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !validator.isEmail(email)) {
    res.status(400);
    throw new Error("Please provide a valid email address.");
  }

  const normalizedEmail = email.toLowerCase();
  let subscriber = await Newsletter.findOne({ email: normalizedEmail });

  if (subscriber && subscriber.isActive) {
    res.status(400);
    throw new Error("This email is already subscribed.");
  }

  if (subscriber && !subscriber.isActive) {
    // previously unsubscribed — reactivate rather than creating a duplicate
    subscriber.isActive = true;
    await subscriber.save();
  } else {
    subscriber = await Newsletter.create({ email: normalizedEmail });
  }

  // best-effort — a failed welcome email shouldn't undo a successful subscription
  try {
    await sendEmail({
      to: normalizedEmail,
      subject: "Welcome to TrendCart!",
      html: `
        <p>Hi there,</p>
        <p>Thanks for subscribing to the TrendCart newsletter! You'll be the first to hear about exclusive discounts, new arrivals, and members-only deals.</p>
        <p>Happy shopping,<br/>The TrendCart Team</p>
      `,
    });
  } catch (err) {
    console.error("Newsletter welcome email failed to send:", err);
  }

  res.status(200).json({ success: true, message: "You're subscribed! Check your inbox for a welcome email." });
});