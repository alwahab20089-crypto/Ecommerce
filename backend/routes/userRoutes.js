import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { getUsers, updateUser } from "../controllers/userController.js";

const router = express.Router();

router.use(protect, admin);

router.get("/", getUsers);
router.put("/:id", updateUser);

export default router;