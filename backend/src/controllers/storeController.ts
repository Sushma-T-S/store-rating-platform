import { Request, Response } from "express";
import prisma from "../prisma/prisma";

export const getStores = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const stores = await prisma.store.findMany({
      include: {
        ratings: true,
      },
    });

    const data = stores.map((store) => {
      const averageRating =
        store.ratings.length > 0
          ? store.ratings.reduce((sum, r) => sum + r.rating, 0) /
            store.ratings.length
          : 0;

      const userRating = store.ratings.find(
        (r) => r.userId === userId
      );

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating,
        userRating: userRating ? userRating.rating : null,
      };
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const searchStores = async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword as string;

    const stores = await prisma.store.findMany({
      where: {
        OR: [
          {
            name: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            address: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        ratings: true,
      },
    });

    const result = stores.map((store) => {
      const averageRating =
        store.ratings.length > 0
          ? store.ratings.reduce((sum, r) => sum + r.rating, 0) /
            store.ratings.length
          : 0;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};