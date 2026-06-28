import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma/prisma";
import generateToken from "../utils/generateToken";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, address } = req.body;

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
        role: "USER",
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log("Login request:", email, password);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password entered:", password);
    console.log("Stored hash:", user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const token = generateToken(user.id, user.role);

    res.status(200).json({
      token,
      role: user.role,
      userId: user.id,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};