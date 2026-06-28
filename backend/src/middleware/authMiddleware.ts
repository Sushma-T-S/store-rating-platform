import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

console.log("Token:", token);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET as string
);

console.log("Decoded:", decoded);

    req.user = decoded;
    

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default authMiddleware;