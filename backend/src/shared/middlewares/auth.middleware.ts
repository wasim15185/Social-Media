import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {prisma} from "../../config/prisma";
import { AppError } from "../errors/AppError";

/**
 * Authentication Middleware
 * ---------------------------------------------------------
 * This middleware verifies JWT tokens sent in the request
 * Authorization header and attaches the authenticated user
 * information to the request object.
 *
 * Expected header format:
 *
 * Authorization: Bearer <JWT_TOKEN>
 *
 * Responsibilities:
 *
 * 1. Check if Authorization header exists
 * 2. Extract JWT token
 * 3. Verify token using JWT_SECRET
 * 4. Fetch user from database
 * 5. Attach user information to req.user
 * 6. Allow request to continue
 *
 * If authentication fails → request is rejected.
 */

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    /**
     * Step 1
     * Extract Authorization header
     */
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Authorization token missing", 401);
    }

    /**
     * Step 2
     * Expected format:
     *
     * Bearer TOKEN
     */
    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Invalid authorization format", 401);
    }

    /**
     * Step 3
     * Verify JWT token
     */
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
    };

    /**
     * Step 4
     * Find user in database
     */
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new AppError("User no longer exists", 401);
    }

    /**
     * Step 5
     * Attach authenticated user to request object
     *
     * Now controllers can access:
     *
     * req.user.id
     */
    req.user = {
      id: user.id,
    };

    /**
     * Step 6
     * Continue request
     */
    next();
  } catch (error) {
    /**
     * JWT verification errors will also be caught here
     */
    next(error);
  }
};
