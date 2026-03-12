import { Request, Response, NextFunction } from "express";

/**
 * asyncHandler Utility
 * ---------------------------------------------------------
 * This utility function is used to simplify error handling
 * in asynchronous Express route handlers (controllers).
 *
 * In a typical Express application, when using async/await
 * inside controllers, we need to wrap the logic inside
 * try/catch blocks to catch errors.
 *
 * Example without asyncHandler:
 *
 * export const getUser = async (req, res, next) => {
 *   try {
 *     const user = await userService.getUserById(req.params.id);
 *     res.json(user);
 *   } catch (error) {
 *     next(error);
 *   }
 * };
 *
 * This pattern becomes repetitive when used in many controllers.
 *
 * The asyncHandler function eliminates the need for try/catch
 * by automatically catching rejected promises and forwarding
 * the error to Express's global error handling middleware.
 *
 * Benefits:
 * ✔ Cleaner controllers
 * ✔ Less repetitive code
 * ✔ Centralized error management
 *
 * How it works:
 * - It wraps the controller function
 * - Executes the controller as a Promise
 * - If the promise rejects → it forwards the error to next()
 *
 * Express automatically sends this error to the global
 * error handling middleware.
 */

export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    /**
     * Promise.resolve() ensures the function result is treated
     * as a promise even if it returns a synchronous value.
     *
     * If an error occurs or the promise rejects,
     * the .catch(next) passes the error to Express middleware.
     */
    Promise.resolve(fn(req, res, next)).catch(next);
  };