import express from "express";
import { subscribeNewsletter } from "../controllers/newsletterController.js";

const router = express.Router();

router.post("/subscribe", subscribeNewsletter); // public — no login required to subscribe

export default router;