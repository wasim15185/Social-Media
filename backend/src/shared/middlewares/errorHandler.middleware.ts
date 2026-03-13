import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

/**
 * Global Error Handling Middleware
 * ---------------------------------------------------------
 * This middleware acts as a centralized error handler
 * for the entire Express application.
 *
 * Any error thrown inside controllers, services, or middleware
 * will eventually be passed to this function.
 *
 * This works especially well when combined with:
 * - asyncHandler utility
 * - custom AppError class
 *
 * Responsibilities of this middleware:
 *
 * 1. Catch all errors thrown in the application
 * 2. Determine the correct HTTP status code
 * 3. Send a standardized error response to the client
 * 4. Prevent application crashes caused by unhandled errors
 *
 * Example error response format:
 *
 * {
 *   "success": false,
 *   "message": "User not found"
 * }
 *
 * Important:
 * This middleware must be registered AFTER all routes
 * in the Express application.
 */



export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};