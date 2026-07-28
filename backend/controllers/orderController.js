import asyncHandler from "../utils/asyncHandler.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import Coupon from "../models/Coupon.js";
import { validateCouponForUser } from "./couponController.js";

// POST /api/orders  { addressId, paymentMethod }
export const createOrder = asyncHandler(async (req, res) => {
  const { addressId, paymentMethod = "cod", couponCode } = req.body;

  const address = await Address.findOne({ _id: addressId, user: req.user._id });
  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name slug thumbnail price salePrice status variants stock"
  );

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Your cart is empty");
  }

  const orderItems = [];
  const decrementedSoFar = [];

  const rollbackStock = async () => {
    for (const d of decrementedSoFar) {
      if (d.variantId) {
        await Product.updateOne(
          { _id: d.productId, "variants._id": d.variantId },
          { $inc: { "variants.$.stock": d.quantity } }
        );
      } else {
        await Product.updateOne({ _id: d.productId }, { $inc: { stock: d.quantity } });
      }
    }
  };

  try {
    for (const item of cart.items) {
      const product = item.product;

      if (!product || product.status !== "Published") {
        res.status(400);
        throw new Error(`"${product?.name || "A product"}" is no longer available`);
      }

      let variant = null;
      let query, update;

      if (item.variant) {
        variant = product.variants.id(item.variant);
        if (!variant) {
          res.status(400);
          throw new Error(`A selected variant for "${product.name}" no longer exists`);
        }
        query = { _id: product._id, "variants._id": item.variant, "variants.stock": { $gte: item.quantity } };
        update = { $inc: { "variants.$.stock": -item.quantity } };
      } else {
        query = { _id: product._id, stock: { $gte: item.quantity } };
        update = { $inc: { stock: -item.quantity } };
      }

      const updated = await Product.findOneAndUpdate(query, update);
      if (!updated) {
        res.status(409);
        throw new Error(`Not enough stock for "${product.name}" — it may have just sold out`);
      }

      decrementedSoFar.push({ productId: product._id, variantId: item.variant, quantity: item.quantity });

      const effectivePrice =
        product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;

      orderItems.push({
        product: product._id,
        variant: item.variant || null,
        name: product.name,
        thumbnail: product.thumbnail,
        variantLabel: variant ? `${variant.size} / ${variant.color.name}` : null,
        price: effectivePrice,
        quantity: item.quantity,
      });
    }
  } catch (err) {
    await rollbackStock();
    throw err;
  }

  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = orderItems.reduce((sum, i) => sum + i.quantity, 0);

  let discountAmount = 0;
  let appliedCouponCode = null;

  if (couponCode) {
    const result = await validateCouponForUser(couponCode, req.user._id, subtotal);
    if (!result.valid) {
      await rollbackStock(); // stock was already deducted above — undo it before rejecting
      res.status(400);
      throw new Error(result.message);
    }
    discountAmount = result.discountAmount;
    appliedCouponCode = result.coupon.code;
  }

  const totalPrice = subtotal - discountAmount;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress: {
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    },
    paymentMethod,
    paymentStatus: "pending",
    orderStatus: "Processing",
    totalItems,
    subtotal,
    coupon: { code: appliedCouponCode, discountAmount },
    totalPrice,
  });

  if (appliedCouponCode) {
    await Coupon.updateOne({ code: appliedCouponCode }, { $inc: { usedCount: 1 } });
  }

  cart.items = [];
  await cart.save();

  res.status(201).json(order);
});     
// GET /api/orders
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(order);
});

// PUT /api/orders/:id/cancel
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.orderStatus !== "Processing") {
    res.status(400);
    throw new Error("This order can no longer be cancelled");
  }

  // restore stock
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    if (item.variant) {
      const variant = product.variants.id(item.variant);
      if (variant) variant.stock += item.quantity;
    } else {
      product.stock += item.quantity;
    }
    await product.save();
  }

  order.orderStatus = "Cancelled";
  await order.save();

  res.json(order);
});
// GET /api/orders/admin/all  (admin) — ?status=&page=&limit=
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const query = {};
  if (status) query.orderStatus = status;

  const totalOrders = await Order.countDocuments(query);

  const orders = await Order.find(query)
    .populate("user", "firstName lastName email")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ orders, currentPage: Number(page), totalPages: Math.ceil(totalOrders / limit), totalOrders });
});

// GET /api/orders/admin/:id  (admin) — any order, not just the requester's own
export const getAdminOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "firstName lastName email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(order);
});

// PUT /api/orders/admin/:id/status  { orderStatus?, paymentStatus? }
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;

  const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
  if (orderStatus && !validStatuses.includes(orderStatus)) {
    res.status(400);
    throw new Error("Invalid order status");
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const wasAlreadyCancelled = order.orderStatus === "Cancelled";

  // restore stock only when newly transitioning INTO Cancelled — never twice
  if (orderStatus === "Cancelled" && !wasAlreadyCancelled) {
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (!product) continue;

      if (item.variant) {
        const variant = product.variants.id(item.variant);
        if (variant) variant.stock += item.quantity;
      } else {
        product.stock += item.quantity;
      }
      await product.save();
    }
  }

  if (orderStatus) order.orderStatus = orderStatus;

  // COD money is collected on delivery — auto-mark paid unless the admin set a status explicitly
  if (orderStatus === "Delivered" && order.paymentMethod === "cod" && !paymentStatus) {
    order.paymentStatus = "paid";
  }

  if (paymentStatus) order.paymentStatus = paymentStatus;

  await order.save();
  res.json(order);
});