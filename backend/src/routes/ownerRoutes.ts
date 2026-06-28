import express from "express";
import { ownerDashboard } from "../controllers/ownerController";

import authMiddleware from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("OWNER"),
  ownerDashboard
);

export default router;