import express from "express";
import {
  getStores,
  searchStores,
} from "../controllers/storeController";

import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getStores);

router.get("/search", authMiddleware, searchStores);

export default router;

