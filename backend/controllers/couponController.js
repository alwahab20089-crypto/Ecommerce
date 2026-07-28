import asyncHandler from "../utils/asyncHandler.js";
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";

// shared logic — used by both the checkout "apply" preview AND order creation itself.
// Order creation calls this again with the server's own subtotal, so a tampered
// client-side discount can never make it into a real order.
export const validateCouponForUser = async (code, userId, subtotal) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) return { valid: false, message: "Invalid coupon code" };
  if (!coupon.isActive) return { valid: false, message: "This coupon is no longer active" };
  if (coupon.expiryDate < new Date()) return { valid: false, message: "This coupon has expired" };
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, message: "This coupon has reached its usage limit" };
  }
  if (subtotal < coupon.minOrderValue) {
    return { valid: false, message: `Minimum order value for this coupon is $${coupon.minOrderValue}` };
  }

  const userUsageCount = await Order.countDocuments({ user: userId, "coupon.code": coupon.code });
  if (userUsageCount >= coupon.perUserLimit) {
    return { valid: false, message: "You've already used this coupon the maximum number of times" };
  }

  let discountAmount =
    coupon.discountType === "percentage" ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;

  if (coupon.discountType === "percentage" && coupon.maxDiscountAmount) {
    discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
  }
  discountAmount = Math.min(discountAmount, subtotal); // never discount more than the order is worth

  return { valid: true, coupon, discountAmount: Math.round(discountAmount * 100) / 100 };
};

// POST /api/coupons/apply  { code, subtotal }  — preview only, no order created, no usage counted
export const applyCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;

  if (!code || subtotal === undefined) {
    res.status(400);
    throw new Error("Coupon code and subtotal are required");
  }

  const result = await validateCouponForUser(code, req.user._id, subtotal);
  if (!result.valid) {
    res.status(400);
    throw new Error(result.message);
  }

  res.json({ code: result.coupon.code, discountAmount: result.discountAmount });
});

// --- Admin CRUD ---

export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons);
});

export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountType, discountValue, maxDiscountAmount, minOrderValue, usageLimit, perUserLimit, expiryDate, isActive } = req.body;

  if (!code || !discountType || discountValue === undefined || !expiryDate) {
    res.status(400);
    throw new Error("Code, discount type, discount value, and expiry date are required");
  }

  const exists = await Coupon.findOne({ code: code.toUpperCase() });
  if (exists) {
    res.status(400);
    throw new Error("A coupon with this code already exists");
  }

  const coupon = await Coupon.create({
    code, discountType, discountValue, maxDiscountAmount, minOrderValue, usageLimit, perUserLimit, expiryDate, isActive,
    createdBy: req.user._id,
  });

  res.status(201).json(coupon);
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() });
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  if (coupon.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized. Only the admin who created this coupon can edit it.");
  }

  const { discountType, discountValue, maxDiscountAmount, minOrderValue, usageLimit, perUserLimit, expiryDate, isActive } = req.body;
  if (discountType !== undefined) coupon.discountType = discountType;
  if (discountValue !== undefined) coupon.discountValue = discountValue;
  if (maxDiscountAmount !== undefined) coupon.maxDiscountAmount = maxDiscountAmount;
  if (minOrderValue !== undefined) coupon.minOrderValue = minOrderValue;
  if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
  if (perUserLimit !== undefined) coupon.perUserLimit = perUserLimit;
  if (expiryDate !== undefined) coupon.expiryDate = expiryDate;
  if (isActive !== undefined) coupon.isActive = isActive;
  // `code` itself is intentionally not editable — changing it would orphan past orders' coupon references

  await coupon.save();
  res.json(coupon);
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() });
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  if (coupon.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized. Only the admin who created this coupon can delete it.");
  }

  await coupon.deleteOne();
  res.json({ message: "Coupon deleted successfully" });
});