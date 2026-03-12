import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendResponse } from "../../shared/utils/sendResponse";

/**
 * Auth Controller
 * ---------------------------------------------------------
 * The controller layer is responsible for handling HTTP requests
 * and returning responses to the client.
 *
 * Responsibilities of controller:
 * - Receive request data from Express
 * - Call the appropriate service function
 * - Send formatted response to client
 *
 * Business logic SHOULD NOT be placed here.
 * All business logic is handled in the service layer.
 *
 * This separation improves:
 * ✔ code readability
 * ✔ maintainability
 * ✔ testability
 */

export const AuthController = {
  /**
   * Register User Controller
   * ---------------------------------------------------------
   * Handles user registration requests.
   *
   * Request Flow:
   *
   * Client Request
   *        ↓
   * Express Route
   *        ↓
   * validateRequest Middleware (Zod)
   *        ↓
   * registerUser Controller
   *        ↓
   * AuthService.register()
   *        ↓
   * Database (Prisma)
   *        ↓
   * sendResponse()
   *        ↓
   * Client Response
   *
   * @route   POST /api/auth/register
   * @access  Public
   */

  registerUser: asyncHandler(async (req: Request, res: Response) => {
    /**
     * Extract user data from request body.
     * The body has already been validated by Zod middleware.
     */
    const userData = req.body;

    /**
     * Call the service layer to handle
     * the registration logic.
     */
    const result = await AuthService.register(userData);

    /**
     * Send standardized success response.
     *
     * sendResponse ensures all API responses
     * follow the same structure.
     */
    sendResponse(res, 201, "User registered successfully", result);
  }),

  /**
   * Login User Controller
   * ---------------------------------------------------------
   * Handles user login requests.
   *
   * Steps performed:
   *
   * 1. Receive email and password
   * 2. Validate request body (Zod middleware)
   * 3. Call AuthService.login()
   * 4. Verify password
   * 5. Generate JWT token
   * 6. Return user + token
   *
   * @route   POST /api/auth/login
   * @access  Public
   */

  loginUser: asyncHandler(async (req: Request, res: Response) => {
    /**
     * Extract login credentials from request body.
     */
    const loginData = req.body;

    /**
     * Call the service layer to authenticate the user.
     */
    const result = await AuthService.login(loginData);

    /**
     * Return login success response with user and token.
     */
    sendResponse(res, 200, "Login successful", result);
  }),
};
