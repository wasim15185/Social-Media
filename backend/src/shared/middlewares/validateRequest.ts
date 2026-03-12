import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * validateRequest Middleware
 * ---------------------------------------------------------
 * This middleware validates incoming request data
 * using a Zod schema.
 *
 * It ensures that the request body, query parameters,
 * or route parameters follow the expected structure
 * before reaching the controller.
 *
 * Benefits:
 * ✔ Prevents invalid data from entering the application
 * ✔ Provides clear validation error messages
 * ✔ Keeps controller logic clean
 * ✔ Ensures API reliability
 *
 * Example usage in routes:
 *
 * router.post(
 *   "/register",
 *   validateRequest(registerSchema),
 *   registerUser
 * );
 *
 * If validation fails, a 400 error response is returned.
 */

export const validateRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      /**
       * Parse and validate the request body
       * using the provided Zod schema.
       */
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      /**
       * If validation succeeds,
       * continue to the next middleware or controller.
       */
      next();
    } catch (error: any) {
      /**
       * If validation fails, return a structured error response.
       */
      res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors,
      });
    }
  };
