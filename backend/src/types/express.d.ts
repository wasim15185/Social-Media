import { Request } from "express";

/**
 * Extending Express Request interface
 * to include authenticated user information.
 */

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
    };
  }
}
