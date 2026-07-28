import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js";

const router = express.Router();

router.route("/")
  .get(getBrands)
  .post(protect, admin, createBrand);

router.route("/:slug")
  .get(getBrand)
  .put(protect, admin, updateBrand)
  .delete(protect, admin, deleteBrand);

export default router;