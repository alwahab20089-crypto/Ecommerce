import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.use(protect);

router.post("/", createOrder);
router.get("/", getMyOrders);

router.get("/admin/all", admin, getAllOrders);
router.get("/admin/:id", admin, getAdminOrderById);
router.put("/admin/:id/status", admin, updateOrderStatus);

router.get("/:id", getOrderById);
router.put("/:id/cancel", cancelOrder);

export default router;