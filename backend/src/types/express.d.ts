import { Request } from "express";

 
/**
 * ------------------------------------------------
 * Authenticated User Type
 * ------------------------------------------------
 */
export interface AuthUser {
  id: number;
  username: string;
}

/**
 * Extend Express Request
 */
export interface AuthRequest extends Request {
  user?: AuthUser;
}



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