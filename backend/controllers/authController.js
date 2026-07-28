import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import validator from "validator";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password
  ) {
    res.status(400);
    throw new Error("Please fill all required fields.");
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email address.");
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error(
      "Password must be at least 8 characters."
    );
  }

  const userExists = await User.findOne({
    email: email.toLowerCase(),
  });

  if (userExists) {
    res.status(400);
    throw new Error("Email is already registered.");
  }

  const user = await User.create({
    firstName,
    lastName,
    email: email.toLowerCase(),
    password,
    phone,
  });

  res.status(201).json({
    success: true,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id),
  });
});
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }
  if (!user.password) {
  res.status(400);
  throw new Error("This account uses Google Sign-In. Please continue with Google.");
}

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  res.json({
    success: true,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id),
  });
});

// POST /api/auth/forgot-password  { email }
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email?.toLowerCase() });

  // always respond the same way whether or not the email exists —
  // otherwise this endpoint could be used to check which emails are registered
  const genericResponse = { success: true, message: "If that email is registered, a reset link has been sent." };

  if (!user) {
    return res.json(genericResponse);
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Reset your TrendCart password",
      html: `
        <p>Hi ${user.firstName},</p>
        <p>You requested a password reset. This link expires in 10 minutes.</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });
  } catch (err) {
    // email failed to send — undo the token so it can't be used, let them retry
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(500);
    throw new Error("Could not send reset email. Please try again.");
  }

  res.json(genericResponse);
});

// POST /api/auth/reset-password/:token  { password }
export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password || password.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters.");
  }

  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset link. Please request a new one.");
  }

  user.password = password; // pre-save hook hashes this automatically
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // log them straight in — same response shape as login/register
  res.json({
    success: true,
    user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
    token: generateToken(user._id),
  });
});
  

export const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  

  if (!credential) {
    res.status(400);
    throw new Error("Missing Google credential.");
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
  res.status(401);
  throw new Error("Invalid Google credential.");
}

  const { sub: googleId, email, given_name, family_name, picture } = payload;

  let user = await User.findOne({ googleId });

  if (!user) {
    // check if this email already has a password-based account — link instead of duplicating
    user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      user.googleId = googleId;
      if (!user.avatar) user.avatar = picture;
      await user.save();
    } else {
      user = await User.create({
        firstName: given_name || "Google",
        lastName: family_name || "User",
        email: email.toLowerCase(),
        googleId,
        avatar: picture,
        isVerified: true, // Google already verified this email
      });
    }
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Your account has been deactivated. Please contact support.");
  }

  res.json({
    success: true,
    user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
    token: generateToken(user._id),
  });
});
