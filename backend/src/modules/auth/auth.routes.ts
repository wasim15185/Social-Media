import express from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../shared/middlewares/validateRequest";
import { registerSchema, loginSchema } from "./auth.dto";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - username
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Wasim Akram
 *               username:
 *                 type: string
 *                 example: wasim
 *               email:
 *                 type: string
 *                 example: wasim@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 */
router.post(
  "/register",
  validateRequest(registerSchema),
  AuthController.registerUser,
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", validateRequest(loginSchema), AuthController.loginUser);

export default router;