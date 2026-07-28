import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  name: { type: String, required: true }, // snapshot — survives later product edits/deletion
  thumbnail: { type: String },
  variantLabel: { type: String, default: null }, // e.g. "M / Red"
  price: { type: Number, required: true }, // snapshot price at order time
  quantity: { type: Number, required: true, min: 1 },
});

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "paypal"], // card/paypal reserved for when gateways are added
      default: "cod",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    subtotal: { type: Number, required: true }, // sum of items, before any discount
    coupon: {
      code: { type: String, default: null },
      discountAmount: { type: Number, default: 0 },
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    totalItems: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);