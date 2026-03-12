import { Response } from "express";

/**
 * ApiResponse Interface
 * ---------------------------------------------------------
 * Defines the structure of successful API responses.
 *
 * Using a consistent response format helps frontend
 * developers easily understand API responses.
 *
 * Example successful response:
 *
 * {
 *   "success": true,
 *   "message": "User fetched successfully",
 *   "data": {...}
 * }
 */

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * sendResponse Utility Function
 * ---------------------------------------------------------
 * This helper function standardizes API responses.
 *
 * Instead of repeating this code everywhere:
 *
 * res.status(200).json({
 *   success: true,
 *   message: "User fetched successfully",
 *   data: user
 * });
 *
 * We use sendResponse() for cleaner controllers.
 *
 * Advantages:
 *
 * ✔ Consistent API responses
 * ✔ Cleaner controller logic
 * ✔ Easier frontend integration
 *
 * @param res Express response object
 * @param statusCode HTTP response status code
 * @param message Informational message about the response
 * @param data Optional response payload
 */

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
) => {
  /**
   * Construct the response object
   * using the ApiResponse interface.
   */
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  /**
   * Send JSON response to the client
   * with the provided HTTP status code.
   */
  res.status(statusCode).json(response);
};
