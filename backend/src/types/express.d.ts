import { Request } from "express";

/**
 * Extending Express Request interface
 * to include authenticated user information.
 */

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        email?: string;
      };
    }
  }
}