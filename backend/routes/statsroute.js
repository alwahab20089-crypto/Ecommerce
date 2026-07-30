import express from "express";
const router = express.Router();

import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";


router.get("/stats", async (req, res) => {
  try {
   const [productCount, customerCount, orderCount] = await Promise.all([
  Product.countDocuments(),
  User.countDocuments(),
  Order.countDocuments(),
]);

    
    let maxDiscount = 70; 
    try {
      const topDiscountProduct = await Product.findOne(
        { discountPercentage: { $exists: true } },
        { discountPercentage: 1 }
      ).sort({ discountPercentage: -1 });

      if (topDiscountProduct?.discountPercentage) {
        maxDiscount = topDiscountProduct.discountPercentage;
      }
    } catch (_) {
      // field doesn't exist on the schema yet — ignore, use fallback
    }

    res.json({
  totalProducts: productCount,
  totalCustomers: customerCount,
  totalOrders: orderCount,
  maxDiscount,
});
  } catch (err) {
    console.error("Error computing hero stats:", err);
    res.status(500).json({ error: "Failed to compute stats" });
  }
});

// Formats a raw count into a compact display string, e.g. 12500 -> "12.5K+"
function formatCount(n) {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K+`;
  }
  return `${n}+`;
}

export default router;