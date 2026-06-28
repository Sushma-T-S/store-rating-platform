import express from "express";
import { submitRating } from "../controllers/ratingController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, submitRating);

export default router;