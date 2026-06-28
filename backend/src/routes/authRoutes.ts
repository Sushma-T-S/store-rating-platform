import express from "express";
import { register, login } from "../controllers/authController";
import { validateUser } from "../middleware/validationMiddleware";

const router = express.Router();

router.post(
  "/register",
  validateUser,
  register
);

router.post("/login", login);

export default router;