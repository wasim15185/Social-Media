import { Request, Response, NextFunction } from "express";

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
  /**
   * Determine the correct HTTP status code.
   *
   * If the error is an instance of AppError,
   * it will contain a custom statusCode.
   *
   * Otherwise we fallback to 500
   * which represents an Internal Server Error.
   */
  const statusCode = err.statusCode || 500;

  /**
   * Send a standardized JSON error response.
   * This ensures all API errors follow
   * the same response structure.
   */
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
