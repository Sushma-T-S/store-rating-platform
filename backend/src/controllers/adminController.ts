import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma/prisma";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    res.json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const addStore = async (req: Request, res: Response) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId,
      },
    });

    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getStores = async (req: Request, res: Response) => {
  try {
    const stores = await prisma.store.findMany({
      include: {
        ratings: true,
      },
      orderBy: {
        name: "asc",
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
        email: store.email,
        address: store.address,
        averageRating,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const filterUsers = async (req: Request, res: Response) => {
  try {
    const { name, email, address, role } = req.query;

    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: (name as string) || "",
          mode: "insensitive",
        },
        email: {
          contains: (email as string) || "",
          mode: "insensitive",
        },
        address: {
          contains: (address as string) || "",
          mode: "insensitive",
        },
        role: role ? (role as any) : undefined,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const getUserById = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        stores: {
          include: {
            ratings: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let averageRating = null;

    if (
      user.role === "OWNER" &&
      user.stores.length > 0
    ) {
      const ratings = user.stores[0].ratings;

      averageRating =
        ratings.length > 0
          ? ratings.reduce(
              (sum, rating) => sum + rating.rating,
              0
            ) / ratings.length
          : 0;
    }

    const { password, ...userWithoutPassword } = user;

res.json({
  ...userWithoutPassword,
  averageRating,
});
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};