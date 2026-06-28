
import express from "express";
import { updatePassword } from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.put(
  "/update-password",
  authMiddleware,
  updatePassword
);

export default router;