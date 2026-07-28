import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { getSalesReport } from "../controllers/reportController.js";

const router = express.Router();

router.get("/sales", protect, admin, getSalesReport);

export default router;