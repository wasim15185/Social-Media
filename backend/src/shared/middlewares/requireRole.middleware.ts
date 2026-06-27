// Eta Jokon Admin/User Role Implemnt korbo tokon use korbo

import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export const requireRole = (...allowedRoles: ("USER" | "ADMIN")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("Forbidden: insufficient permissions", 403);
    }

    next();
  };
};
