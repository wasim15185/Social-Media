/**
 * AppError Class
 * ---------------------------------------------------------
 * This class is used to create custom application errors
 * with a specific HTTP status code.
 *
 * Normally, JavaScript errors do not include HTTP status codes.
 * For example:
 *
 * throw new Error("User not found");
 *
 * This does not indicate whether the error should return
 * 404, 400, or 500.
 *
 * By using AppError we can define both:
 * - error message
 * - HTTP status code
 *
 * Example usage:
 *
 * throw new AppError("User not found", 404);
 *
 * This error will later be processed by the
 * global error handling middleware.
 */

export class AppError extends Error {
  /**
   * HTTP status code associated with the error
   * Example: 400, 404, 500
   */
  statusCode: number;

  constructor(message: string, statusCode: number) {
    /**
     * Call the parent Error constructor
     * to set the error message.
     */
    super(message);

    /**
     * Store the HTTP status code so that
     * the global error handler can use it.
     */
    this.statusCode = statusCode;

    /**
     * Error.captureStackTrace improves debugging by
     * removing the constructor from the stack trace.
     *
     * This makes error logs easier to read and
     * helps developers identify where the error occurred.
     */
    Error.captureStackTrace(this, this.constructor);
  }
}
