import { Response } from "express";
import prisma from "../prisma/prisma";
import { AuthRequest } from "../middleware/authMiddleware";

export const ownerDashboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const ownerId = req.user.id;

console.log("Logged In Owner ID:", ownerId);
console.log("Logged In Role:", req.user.role);
    

    const store = await prisma.store.findFirst({
      where: {
        ownerId,
      },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                address: true,
              },
            },
          },
        },
      },
    });
    console.log("Store:", store);

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    const averageRating =
      store.ratings.length > 0
        ? store.ratings.reduce(
            (sum, rating) => sum + rating.rating,
            0
          ) / store.ratings.length
        : 0;

    res.status(200).json({
      storeName: store.name,
      averageRating,
      ratings: store.ratings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};