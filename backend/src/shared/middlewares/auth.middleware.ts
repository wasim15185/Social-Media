import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import { AppError } from "../errors/AppError";

/**
 * ---------------------------------------------------------
 * Authentication Middleware
 * ---------------------------------------------------------
 *
 * Purpose:
 * Verify JWT token and attach authenticated user info
 * to the request object.
 *
 * Expected Header:
 * Authorization: Bearer <JWT_TOKEN>
 *
 * Flow:
 * 1. Check Authorization header
 * 2. Extract token
 * 3. Verify JWT token
 * 4. Fetch user from database
 * 5. Attach user info to req.user
 * 6. Continue request
 */

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    /**
     * STEP 1
     * Extract Authorization header
     */
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Authorization token missing", 401);
    }

    /**
     * STEP 2
     * Extract token from:
     * Bearer TOKEN
     */
    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Invalid authorization format", 401);
    }

    /**
     * STEP 3
     * Verify JWT token
     */
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
    };

    /**
     * STEP 4
     * Fetch user from database
     *
     * Only fetch necessary fields for performance
     */
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      throw new AppError("User no longer exists", 401);
    }

    /**
     * STEP 5
     * Attach authenticated user to request
     *
     * Controllers can now access:
     *
     * req.user.id
     * req.user.username
     */
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    /**
     * STEP 6
     * Continue request
     */
    next();
  } catch (error) {
    next(error);
  }
};
