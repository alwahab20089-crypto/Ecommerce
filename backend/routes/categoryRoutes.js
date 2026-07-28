import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.route("/")
  .get(getCategories)
  .post(protect, admin, createCategory);

router.route("/:slug")
  .get(getCategory)
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

export default router;