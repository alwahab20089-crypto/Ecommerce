import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createProduct, getProducts, getProduct, updateProduct, deleteProduct,
  createProductReview, updateProductReview, deleteProductReview,
  getAdminProducts, // <-- new
} from "../controllers/productController.js";

const router = express.Router();

router.route("/")
  .get(getProducts)
  .post(protect, admin, createProduct);

router.get("/admin/list", protect, admin, getAdminProducts); // <-- new, before /:slug

router.route("/:id/reviews")
  .post(protect, createProductReview)
  .put(protect, updateProductReview)
  .delete(protect, deleteProductReview);

router.route("/:slug")
  .get(getProduct)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;