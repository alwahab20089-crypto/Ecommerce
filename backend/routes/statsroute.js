import express from "express";
const router = express.Router();

// Adjust these imports to match your actual model file paths/names.
import Product from "../models/Product.js";
import User from "../models/User.js"; // or "../models/Customer.js"

/**
 * GET /api/stats
 * Returns live counts for the hero section, shaped as:
 * [
 *   { label: "Happy Customers", value: "12.4K+" },
 *   { label: "Luxury Products", value: "812+" },
 *   { label: "Summer Discounts", value: "70%" }
 * ]
 */
router.get("/stats", async (req, res) => {
  try {
    const [productCount, customerCount] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
    ]);

    // If your Product documents have a discount/discountPercentage field,
    // this pulls the current highest discount running site-wide.
    // If that field doesn't exist yet, this just falls back to a fixed value.
    let maxDiscount = 70; // fallback shown until you add a discount field
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

    const stats = [
      { label: "Happy Customers", value: formatCount(customerCount) },
      { label: "Luxury Products", value: formatCount(productCount) },
      { label: "Summer Discounts", value: `${maxDiscount}%` },
    ];

    res.json(stats);
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