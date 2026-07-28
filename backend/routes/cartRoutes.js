import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post("/", addToCart);
router.post("/merge", mergeCart);
router.put("/:itemId", updateCartItem);
router.delete("/:itemId", removeFromCart);
router.delete("/", clearCart);

export default router;