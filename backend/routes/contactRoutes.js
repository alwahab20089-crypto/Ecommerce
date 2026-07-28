import express from "express";
import { submitContactForm } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", submitContactForm); // public — guests can contact support too, no login required

export default router;