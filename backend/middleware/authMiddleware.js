import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      res.status(401);
      throw new Error("Invalid or expired token.");
    }

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      res.status(401);
      throw new Error("User not found.");
    }

    if (!req.user.isActive) {
      res.status(403);
      throw new Error("Your account has been deactivated. Please contact support.");
    }

    next();
  } else {
    res.status(401);
    throw new Error("Not authorized. No token provided.");
  }
});

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  res.status(403);
  throw new Error("Access denied. Admins only.");
};