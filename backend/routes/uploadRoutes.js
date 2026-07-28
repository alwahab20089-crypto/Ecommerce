import express from "express";
import upload from "../middleware/upload.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();

router.post(
    "/",
    protect,
    admin,
    upload.single("image"),
    uploadImage
);

export default router;