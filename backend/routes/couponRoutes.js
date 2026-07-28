import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { applyCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon } from "../controllers/couponController.js";

const router = express.Router();

router.use(protect);

router.post("/apply", applyCoupon); // any logged-in user — checkout is login-only anyway

router.get("/admin/all", admin, getCoupons);
router.post("/", admin, createCoupon);
router.put("/:code", admin, updateCoupon);
router.delete("/:code", admin, deleteCoupon);

export default router;