import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import storeRoutes from "./routes/storeRoutes";
import ratingRoutes from "./routes/ratingRoutes";
import ownerRoutes from "./routes/ownerRoutes";
import userRoutes from "./routes/userRoutes";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/user", userRoutes);

export default app;

