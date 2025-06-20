import jwt from "jsonwebtoken"
import "dotenv/config"
import { Request, Response, NextFunction } from "express";  


export const userMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token after "Bearer"

  if (!token) {
    return res.status(401).json({ message: "Token format invalid" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_USER_SECRET!) as { id: string };
    // @ts-ignore
    req.userId = decodedToken.id;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized user" });
  }
};
