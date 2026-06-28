import express from "express";


import {
  getDashboard,
  getUsers,
  getStores,
  addUser,
  addStore,
  filterUsers,
  getUserById
} from "../controllers/adminController";
import authMiddleware from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";
import { validateUser } from "../middleware/validationMiddleware";

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getDashboard
);

router.get(
  "/users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getUsers
);

router.get(
  "/stores",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getStores
);
router.post(
  "/add-store",
  authMiddleware,
  roleMiddleware("ADMIN"),
  addStore
);
router.post(
  "/add-user",
  authMiddleware,
  roleMiddleware("ADMIN"),
  addUser
);

router.post(
  "/add-user",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateUser,
  addUser
);

router.get(
  "/filter-users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  filterUsers
);
router.get(
  "/user/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getUserById
);
router.get(
  "/users/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getUserById
);
export default router;

