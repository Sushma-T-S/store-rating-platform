import { Response } from "express";
import prisma from "../prisma/prisma";
import { AuthRequest } from "../middleware/authMiddleware";

export const submitRating = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const existingRating = await prisma.rating.findFirst({
      where: {
        userId,
        storeId,
      },
    });

    if (existingRating) {
      const updatedRating = await prisma.rating.update({
        where: {
          id: existingRating.id,
        },
        data: {
          rating,
        },
      });

      return res.json(updatedRating);
    }

    const newRating = await prisma.rating.create({
      data: {
        rating,
        userId,
        storeId,
      },
    });

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};