import { Request, Response, NextFunction } from "express";

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Validation Middleware Running");

  const { name, email, password, address } = req.body;

  if (!name || !email || !password || !address) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (name.length < 20 || name.length > 60) {
    return res.status(400).json({
      message: "Name must be between 20 and 60 characters",
    });
  }

  if (address.length > 400) {
    return res.status(400).json({
      message: "Address cannot exceed 400 characters",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be 8-16 characters with one uppercase letter and one special character",
    });
  }

  next();
};