import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    maxDiscountAmount: { type: Number, default: null }, // cap for percentage discounts
    minOrderValue: { type: Number, default: 0 },
    usageLimit: { type: Number, default: null }, // null = unlimited total uses
    usedCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);