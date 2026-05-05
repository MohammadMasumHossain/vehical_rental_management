import { Response, NextFunction } from "express";

export const requireAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }
  next();
};
